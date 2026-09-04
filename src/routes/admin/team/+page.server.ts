import { asc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const members = await db
		.select({ id: user.id, name: user.name, email: user.email, role: user.role })
		.from(user)
		.orderBy(asc(user.name));

	return { members };
};
