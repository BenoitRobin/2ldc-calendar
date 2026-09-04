import { fail } from '@sveltejs/kit';
import { asc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { event, user, attendanceResponse } from '$lib/server/db/schema';
import { isPresenceValue, setAttendanceResponse } from '$lib/server/attendance';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const [events, users, responses] = await Promise.all([
		db.select().from(event).orderBy(asc(event.date)),
		db.select({ id: user.id, name: user.name }).from(user).orderBy(asc(user.name)),
		db
			.select({
				eventId: attendanceResponse.eventId,
				userId: attendanceResponse.userId,
				status: attendanceResponse.status
			})
			.from(attendanceResponse)
	]);

	return {
		events,
		users,
		responses,
		isAdmin: locals.user?.role === 'admin'
	};
};

export const actions: Actions = {
	// Only reachable when the matrix renders editable cells, which only happens for
	// admins (see +page.svelte) — but re-checked here too, since a `standard` account
	// could otherwise POST directly to this action bypassing the UI
	// (specs/event-attendance: "Admin can correct any response").
	respond: async ({ request, locals }) => {
		if (locals.user?.role !== 'admin') {
			return fail(403, { error: 'Réservé aux administrateurs.' });
		}

		const formData = await request.formData();
		const eventId = formData.get('eventId');
		const userId = formData.get('userId');
		const status = formData.get('status');

		if (typeof eventId !== 'string' || typeof userId !== 'string' || !isPresenceValue(status)) {
			return fail(400, { error: 'Requête invalide.' });
		}

		await setAttendanceResponse(eventId, userId, status);

		return { success: true };
	}
};
