const dayFormatter = new Intl.DateTimeFormat('fr-FR', { day: '2-digit' });
const monthFormatter = new Intl.DateTimeFormat('fr-FR', { month: 'short' });

// evt.date is a plain "YYYY-MM-DD" string; parsing with a local-time suffix avoids
// the UTC-midnight day-shift `new Date('YYYY-MM-DD')` causes in negative-UTC zones.
export function formatEventDay(isoDate: string) {
	const date = new Date(`${isoDate}T00:00:00`);
	return { day: dayFormatter.format(date), month: monthFormatter.format(date) };
}
