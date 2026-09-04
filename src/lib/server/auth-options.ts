import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';
import type { createDbClient } from './db/client';

// Pure factory (config passed in, nothing read from $env or process.env) so both
// auth.ts (SvelteKit app) and scripts/bootstrap-admin.ts (run via vite-node, outside
// SvelteKit's request lifecycle) can build the same auth options — see
// src/lib/server/db/client.ts for why this split exists.
export function createAuthOptions(config: {
	baseURL: string | undefined;
	secret: string | undefined;
	db: ReturnType<typeof createDbClient>;
}) {
	return {
		baseURL: config.baseURL,
		secret: config.secret,
		database: drizzleAdapter(config.db, { provider: 'sqlite' }),
		emailAndPassword: {
			enabled: true,
			// Accounts are created only via the admin bootstrap script or the admin
			// "add a team member" action (specs/user-auth), both using auth.api.createUser
			// with an admin-chosen password — never public self-signup, no email-based
			// password-reset flow.
			disableSignUp: true
		},
		plugins: [
			// Gives us auth.api.createUser (admin sets the new account's password directly)
			// and the `role` column/session field our two-role model relies on.
			admin({ defaultRole: 'standard', adminRoles: ['admin'] })
		]
	};
}
