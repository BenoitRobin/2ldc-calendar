// "Nouvelle date" email sent to every member when an admin creates an event.
// Mail clients ignore <style> blocks and most layout CSS, so everything is
// inline styles + tables, in the Spécimen vivant palette (paper/ink, no red:
// nothing here needs attention).

type MailEvent = {
	id: string;
	name: string;
	date: string;
	startTime: string | null;
	endTime: string | null;
	location: string | null;
	description: string | null;
};

const PAPER = '#fbfaf7';
const INK = '#111111';
const MUTED = '#6b6b6b';
const RULE = '#e4e1da';
const FONT = "Archivo, 'Helvetica Neue', Arial, sans-serif";

const longDay = new Intl.DateTimeFormat('fr-FR', {
	weekday: 'long',
	day: 'numeric',
	month: 'long'
});
const shortDay = new Intl.DateTimeFormat('fr-FR', {
	weekday: 'short',
	day: 'numeric',
	month: 'short'
});

// Same local-time parsing as formatEventDay: avoids the UTC-midnight day shift.
function parseDay(isoDate: string) {
	return new Date(`${isoDate}T00:00:00`);
}

// "14:00" → "14h", "14:30" → "14h30"
function formatTime(time: string) {
	const [h, m] = time.split(':');
	return m === '00' ? `${Number(h)}h` : `${Number(h)}h${m}`;
}

function formatHours(evt: MailEvent) {
	if (evt.startTime && evt.endTime)
		return `${formatTime(evt.startTime)}–${formatTime(evt.endTime)}`;
	if (evt.startTime) return formatTime(evt.startTime);
	return null;
}

function escapeHtml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

export function renderNewEventEmail({
	evt,
	upcoming,
	calendarUrl
}: {
	evt: MailEvent;
	upcoming: MailEvent[];
	calendarUrl: string;
}) {
	// "samedi 14 mars" → "Samedi 14 mars" (French keeps the month lowercase).
	const longDate = longDay.format(parseDay(evt.date));
	const day = longDate.charAt(0).toUpperCase() + longDate.slice(1);
	const hours = formatHours(evt);
	const when = hours ? `${day} · ${hours}` : day;

	const subject = `Nouvelle date — ${evt.name}, ${shortDay.format(parseDay(evt.date))}`;

	const upcomingRows = upcoming
		.map((other) => {
			const isNew = other.id === evt.id;
			const weight = isNew ? 800 : 400;
			return `<tr>
	<td style="padding:10px 0;border-bottom:1px solid ${RULE};font:${weight} 14px/1.4 ${FONT};color:${INK};white-space:nowrap;width:1%;padding-right:16px;">${escapeHtml(shortDay.format(parseDay(other.date)))}</td>
	<td style="padding:10px 0;border-bottom:1px solid ${RULE};font:${weight} 14px/1.4 ${FONT};color:${INK};">${escapeHtml(other.name)}${isNew ? ` <span style="font-weight:600;font-size:12px;color:${MUTED};">← nouveau</span>` : ''}</td>
</tr>`;
		})
		.join('');

	const html = `<!doctype html>
<html lang="fr">
<body style="margin:0;padding:0;background:${PAPER};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
	<tr><td style="font:700 12px/1 ${FONT};letter-spacing:0.08em;text-transform:uppercase;color:${MUTED};padding-bottom:12px;">Nouvelle date</td></tr>
	<tr><td style="border-top:2px solid ${INK};padding-top:16px;font:600 15px/1.4 ${FONT};color:${INK};">${escapeHtml(when)}</td></tr>
	<tr><td style="padding-top:4px;font:800 28px/1.15 ${FONT};color:${INK};">${escapeHtml(evt.name)}</td></tr>
	${evt.location ? `<tr><td style="padding-top:8px;font:400 15px/1.4 ${FONT};color:${INK};">Lieu : ${escapeHtml(evt.location)}</td></tr>` : ''}
	${evt.description ? `<tr><td style="padding-top:12px;font:400 15px/1.5 ${FONT};color:${INK};white-space:pre-line;">${escapeHtml(evt.description)}</td></tr>` : ''}
	<tr><td style="padding:24px 0 36px;">
		<a href="${escapeHtml(calendarUrl)}" style="display:inline-block;background:${INK};color:${PAPER};text-decoration:none;font:700 15px/1 ${FONT};padding:14px 20px;border-radius:8px;">Répondre dans le calendrier →</a>
	</td></tr>
	<tr><td style="font:700 12px/1 ${FONT};letter-spacing:0.08em;text-transform:uppercase;color:${MUTED};padding-bottom:12px;">Prochaines dates</td></tr>
	<tr><td style="border-top:2px solid ${INK};">
		<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${upcomingRows}</table>
	</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

	const text = [
		'NOUVELLE DATE',
		when,
		evt.name,
		evt.location ? `Lieu : ${evt.location}` : null,
		evt.description,
		'',
		`Répondre dans le calendrier : ${calendarUrl}`,
		'',
		'PROCHAINES DATES',
		...upcoming.map(
			(other) =>
				`· ${shortDay.format(parseDay(other.date))} — ${other.name}${other.id === evt.id ? '  ← nouveau' : ''}`
		)
	]
		.filter((line) => line !== null)
		.join('\n');

	return { subject, html, text };
}
