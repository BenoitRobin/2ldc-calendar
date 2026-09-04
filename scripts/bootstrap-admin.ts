process.loadEnvFile();

import { eq } from 'drizzle-orm';
import { betterAuth } from 'better-auth/minimal';
import { createAuthOptions } from '../src/lib/server/auth-options';
import { createDbClient } from '../src/lib/server/db/client';
import { createEmailSender } from '../src/lib/server/email-sender';
import { user } from '../src/lib/server/db/schema';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const db = createDbClient(process.env.DATABASE_URL, process.env.TURSO_AUTH_TOKEN || undefined);
const sendEmail = createEmailSender(process.env.RESEND_API_KEY, process.env.RESEND_FROM_EMAIL);

// No sveltekitCookies plugin here (unlike src/lib/server/auth.ts): this script never
// runs inside a SvelteKit request, and createUser/requestPasswordReset don't set
// session cookies for the caller anyway.
const auth = betterAuth(
	createAuthOptions({
		baseURL: process.env.ORIGIN,
		secret: process.env.BETTER_AUTH_SECRET,
		db,
		sendEmail
	})
);

async function main() {
	const email = process.argv[2];
	const name = process.argv[3] ?? email?.split('@')[0];

	if (!email || !name) {
		console.error('Usage: pnpm bootstrap:admin <email> [name]');
		process.exitCode = 1;
		return;
	}

	const [existingAdmin] = await db
		.select({ id: user.id })
		.from(user)
		.where(eq(user.role, 'admin'))
		.limit(1);
	if (existingAdmin) {
		console.error('An admin account already exists. This script only bootstraps the first one.');
		process.exitCode = 1;
		return;
	}

	const { user: created } = await auth.api.createUser({ body: { email, name, role: 'admin' } });

	// Never chosen by the operator: this only triggers the same "set your own password"
	// email/console-log link the person will use (specs/user-auth bootstrap requirement).
	await auth.api.requestPasswordReset({ body: { email, redirectTo: '/reset-password' } });

	console.log(
		`Admin account created for ${created.email}. Check the email/log above for the set-password link.`
	);
}

main().then(
	() => process.exit(),
	(error) => {
		console.error(error);
		process.exit(1);
	}
);
