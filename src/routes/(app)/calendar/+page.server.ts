import { asc, eq, gte } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { event, attendanceResponse } from '$lib/server/db/schema';
import type { PresenceValue } from '$lib/server/attendance';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Every authenticated user sees the same events — no per-user filtering
	// (specs/event-calendar: "Shared read access for every user"). Past events
	// disappear automatically once their date has gone by (admins still see
	// everything in /admin/events, including past ones, to manage them).
	const today = new Date().toISOString().slice(0, 10);
	const events = await db
		.select()
		.from(event)
		.where(gte(event.date, today))
		.orderBy(asc(event.date));

	// The caller's own responses, for the status dot shown on each card — a
	// separate query rather than a join since only this one user's rows matter.
	const myResponses = await db
		.select({ eventId: attendanceResponse.eventId, status: attendanceResponse.status })
		.from(attendanceResponse)
		.where(eq(attendanceResponse.userId, locals.user!.id));
	const myStatusByEventId = new Map<string, PresenceValue>(
		myResponses.map((r) => [r.eventId, r.status])
	);

	return {
		events: events.map((evt) => ({
			...evt,
			myStatus: (myStatusByEventId.get(evt.id) ?? 'none') as PresenceValue | 'none'
		}))
	};
};
