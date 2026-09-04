import { fail, redirect } from '@sveltejs/kit';
import { isAPIError } from 'better-auth/api';
import { auth } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		redirect(303, locals.user.role === 'admin' ? '/admin/events' : '/calendar');
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
			return fail(400, { error: 'Email et mot de passe requis.' });
		}

		let role: string | null | undefined;
		try {
			const result = await auth.api.signInEmail({ body: { email, password } });
			// Cast: the admin plugin's `role` field on the returned user isn't reflected
			// in this type (see auth-options.ts's comments on the factory split); it's
			// there at runtime, just not through this inference chain.
			role = (result.user as { role?: string | null }).role;
		} catch (error) {
			if (isAPIError(error)) {
				// Deliberately generic: never reveal whether the email exists (specs/user-auth).
				return fail(400, { error: 'Identifiants invalides.' });
			}
			throw error;
		}

		redirect(303, role === 'admin' ? '/admin/events' : '/calendar');
	}
};
