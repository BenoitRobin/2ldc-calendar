import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Pure factory (no env access) so both the SvelteKit app (db/index.ts, reading
// $env/dynamic/private) and scripts/bootstrap-admin.ts (run via vite-node, outside
// SvelteKit's request lifecycle, reading plain process.env) can build a client the
// same way without either pulling in the other's env-loading mechanism.
export function createDbClient(url: string, authToken?: string) {
	const client = createClient({ url, authToken });
	return drizzle(client, { schema });
}
