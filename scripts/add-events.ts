process.loadEnvFile();

import { eq } from 'drizzle-orm';
import { createDbClient } from '../src/lib/server/db/client';
import { user, event } from '../src/lib/server/db/schema';

const NEW_EVENTS = [
	{
		name: 'Répétition pupitres — bois',
		date: '2026-11-05',
		startTime: '19:00',
		endTime: '21:00',
		location: 'Salle A',
		description: null
	},
	{
		name: 'Répétition pupitres — percussions',
		date: '2026-11-12',
		startTime: '19:00',
		endTime: '20:30',
		location: 'Salle B',
		description: null
	},
	{
		name: 'Répétition tutti',
		date: '2026-11-26',
		startTime: '19:00',
		endTime: '21:00',
		location: 'Salle A',
		description: null
	},
	{
		name: 'Répétition générale — concert de Noël',
		date: '2026-12-10',
		startTime: '19:00',
		endTime: '21:30',
		location: 'Salle A',
		description: 'Dernière répétition avant le concert de Noël.'
	},
	{
		name: 'Concert de Noël',
		date: '2026-12-19',
		startTime: '20:00',
		endTime: null,
		location: 'Église Saint-Martin',
		description: 'Concert public. Merci de venir 45 minutes avant pour la mise en place.'
	},
	{
		name: 'Répétition tutti',
		date: '2027-01-14',
		startTime: '19:00',
		endTime: '21:00',
		location: 'Salle A',
		description: null
	},
	{
		name: 'Répétition pupitres — cordes',
		date: '2027-01-21',
		startTime: '19:00',
		endTime: '20:30',
		location: 'Salle B',
		description: null
	},
	{
		name: "Journée d'orchestre",
		date: '2027-02-06',
		startTime: '10:00',
		endTime: '17:00',
		location: 'Salle polyvalente',
		description: 'Répétition longue avec pause déjeuner sur place, travail intensif du programme de printemps.'
	},
	{
		name: 'Répétition tutti',
		date: '2027-02-25',
		startTime: '19:00',
		endTime: '21:00',
		location: 'Salle A',
		description: null
	},
	{
		name: 'Répétition générale — concert de printemps',
		date: '2027-03-11',
		startTime: '19:00',
		endTime: '21:30',
		location: 'Salle A',
		description: null
	},
	{
		name: 'Concert de printemps',
		date: '2027-03-20',
		startTime: '20:30',
		endTime: null,
		location: 'Salle polyvalente',
		description: 'Concert public annuel. Merci de venir 45 minutes avant pour la mise en place.'
	}
];

async function main() {
	if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

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

	console.log(`Création de ${NEW_EVENTS.length} évènements...`);
	for (const evt of NEW_EVENTS) {
		const [created] = await db
			.insert(event)
			.values({ ...evt, createdBy: admin.id })
			.returning({ id: event.id, name: event.name, date: event.date });
		console.log(`  - ${created.date} ${created.name}`);
	}

	console.log('\nTerminé.');
}

main().then(
	() => process.exit(),
	(error) => {
		console.error(error);
		process.exit(1);
	}
);
