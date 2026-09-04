import type { createDbClient } from '$lib/server/db/client';
import { attendanceResponse } from '$lib/server/db/schema';

export type PresenceValue = 'oui' | 'non' | 'indecis';

export function isPresenceValue(value: unknown): value is PresenceValue {
	return value === 'oui' || value === 'non' || value === 'indecis';
}

// Takes `db` as a parameter (pure, no $env import) so both the SvelteKit app routes
// and scripts/seed-demo.ts (run via vite-node, outside SvelteKit's request lifecycle)
// can call it — see src/lib/server/db/client.ts for why this split exists. Shared by
// the event detail page (a user setting their own response) and the admin-editable
// attendance overview (specs/event-attendance: "Admin can correct any response") —
// same write path, so both stay consistent with the unique (eventId, userId)
// constraint in schema.ts.
export async function setAttendanceResponse(
	db: ReturnType<typeof createDbClient>,
	eventId: string,
	userId: string,
	status: PresenceValue
) {
	await db
		.insert(attendanceResponse)
		.values({ eventId, userId, status })
		.onConflictDoUpdate({
			target: [attendanceResponse.eventId, attendanceResponse.userId],
			set: { status }
		});
}
