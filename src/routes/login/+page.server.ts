import { fail, redirect } from '@sveltejs/kit';
import { isAPIError } from 'better-auth/api';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { findUserByName } from '$lib/server/user-lookup';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		redirect(303, locals.user.role === 'admin' ? '/admin/events' : '/calendar');
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name');
		const password = formData.get('password');

		if (typeof name !== 'string' || typeof password !== 'string' || !name || !password) {
			return fail(400, { error: 'Prénom et mot de passe requis.' });
		}

		// Login is by prénom, not email (every account's better-auth identity is still
		// email under the hood — resolve it first, same generic error either way).
		const account = await findUserByName(db, name.trim());
		if (!account) {
			return fail(400, { error: 'Identifiants invalides.' });
		}

		let role: string | null | undefined;
		try {
			const result = await auth.api.signInEmail({ body: { email: account.email, password } });
			// Cast: the admin plugin's `role` field on the returned user isn't reflected
			// in this type (see auth-options.ts's comments on the factory split); it's
			// there at runtime, just not through this inference chain.
			role = (result.user as { role?: string | null }).role;
		} catch (error) {
			if (isAPIError(error)) {
				// Deliberately generic: never reveal whether the prénom exists.
				return fail(400, { error: 'Identifiants invalides.' });
			}
			throw error;
		}

		redirect(303, role === 'admin' ? '/admin/events' : '/calendar');
	}
};
