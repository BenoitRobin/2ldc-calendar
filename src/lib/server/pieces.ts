import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { piece, piecePart } from '$lib/server/db/schema';
import type { Instrument } from '$lib/instruments';

type Parts = { instrument: Instrument; partNumber: number; driveUrl: string }[];

// Parts are replaced wholesale on every save: the form always posts every part field,
// so an emptied or removed field must delete that part.
export async function savePiece(pieceId: string | null, title: string, parts: Parts) {
	await db.transaction(async (tx) => {
		let id = pieceId;
		if (id) {
			await tx.update(piece).set({ title }).where(eq(piece.id, id));
			await tx.delete(piecePart).where(eq(piecePart.pieceId, id));
		} else {
			[{ id }] = await tx.insert(piece).values({ title }).returning({ id: piece.id });
		}
		if (parts.length > 0) {
			await tx.insert(piecePart).values(parts.map((p) => ({ ...p, pieceId: id! })));
		}
	});
}
