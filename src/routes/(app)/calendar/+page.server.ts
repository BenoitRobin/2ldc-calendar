import { asc, gte } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { event } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
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
	return { events };
};
