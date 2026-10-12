import { fail, redirect } from '@sveltejs/kit';
import { parsePieceForm } from '$lib/server/validate-piece';
import { savePiece } from '$lib/server/pieces';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const parsed = parsePieceForm(await request.formData());

		if ('error' in parsed) {
			return fail(400, parsed);
		}

		await savePiece(null, parsed.title, parsed.parts);

		redirect(303, '/partition');
	}
};
