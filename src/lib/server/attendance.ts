import type { createDbClient } from '$lib/server/db/client';
import { attendanceResponse } from '$lib/server/db/schema';

export type PresenceValue = 'oui' | 'non' | 'indecis';

export function isPresenceValue(value: unknown): value is PresenceValue {
	return value === 'oui' || value === 'non' || value === 'indecis';
}

// Takes `db` as a parameter (pure, no $env import) so both the SvelteKit app routes
// and scripts/seed-demo.ts (run via vite-node, outside SvelteKit's request lifecycle)
// can call it — see src/lib/server/db/client.ts for why this split exists. Shared by
// the event detail page (a user setting their own response, once) and the
// admin-editable attendance overview (specs/event-attendance: "Admin can correct any
// response") — same write path, so both stay consistent with the unique
// (eventId, userId) constraint in schema.ts.
//
// `allowOverwrite` gates whether an existing response may be replaced: the admin
// overview passes true (its whole purpose is correcting others' answers), the
// self-service event page passes false so a user's first answer sticks. Enforced
// here as a single atomic upsert-or-no-op rather than a separate existence check in
// each caller, so the rule can't be silently skipped by a future caller and there's
// no read-then-write race between two concurrent submissions.
export async function setAttendanceResponse(
	db: ReturnType<typeof createDbClient>,
	eventId: string,
	userId: string,
	status: PresenceValue,
	{ allowOverwrite = true }: { allowOverwrite?: boolean } = {}
): Promise<boolean> {
	const insert = db.insert(attendanceResponse).values({ eventId, userId, status });

	if (allowOverwrite) {
		await insert.onConflictDoUpdate({
			target: [attendanceResponse.eventId, attendanceResponse.userId],
			set: { status }
		});
		return true;
	}

	const inserted = await insert
		.onConflictDoNothing()
		.returning({ eventId: attendanceResponse.eventId });
	return inserted.length > 0;
}
