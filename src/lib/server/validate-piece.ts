import { INSTRUMENTS, INSTRUMENT_LABELS, type Instrument } from '$lib/instruments';

export type PieceFormValues = { title: string } & Record<Instrument, string>;

const DRIVE_HOSTS = ['drive.google.com', 'docs.google.com'];

function str(formData: FormData, key: string) {
	const value = formData.get(key);
	return typeof value === 'string' ? value.trim() : '';
}

function isDriveUrl(value: string) {
	try {
		const url = new URL(value);
		return url.protocol === 'https:' && DRIVE_HOSTS.includes(url.hostname);
	} catch {
		return false;
	}
}

// One optional Drive link per instrument (form fields named after INSTRUMENTS).
// Links are stored as pasted: the Drive viewer handles them, the app never fetches them.
export function parsePieceForm(formData: FormData) {
	const values = { title: str(formData, 'title') } as PieceFormValues;
	for (const instrument of INSTRUMENTS) values[instrument] = str(formData, instrument);

	if (!values.title) {
		return { error: 'Le titre du morceau est requis.', values };
	}

	const invalid = INSTRUMENTS.filter((i) => values[i] && !isDriveUrl(values[i]));
	if (invalid.length > 0) {
		const labels = invalid.map((i) => INSTRUMENT_LABELS[i]).join(', ');
		return {
			error: `Lien(s) non reconnu(s) pour : ${labels}. Colle un lien Google Drive (https://drive.google.com/…).`,
			values
		};
	}

	const parts = INSTRUMENTS.filter((i) => values[i]).map((instrument) => ({
		instrument,
		driveUrl: values[instrument]
	}));

	return { title: values.title, parts };
}
