import type { Instrument } from '$lib/instruments';

export type SectionCoverage = { instrument: Instrument; oui: number; members: number };
export type Coverage = { oui: number; members: number; sections: SectionCoverage[] };

// The "Spécimen vivant" signature: a date numeral's weight is how many musicians
// said oui — hairline when nobody is coming, black when everyone is.
export function weightFor(oui: number, members: number) {
	const share = members > 0 ? oui / members : 0;
	return Math.round(200 + share * 700);
}

export function percent(oui: number, members: number) {
	return members > 0 ? Math.round((oui / members) * 100) : 0;
}
