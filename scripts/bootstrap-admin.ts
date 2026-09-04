process.loadEnvFile();

import { eq } from 'drizzle-orm';
import { betterAuth } from 'better-auth/minimal';
import { createAuthOptions } from '../src/lib/server/auth-options';
import { createDbClient } from '../src/lib/server/db/client';
import { findUserByName } from '../src/lib/server/user-lookup';
import { user } from '../src/lib/server/db/schema';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const db = createDbClient(process.env.DATABASE_URL, process.env.TURSO_AUTH_TOKEN || undefined);

// No sveltekitCookies plugin here (unlike src/lib/server/auth.ts): this script never
// runs inside a SvelteKit request, and createUser doesn't set session cookies for
// the caller anyway.
const auth = betterAuth(
	createAuthOptions({
		baseURL: process.env.ORIGIN,
		secret: process.env.BETTER_AUTH_SECRET,
		db
	})
);

async function main() {
	const email = process.argv[2];
	const name = process.argv[3];
	const password = process.argv[4];

	if (!email || !name || !password) {
		console.error('Usage: pnpm bootstrap:admin <email> <prénom> <mot de passe>');
		process.exitCode = 1;
		return;
	}
	if (password.length < 8) {
		console.error('Le mot de passe doit contenir au moins 8 caractères.');
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

	// Login is by prénom (specs/user-auth), so it must be unique across the team.
	if (await findUserByName(db, name)) {
		console.error(`Le prénom "${name}" est déjà utilisé par un autre compte.`);
		process.exitCode = 1;
		return;
	}

	const { user: created } = await auth.api.createUser({
		body: { email, name, password, role: 'admin' }
	});

	console.log(`Compte admin créé pour ${created.name} (${created.email}).`);
}

main().then(
	() => process.exit(),
	(error) => {
		console.error(error);
		process.exit(1);
	}
);
