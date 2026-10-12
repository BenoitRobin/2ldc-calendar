import { asc, eq, gte, isNull, or } from 'drizzle-orm';
import { Resend } from 'resend';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { event, user } from '$lib/server/db/schema';
import { renderNewEventEmail } from '$lib/server/emails/new-event';

// Resend's batch endpoint accepts at most 100 emails per call.
const BATCH_SIZE = 100;

// Emails every active member about a newly created event. Never throws: the
// event already exists, so a mail failure is reported to the admin, not fatal.
export async function notifyNewEvent(eventId: string): Promise<{ sent: number; failed: boolean }> {
	try {
		const [evt] = await db.select().from(event).where(eq(event.id, eventId)).limit(1);
		if (!evt) return { sent: 0, failed: true };

		const today = new Date().toISOString().slice(0, 10);
		const upcoming = await db
			.select()
			.from(event)
			.where(gte(event.date, today))
			.orderBy(asc(event.date));

		const members = await db
			.select({ email: user.email })
			.from(user)
			.where(or(isNull(user.banned), eq(user.banned, false)));

		const calendarUrl = new URL(`/calendar/${evt.id}`, env.ORIGIN).toString();
		const { subject, html, text } = renderNewEventEmail({ evt, upcoming, calendarUrl });

		// Local dev without a key: show what would go out instead of sending.
		if (!env.RESEND_API_KEY) {
			console.info(
				`[notify-new-event] RESEND_API_KEY absent — mail non envoyé.\n  Objet : ${subject}\n  À : ${members.map((m) => m.email).join(', ')}`
			);
			return { sent: members.length, failed: false };
		}

		const resend = new Resend(env.RESEND_API_KEY);
		const from = env.MAIL_FROM || '2LDC Calendrier <onboarding@resend.dev>';

		// One email per member (not one email with everyone in To/Bcc) so nobody
		// sees the others' addresses and each mail looks personal to spam filters.
		let sent = 0;
		for (let i = 0; i < members.length; i += BATCH_SIZE) {
			const chunk = members.slice(i, i + BATCH_SIZE);
			const { error } = await resend.batch.send(
				chunk.map((m) => ({ from, to: m.email, subject, html, text }))
			);
			if (error) {
				console.error('[notify-new-event] Resend error', error);
				return { sent, failed: true };
			}
			sent += chunk.length;
		}

		return { sent, failed: false };
	} catch (err) {
		console.error('[notify-new-event]', err);
		return { sent: 0, failed: true };
	}
}
