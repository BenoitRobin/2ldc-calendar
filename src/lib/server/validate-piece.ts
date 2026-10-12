import { INSTRUMENTS, INSTRUMENT_LABELS, type Instrument } from '$lib/instruments';

// Index 0 is partie 1. An instrument with a single part has a one-item array.
export type PieceFormValues = { title: string } & Record<Instrument, string[]>;

// Fanfare parts rarely go past a partie 2; 3 leaves room without inviting clutter.
export const MAX_PARTS = 3;

const DRIVE_HOSTS = ['drive.google.com', 'docs.google.com'];

function str(formData: FormData, key: string) {
	const value = formData.get(key);
	return typeof value === 'string' ? value.trim() : '';
}

function strs(formData: FormData, key: string) {
	return formData
		.getAll(key)
		.slice(0, MAX_PARTS)
		.map((value) => (typeof value === 'string' ? value.trim() : ''));
}

function isDriveUrl(value: string) {
	try {
		const url = new URL(value);
		return url.protocol === 'https:' && DRIVE_HOSTS.includes(url.hostname);
	} catch {
		return false;
	}
}

// Optional Drive links per instrument: the form repeats a field named after the
// instrument once per part, in part order. Links are stored as pasted: the Drive
// viewer handles them, the app never fetches them.
export function parsePieceForm(formData: FormData) {
	const values = { title: str(formData, 'title') } as PieceFormValues;
	for (const instrument of INSTRUMENTS) values[instrument] = strs(formData, instrument);

	if (!values.title) {
		return { error: 'Le titre du morceau est requis.', values };
	}

	// A part keeps its position even when an earlier field is empty, so a lone
	// "partie 2" link is not silently relabelled as partie 1.
	const parts = INSTRUMENTS.flatMap((instrument) =>
		values[instrument]
			.map((driveUrl, i) => ({ instrument, partNumber: i + 1, driveUrl }))
			.filter((part) => part.driveUrl)
	);

	const invalid = parts.filter((p) => !isDriveUrl(p.driveUrl));
	if (invalid.length > 0) {
		const labels = invalid
			.map((p) =>
				values[p.instrument].length > 1
					? `${INSTRUMENT_LABELS[p.instrument]} partie ${p.partNumber}`
					: INSTRUMENT_LABELS[p.instrument]
			)
			.join(', ');
		return {
			error: `Lien(s) non reconnu(s) pour : ${labels}. Colle un lien Google Drive (https://drive.google.com/…).`,
			values
		};
	}

	return { title: values.title, parts };
}
