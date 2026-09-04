import { error as kitError, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { event } from '$lib/server/db/schema';
import { parseEventForm } from '$lib/server/validate-event';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [existing] = await db.select().from(event).where(eq(event.id, params.eventId)).limit(1);
	if (!existing) kitError(404, 'Évènement introuvable.');
	return { event: existing };
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const formData = await request.formData();
		const parsed = parseEventForm(formData);

		if ('error' in parsed) {
			return fail(400, parsed);
		}

		await db.update(event).set(parsed).where(eq(event.id, params.eventId));

		redirect(303, '/admin/events');
	},
	// Cascade delete of attendance_response rows happens at the DB level (FK onDelete:
	// 'cascade' in schema.ts) — specs/event-calendar's "Confirmed deletion" requirement.
	delete: async ({ params }) => {
		await db.delete(event).where(eq(event.id, params.eventId));
		redirect(303, '/admin/events');
	}
};
