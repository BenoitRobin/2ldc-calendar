import { fail, redirect } from '@sveltejs/kit';
import { isAPIError } from 'better-auth/api';
import { auth } from '$lib/server/auth';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, url }) => {
		const formData = await request.formData();
		const newPassword = formData.get('password');
		const token = formData.get('token') ?? url.searchParams.get('token');

		if (typeof newPassword !== 'string' || !newPassword || typeof token !== 'string' || !token) {
			return fail(400, { error: 'Lien invalide ou mot de passe manquant.' });
		}

		try {
			await auth.api.resetPassword({ body: { newPassword, token } });
		} catch (error) {
			if (isAPIError(error)) {
				return fail(400, { error: 'Ce lien a expiré ou est invalide. Demandez-en un nouveau.' });
			}
			throw error;
		}

		redirect(303, '/login');
	}
};
