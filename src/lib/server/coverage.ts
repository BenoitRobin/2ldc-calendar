import { and, eq, inArray, isNotNull } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { attendanceResponse, user } from '$lib/server/db/schema';
import { INSTRUMENTS, isInstrument, type Instrument } from '$lib/instruments';
import type { Coverage } from '$lib/specimen';

// Musicians are the accounts with an instrument; the instrument-less admin account
// isn't part of any section, so it never counts toward coverage.
export async function getCoverage(eventIds: string[]): Promise<Map<string, Coverage>> {
	const result = new Map<string, Coverage>();
	if (eventIds.length === 0) return result;

	const [musicians, ouiRows] = await Promise.all([
		db
			.select({ id: user.id, instrument: user.instrument })
			.from(user)
			.where(isNotNull(user.instrument)),
		db
			.select({ eventId: attendanceResponse.eventId, userId: attendanceResponse.userId })
			.from(attendanceResponse)
			.where(
				and(inArray(attendanceResponse.eventId, eventIds), eq(attendanceResponse.status, 'oui'))
			)
	]);

	const instrumentOf = new Map(
		musicians
			.filter((m) => isInstrument(m.instrument))
			.map((m) => [m.id, m.instrument as Instrument])
	);
	const sectionSize = new Map<Instrument, number>();
	for (const i of instrumentOf.values()) sectionSize.set(i, (sectionSize.get(i) ?? 0) + 1);

	for (const id of eventIds) {
		const oui = new Map<Instrument, number>();
		for (const row of ouiRows) {
			const instrument = row.eventId === id ? instrumentOf.get(row.userId) : undefined;
			if (instrument) oui.set(instrument, (oui.get(instrument) ?? 0) + 1);
		}
		const sections = INSTRUMENTS.map((instrument) => ({
			instrument,
			oui: oui.get(instrument) ?? 0,
			members: sectionSize.get(instrument) ?? 0
		}));
		result.set(id, {
			oui: sections.reduce((n, s) => n + s.oui, 0),
			members: instrumentOf.size,
			sections
		});
	}
	return result;
}
