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
	sendEmail: (args: { to: string; subject: string; text: string }) => Promise<void>;
}) {
	return {
		baseURL: config.baseURL,
		secret: config.secret,
		database: drizzleAdapter(config.db, { provider: 'sqlite' }),
		emailAndPassword: {
			enabled: true,
			// Accounts are created only via the admin bootstrap script or the admin
			// "add a team member" action (specs/user-auth), both using auth.api.createUser
			// below — never public self-signup.
			disableSignUp: true,
			// The bootstrap script and the "add a team member" action both trigger this via
			// auth.api.requestPasswordReset right after createUser, so the new account's
			// password is always set by the person themselves, never by the admin/operator.
			sendResetPassword: async ({ user, url }: { user: { email: string }; url: string }) => {
				await config.sendEmail({
					to: user.email,
					subject: 'Choisissez votre mot de passe — 2LDC Calendar',
					text: `Bonjour,\n\nUn compte a été créé pour vous sur 2LDC Calendar. Choisissez votre mot de passe ici :\n${url}\n\nCe lien expire prochainement.`
				});
			}
		},
		plugins: [
			// Gives us auth.api.createUser (admin creates an account without choosing its
			// password) and the `role` column/session field our two-role model relies on.
			admin({ defaultRole: 'standard', adminRoles: ['admin'] })
		]
	};
}
