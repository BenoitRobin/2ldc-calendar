import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';
import { INSTRUMENTS } from '$lib/instruments';
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
		user: {
			additionalFields: {
				// `type: INSTRUMENTS` (a literal-string array, not "string") is what makes
				// `auth generate` emit a real sqlite `enum` column in auth.schema.ts instead
				// of a plain text one — see status-badge.svelte's STATUS_COLOR_CLASSES for
				// the same enum-of-fixed-choices shape on attendanceResponse.status.
				// required: false at the DB level (nullable) so it's never enforced by
				// better-auth itself; each fanfaron must have one, but that's checked at the
				// app layer (admin/team/new and .../edit +page.server.ts), same as `role`.
				instrument: { type: [...INSTRUMENTS], required: false, input: true }
			}
		},
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
