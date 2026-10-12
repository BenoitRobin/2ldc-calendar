import { error as kitError, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { piece, piecePart } from '$lib/server/db/schema';
import { INSTRUMENTS } from '$lib/instruments';
import { parsePieceForm, type PieceFormValues } from '$lib/server/validate-piece';
import { savePiece } from '$lib/server/pieces';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [existing] = await db.select().from(piece).where(eq(piece.id, params.pieceId)).limit(1);
	if (!existing) kitError(404, 'Morceau introuvable.');

	const parts = await db.select().from(piecePart).where(eq(piecePart.pieceId, params.pieceId));
	const values: Partial<PieceFormValues> = { title: existing.title };
	for (const part of parts) {
		const urls = (values[part.instrument] ??= []);
		urls[part.partNumber - 1] = part.driveUrl;
	}
	// A lone partie 2 leaves a hole at index 0: fill it so the form shows an empty
	// partie 1 field rather than skipping it.
	for (const instrument of INSTRUMENTS) {
		const urls = values[instrument];
		if (urls) values[instrument] = Array.from(urls, (url) => url ?? '');
	}

	return { values };
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const parsed = parsePieceForm(await request.formData());

		if ('error' in parsed) {
			return fail(400, parsed);
		}

		await savePiece(params.pieceId, parsed.title, parsed.parts);

		redirect(303, '/partition');
	},
	// Parts go with it via the FK's onDelete: 'cascade' (schema.ts).
	delete: async ({ params }) => {
		await db.delete(piece).where(eq(piece.id, params.pieceId));
		redirect(303, '/partition');
	}
};
