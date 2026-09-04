import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { event } from '$lib/server/db/schema';
import { parseEventForm } from '$lib/server/validate-event';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const parsed = parseEventForm(formData);

		if ('error' in parsed) {
			return fail(400, parsed);
		}

		// locals.user is guaranteed here: hooks.server.ts already gated /admin/** to
		// admins only (specs/user-auth), and every admin account has an id.
		await db.insert(event).values({ ...parsed, createdBy: locals.user!.id });

		redirect(303, '/admin/events');
	}
};
