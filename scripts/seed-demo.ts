process.loadEnvFile();

import { eq, inArray, like } from 'drizzle-orm';
import { betterAuth } from 'better-auth/minimal';
import { createAuthOptions } from '../src/lib/server/auth-options';
import { createDbClient } from '../src/lib/server/db/client';
import { user, event } from '../src/lib/server/db/schema';
import { setAttendanceResponse, type PresenceValue } from '../src/lib/server/attendance';

// Rejouable (PRD phase 13) : nettoie l'ancien jeu de démo avant d'en recréer un,
// identifié par le domaine d'email des musiciens et les noms d'évènements ci-dessous.
const DEMO_EMAIL_DOMAIN = '@demo.local';
const DEMO_PASSWORD = 'Demo1234!';

// Prénoms seuls : c'est ce qui sert à se connecter (specs/user-auth), donc ça doit
// rester unique dans l'équipe.
const MUSICIANS = [
	{ email: `alice${DEMO_EMAIL_DOMAIN}`, name: 'Alice' },
	{ email: `baptiste${DEMO_EMAIL_DOMAIN}`, name: 'Baptiste' },
	{ email: `chloe${DEMO_EMAIL_DOMAIN}`, name: 'Chloé' },
	{ email: `david${DEMO_EMAIL_DOMAIN}`, name: 'David' },
	{ email: `emma${DEMO_EMAIL_DOMAIN}`, name: 'Emma' },
	{ email: `hugo${DEMO_EMAIL_DOMAIN}`, name: 'Hugo' }
];

const EVENTS = [
	{
		name: 'Répétition générale — cordes',
		date: '2026-08-20',
		startTime: '19:00',
		endTime: '21:00',
		location: 'Salle A',
		description: 'Répétition centrée sur les pupitres de cordes, morceau du concert de printemps.'
	},
	{
		name: 'Répétition générale — bois et cuivres',
		date: '2026-09-10',
		startTime: '19:00',
		endTime: '21:30',
		location: 'Salle A',
		description: null
	},
	{
		name: 'Concert de printemps',
		date: '2026-10-04',
		startTime: '20:30',
		endTime: null,
		location: 'Salle polyvalente',
		description: 'Concert public annuel. Merci de venir 45 minutes avant pour la mise en place.'
	},
	{
		name: 'Répétition tutti',
		date: '2026-10-22',
		startTime: '19:00',
		endTime: '21:00',
		location: 'Salle A',
		description: null
	},
	{
		name: "Assemblée générale de l'association",
		date: '2026-11-15',
		startTime: '18:30',
		endTime: null,
		location: 'Salle de réunion',
		description: 'Bilan de saison et élection du bureau.'
	}
];

// Assignation déterministe (pas aléatoire) pour un jeu de données stable d'un run à
// l'autre : mélange de oui/non/indécis, et certaines cases volontairement laissées
// sans réponse pour tester cet état.
const STATUS_CYCLE: (PresenceValue | null)[] = ['oui', 'oui', 'non', 'indecis', null, 'oui'];

async function main() {
	if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

	const db = createDbClient(process.env.DATABASE_URL, process.env.TURSO_AUTH_TOKEN || undefined);
	const auth = betterAuth(
		createAuthOptions({
			baseURL: process.env.ORIGIN,
			secret: process.env.BETTER_AUTH_SECRET,
			db
		})
	);

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

	console.log('Nettoyage de l’ancien jeu de démo...');
	await db.delete(user).where(like(user.email, `%${DEMO_EMAIL_DOMAIN}`));
	await db.delete(event).where(
		inArray(
			event.name,
			EVENTS.map((e) => e.name)
		)
	);

	console.log('Création des musiciens...');
	const musicianIds: string[] = [];
	for (const musician of MUSICIANS) {
		const { user: created } = await auth.api.createUser({
			body: {
				email: musician.email,
				name: musician.name,
				role: 'standard',
				password: DEMO_PASSWORD
			}
		});
		musicianIds.push(created.id);
	}

	console.log('Création des évènements...');
	const eventIds: string[] = [];
	for (const evt of EVENTS) {
		const [created] = await db
			.insert(event)
			.values({ ...evt, createdBy: admin.id })
			.returning({ id: event.id });
		eventIds.push(created.id);
	}

	console.log('Création des réponses de présence...');
	let cycleIndex = 0;
	for (const eventId of eventIds) {
		for (const musicianId of musicianIds) {
			const status = STATUS_CYCLE[cycleIndex % STATUS_CYCLE.length];
			cycleIndex++;
			if (status) await setAttendanceResponse(db, eventId, musicianId, status);
		}
	}

	console.log(
		`\n${MUSICIANS.length} musiciens créés (mot de passe démo pour tous : ${DEMO_PASSWORD}) :`
	);
	for (const m of MUSICIANS) console.log(`  - ${m.name} (${m.email})`);
	console.log(`\n${EVENTS.length} évènements créés.`);
	console.log('\nRelancez `pnpm seed:demo` à tout moment pour régénérer un jeu de données propre.');
}

main().then(
	() => process.exit(),
	(error) => {
		console.error(error);
		process.exit(1);
	}
);
