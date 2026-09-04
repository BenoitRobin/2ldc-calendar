import { error as kitError, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { isAPIError } from 'better-auth/api';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [existing] = await db
		.select({ id: user.id, name: user.name, email: user.email, role: user.role })
		.from(user)
		.where(eq(user.id, params.userId))
		.limit(1);
	if (!existing) kitError(404, 'Membre introuvable.');

	return { member: existing };
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const formData = await request.formData();
		const name = formData.get('name');
		const email = formData.get('email');
		const role = formData.get('role');

		if (typeof name !== 'string' || !name.trim()) {
			return fail(400, { error: 'Nom requis.' });
		}
		if (typeof email !== 'string' || !email.trim()) {
			return fail(400, { error: 'Email requis.' });
		}
		if (role !== 'standard' && role !== 'admin') {
			return fail(400, { error: 'Rôle invalide.' });
		}

		const [target] = await db
			.select({ role: user.role })
			.from(user)
			.where(eq(user.id, params.userId))
			.limit(1);
		if (!target) kitError(404, 'Membre introuvable.');

		// Auto-lockout guard (PRD phase 8): never let the last admin lose the role,
		// or nobody could administer the app anymore.
		if (target.role === 'admin' && role !== 'admin') {
			const admins = await db.select({ id: user.id }).from(user).where(eq(user.role, 'admin'));
			if (admins.length <= 1) {
				return fail(400, {
					error: 'Impossible de retirer le rôle admin : ce compte est le seul administrateur.'
				});
			}
		}

		try {
			// headers required: unlike createUser, adminUpdateUser always checks the
			// caller's session/permissions itself (better-auth's adminMiddleware).
			await auth.api.adminUpdateUser({
				body: { userId: params.userId, data: { name: name.trim(), email: email.trim(), role } },
				headers: request.headers
			});
		} catch (error) {
			if (isAPIError(error)) {
				if (error.body?.code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL') {
					return fail(400, { error: 'Cette adresse email est déjà utilisée.' });
				}
				return fail(400, { error: 'Impossible de modifier ce compte.' });
			}
			throw error;
		}

		redirect(303, '/admin/team');
	}
};
