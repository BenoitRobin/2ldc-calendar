// Single source of truth for the fixed instrument list (specs/user-auth: each
// fanfaron plays one of these) — reused by the better-auth additionalFields config
// (auth-options.ts, which needs the same literal list to generate a real sqlite enum
// column), the team create/edit forms, and the team list display.
// Ordered by family (see INSTRUMENT_FAMILY) so every list and the coverage row
// keep each family's instruments side by side.
export const INSTRUMENTS = [
	'batterie',
	'sax_alto',
	'sax_tenor',
	'sax_baryton',
	'trompette',
	'trombone',
	'sousaphone',
	'basse'
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

export type InstrumentFamily = 'percussions' | 'saxophones' | 'trompettes' | 'trombones' | 'graves';

export const INSTRUMENT_FAMILY: Record<Instrument, InstrumentFamily> = {
	batterie: 'percussions',
	sax_alto: 'saxophones',
	sax_tenor: 'saxophones',
	sax_baryton: 'saxophones',
	trompette: 'trompettes',
	trombone: 'trombones',
	sousaphone: 'graves',
	basse: 'graves'
};

// Pastel fills from layout.css (--color-family-*), always with ink text on top.
// Spelled out in full so Tailwind's scanner sees each class.
export const FAMILY_BG: Record<InstrumentFamily, string> = {
	percussions: 'bg-family-percussions',
	saxophones: 'bg-family-saxophones',
	trompettes: 'bg-family-trompettes',
	trombones: 'bg-family-trombones',
	graves: 'bg-family-graves'
};

export function familyBg(instrument: Instrument) {
	return FAMILY_BG[INSTRUMENT_FAMILY[instrument]];
}

export function isInstrument(value: unknown): value is Instrument {
	return typeof value === 'string' && (INSTRUMENTS as readonly string[]).includes(value);
}
