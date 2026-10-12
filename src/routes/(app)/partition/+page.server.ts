import { db } from '$lib/server/db';
import { piece, piecePart } from '$lib/server/db/schema';
import { isInstrument, type Instrument } from '$lib/instruments';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const [pieces, parts] = await Promise.all([
		db.select({ id: piece.id, title: piece.title }).from(piece),
		db
			.select({
				pieceId: piecePart.pieceId,
				instrument: piecePart.instrument,
				driveUrl: piecePart.driveUrl
			})
			.from(piecePart)
	]);

	const partsByPiece = new Map<string, Partial<Record<Instrument, string>>>();
	for (const part of parts) {
		const entry = partsByPiece.get(part.pieceId) ?? {};
		entry[part.instrument] = part.driveUrl;
		partsByPiece.set(part.pieceId, entry);
	}

	return {
		// Sorted here rather than in SQL: SQLite's NOCASE collation ignores case but
		// not accents, so "Été" would land after "Zou".
		pieces: pieces
			.map((p) => ({ ...p, parts: partsByPiece.get(p.id) ?? {} }))
			.sort((a, b) => a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' })),
		myInstrument: isInstrument(locals.user?.instrument) ? locals.user.instrument : null,
		isAdmin: locals.user?.role === 'admin'
	};
};
