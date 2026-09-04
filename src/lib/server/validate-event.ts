export type EventFieldErrors = { error: string; values: Record<string, string> };

function str(formData: FormData, key: string) {
	const value = formData.get(key);
	return typeof value === 'string' ? value : '';
}

export function parseEventForm(formData: FormData) {
	const values = {
		name: str(formData, 'name').trim(),
		date: str(formData, 'date').trim(),
		startTime: str(formData, 'startTime').trim(),
		endTime: str(formData, 'endTime').trim(),
		location: str(formData, 'location').trim(),
		description: str(formData, 'description').trim()
	};

	// specs/event-calendar: "Missing required fields" — name and date only.
	const missing = [!values.name && 'nom', !values.date && 'date'].filter((field): field is string =>
		Boolean(field)
	);

	if (missing.length > 0) {
		return {
			error: `Champ(s) requis manquant(s) : ${missing.join(', ')}.`,
			values
		} satisfies EventFieldErrors;
	}

	return {
		name: values.name,
		date: values.date,
		startTime: values.startTime || null,
		endTime: values.endTime || null,
		location: values.location || null,
		description: values.description || null
	};
}
