import { fail, redirect } from '@sveltejs/kit';
import { isAPIError } from 'better-auth/api';
import { auth } from '$lib/server/auth';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const role = formData.get('role');

		if (typeof email !== 'string' || !email) {
			return fail(400, { error: 'Email requis.' });
		}
		if (role !== 'standard' && role !== 'admin') {
			return fail(400, { error: 'Rôle invalide.' });
		}

		const name = email.split('@')[0];

		try {
			// No headers passed: hooks.server.ts already gated this route to admins only
			// (specs/user-auth server-side routing), so this trusted server-side call
			// bypasses better-auth's own session/permission check for this endpoint.
			// Cast: this endpoint's role type falls back to the plugin's default
			// ('user' | 'admin') through this inference chain (see auth-options.ts's
			// comments) instead of our configured 'standard' | 'admin'; correct at runtime.
			await auth.api.createUser({
				body: { email, name, role: role as unknown as 'user' | 'admin' }
			});
		} catch (error) {
			if (isAPIError(error)) {
				if (error.body?.code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL') {
					return fail(400, { error: 'Cette adresse email est déjà utilisée.' });
				}
				return fail(400, { error: 'Impossible de créer ce compte.' });
			}
			throw error;
		}

		// Never chosen by the admin: this only triggers the set-your-own-password
		// email/console-log link (specs/user-auth).
		await auth.api.requestPasswordReset({ body: { email, redirectTo: '/reset-password' } });

		redirect(303, '/admin/team');
	}
};
