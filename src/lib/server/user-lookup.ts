import { sql } from 'drizzle-orm';
import type { createDbClient } from './db/client';
import { user } from './db/schema';

// Case-insensitive: prénoms must be unique for name-based login to resolve to
// exactly one account, and "Alice" vs "alice" should still count as a clash.
export async function findUserByName(db: ReturnType<typeof createDbClient>, name: string) {
	const [existing] = await db
		.select({ id: user.id, email: user.email, name: user.name })
		.from(user)
		.where(sql`lower(${user.name}) = lower(${name})`)
		.limit(1);

	return existing;
}
