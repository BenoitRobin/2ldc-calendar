import { error as kitError, fail } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
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

	return { event: existing, myStatus: myResponse?.status ?? 'none' };
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
