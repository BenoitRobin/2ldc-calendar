// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			// Hand-typed rather than derived from `typeof auth.$Infer.Session`: that
			// inference chain is fragile across the auth-options.ts factory split (see
			// its comments) and silently loses the admin plugin's `role` field when it
			// breaks. `role` is nullable because the underlying column is (better-auth's
			// admin plugin schema) even though every account is created with one.
			user?: {
				id: string;
				email: string;
				name: string;
				role?: string | null;
			};
			session?: {
				id: string;
				userId: string;
				expiresAt: Date;
			};
		}

		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
