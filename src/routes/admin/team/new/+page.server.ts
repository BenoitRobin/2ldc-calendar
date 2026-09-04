import { fail, redirect } from '@sveltejs/kit';
import { isAPIError } from 'better-auth/api';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { findUserByName } from '$lib/server/user-lookup';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name');
		const email = formData.get('email');
		const password = formData.get('password');
		const role = formData.get('role');

		if (typeof name !== 'string' || !name.trim()) {
			return fail(400, { error: 'Prénom requis.' });
		}
		if (typeof email !== 'string' || !email.trim()) {
			return fail(400, { error: 'Email requis.' });
		}
		if (typeof password !== 'string' || password.length < 8) {
			return fail(400, { error: 'Le mot de passe doit contenir au moins 8 caractères.' });
		}
		if (role !== 'standard' && role !== 'admin') {
			return fail(400, { error: 'Rôle invalide.' });
		}

		const trimmedName = name.trim();

		// Login is by prénom (specs/user-auth), so two members can't share one.
		if (await findUserByName(db, trimmedName)) {
			return fail(400, { error: 'Ce prénom est déjà utilisé par un autre membre.' });
		}

		try {
			// No headers passed: hooks.server.ts already gated this route to admins only
			// (specs/user-auth server-side routing), so this trusted server-side call
			// bypasses better-auth's own session/permission check for this endpoint.
			// Cast: this endpoint's role type falls back to the plugin's default
			// ('user' | 'admin') through this inference chain (see auth-options.ts's
			// comments) instead of our configured 'standard' | 'admin'; correct at runtime.
			await auth.api.createUser({
				body: {
					email: email.trim(),
					name: trimmedName,
					password,
					role: role as unknown as 'user' | 'admin'
				}
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

		redirect(303, '/admin/team');
	}
};
