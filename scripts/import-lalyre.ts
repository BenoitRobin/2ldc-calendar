process.loadEnvFile();

import { eq } from 'drizzle-orm';
import { createDbClient } from '../src/lib/server/db/client';
import { user, event } from '../src/lib/server/db/schema';

// Importe les dates publiées sur le site de présences de La Lyre. Rejouable : une date
// déjà présente (même nom, même jour) est ignorée, donc relancer le script n'ajoute
// que les nouvelles. `--dry-run` affiche ce qui serait ajouté sans rien écrire.
const SOURCE_URL = 'https://presence.lalyre.com/vue/presences.php';

type ImportedEvent = {
	name: string;
	date: string;
	startTime: string | null;
	endTime: string | null;
	location: string | null;
};

function decodeEntities(text: string) {
	return text
		.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
		.replace(/&quot;/g, '"')
		.replace(/&apos;|&#039;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&');
}

// Chaque date a une fenêtre modale (id="myModal<n>") dont le texte suit toujours le
// même ordre : nom, date (jj/mm/aa), horaire (HH:MM - HH:MM), puis lieu s'il y en a un.
function parseEvents(html: string): ImportedEvent[] {
	const events: ImportedEvent[] = [];
	for (const [, body] of html.matchAll(/id="myModal\d+"([\s\S]*?)Fermer/g)) {
		const fields = body
			.split(/<[^>]+>/)
			.map((t) => decodeEntities(t).trim())
			.filter((t) => t && t !== '×' && !t.startsWith('role='));

		const dateIndex = fields.findIndex((f) => /^\d{2}\/\d{2}\/\d{2}$/.test(f));
		if (dateIndex < 1) continue;
		const [day, month, year] = fields[dateIndex].split('/');
		const times = fields[dateIndex + 1]?.match(/^(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/);
		const location = times ? fields[dateIndex + 2] : fields[dateIndex + 1];

		const startTime = times?.[1] ?? null;
		// La source met l'heure de fin égale au début quand elle n'est pas connue.
		const endTime = times && times[2] !== times[1] ? times[2] : null;

		events.push({
			name: fields[dateIndex - 1],
			date: `20${year}-${month}-${day}`,
			startTime,
			endTime,
			location: location || null
		});
	}
	return events;
}

async function main() {
	if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
	const dryRun = process.argv.includes('--dry-run');

	const response = await fetch(SOURCE_URL);
	if (!response.ok) throw new Error(`${SOURCE_URL} a répondu ${response.status}`);
	const imported = parseEvents(await response.text());
	if (imported.length === 0) {
		console.error('Aucune date trouvée sur la page : son format a peut-être changé.');
		process.exitCode = 1;
		return;
	}

	const db = createDbClient(process.env.DATABASE_URL, process.env.TURSO_AUTH_TOKEN || undefined);

	const [admin] = await db
		.select({ id: user.id })
		.from(user)
		.where(eq(user.role, 'admin'))
		.limit(1);
	if (!admin) {
		console.error('Aucun compte admin trouvé. Lancez d’abord `pnpm bootstrap:admin`.');
		process.exitCode = 1;
		return;
	}

	const existing = await db.select({ name: event.name, date: event.date }).from(event);
	const known = new Set(existing.map((e) => `${e.date}|${e.name}`));
	const toAdd = imported.filter((e) => !known.has(`${e.date}|${e.name}`));

	for (const e of imported) {
		const status = toAdd.includes(e) ? '+ ajout' : '= déjà là';
		const time = [e.startTime, e.endTime].filter(Boolean).join('–');
		console.log(
			`${status}  ${e.date}  ${e.name}${time ? `  ${time}` : ''}${e.location ? `  (${e.location})` : ''}`
		);
	}

	if (dryRun || toAdd.length === 0) {
		console.log(dryRun ? '\nSimulation : rien n’a été écrit.' : '\nRien de nouveau à importer.');
		return;
	}

	await db.insert(event).values(toAdd.map((e) => ({ ...e, createdBy: admin.id })));
	console.log(`\n${toAdd.length} date(s) ajoutée(s).`);
}

main().catch((err) => {
	console.error(err);
	process.exitCode = 1;
});
