import { error as kitError, fail } from '@sveltejs/kit';
import { eq, and, asc, gte } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { event, attendanceResponse } from '$lib/server/db/schema';
import { isPresenceValue, setAttendanceResponse } from '$lib/server/attendance';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const [existing] = await db.select().from(event).where(eq(event.id, params.eventId)).limit(1);
	if (!existing) kitError(404, 'Évènement introuvable.');

	const [myResponse] = await db
		.select({ status: attendanceResponse.status })
		.from(attendanceResponse)
		.where(
			and(
				eq(attendanceResponse.eventId, params.eventId),
				eq(attendanceResponse.userId, locals.user!.id)
			)
		)
		.limit(1);

	// Navigation précédent/suivant : même ordre et même filtre que la liste du
	// calendrier (évènements à venir uniquement, du plus proche au plus loin) —
	// un évènement passé consulté via un lien direct n'a alors ni voisin. Le nom et
	// la date des voisins sont inclus pour l'aperçu affiché à côté de la carte sur
	// desktop, sans requête supplémentaire.
	const today = new Date().toISOString().slice(0, 10);
	const orderedEvents = await db
		.select({ id: event.id, name: event.name, date: event.date })
		.from(event)
		.where(gte(event.date, today))
		.orderBy(asc(event.date));
	const currentIndex = orderedEvents.findIndex((e) => e.id === existing.id);
	const prevEvent = currentIndex > 0 ? orderedEvents[currentIndex - 1] : null;
	const nextEvent =
		currentIndex !== -1 && currentIndex < orderedEvents.length - 1
			? orderedEvents[currentIndex + 1]
			: null;

	return { event: existing, myStatus: myResponse?.status ?? 'none', prevEvent, nextEvent };
};

export const actions: Actions = {
	respond: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const status = formData.get('status');

		if (!isPresenceValue(status)) {
			return fail(400, { error: 'Statut invalide.' });
		}

		// Every authenticated user may set their own response, at any time
		// (specs/event-attendance) — no admin check needed here, this only ever
		// touches locals.user's own row.
		await setAttendanceResponse(db, params.eventId, locals.user!.id, status);

		return { status };
	}
};
