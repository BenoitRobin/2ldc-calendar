import { fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { event } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Contrairement au calendrier musicien, l'admin voit tous les évènements,
	// passés compris, pour pouvoir les gérer/supprimer.
	const events = await db.select().from(event).orderBy(desc(event.date));
	return { events };
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const eventId = formData.get('eventId');

		if (typeof eventId !== 'string' || !eventId) {
			return fail(400, { error: 'Évènement invalide.' });
		}

		const deleted = await db.delete(event).where(eq(event.id, eventId)).returning({ id: event.id });
		if (deleted.length === 0) {
			return fail(404, { error: 'Évènement introuvable.' });
		}
	}
};
