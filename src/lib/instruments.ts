// Single source of truth for the fixed instrument list (specs/user-auth: each
// fanfaron plays one of these) — reused by the better-auth additionalFields config
// (auth-options.ts, which needs the same literal list to generate a real sqlite enum
// column), the team create/edit forms, and the team list display.
export const INSTRUMENTS = [
	'batterie',
	'sax_alto',
	'sax_tenor',
	'sax_baryton',
	'trompette',
	'sousaphone',
	'basse',
	'trombone'
] as const;

export type Instrument = (typeof INSTRUMENTS)[number];

export const INSTRUMENT_LABELS: Record<Instrument, string> = {
	batterie: 'Batterie',
	sax_alto: 'Sax alto',
	sax_tenor: 'Sax ténor',
	sax_baryton: 'Sax baryton',
	trompette: 'Trompette',
	sousaphone: 'Sousaphone',
	basse: 'Basse',
	trombone: 'Trombone'
};

export function isInstrument(value: unknown): value is Instrument {
	return typeof value === 'string' && (INSTRUMENTS as readonly string[]).includes(value);
}
