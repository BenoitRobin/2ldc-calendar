import { Resend } from 'resend';

// Pure factory (no env access) — see src/lib/server/db/client.ts for why. Kept in its
// own file, separate from email.ts's $env-based singleton: importing that module for
// just this factory would still evaluate its top-level $env/dynamic/private import,
// which fails outside SvelteKit's own Vite pipeline (scripts/bootstrap-admin.ts).
export function createEmailSender(apiKey: string | undefined, fromEmail: string | undefined) {
	const resend = apiKey ? new Resend(apiKey) : null;

	return async function sendEmail({
		to,
		subject,
		text
	}: {
		to: string;
		subject: string;
		text: string;
	}) {
		if (!resend) {
			// No RESEND_API_KEY configured yet (ARCHITECTURE.md): never block on a missing
			// third-party account, just log so the flow is testable end-to-end locally.
			console.log(`[email:dev] to=${to} subject=${subject}\n${text}`);
			return;
		}

		await resend.emails.send({ from: fromEmail || 'onboarding@resend.dev', to, subject, text });
	};
}
