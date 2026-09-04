import { desc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { event } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const events = await db.select().from(event).orderBy(desc(event.date));
	return { events };
};
