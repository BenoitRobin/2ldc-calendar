<script lang="ts">
	import { enhance } from '$app/forms';
	import EventForm from '$lib/components/event-form.svelte';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head><title>Modifier l'évènement — 2LDC Calendar</title></svelte:head>

<Card class="mx-auto max-w-lg">
	<CardHeader>
		<CardTitle>Modifier l'évènement</CardTitle>
	</CardHeader>
	<CardContent>
		<EventForm
			action="?/update"
			values={form?.values ?? data.event}
			error={form?.error}
			submitLabel="Enregistrer"
		/>
	</CardContent>
</Card>

<form
	method="POST"
	action="?/delete"
	use:enhance={({ cancel }) => {
		// A separate onsubmit calling e.preventDefault() would NOT stop this: enhance
		// installs its own submit listener that proceeds to fetch regardless of what
		// other listeners do with preventDefault. cancel() is the only way to actually
		// abort an enhanced submission (specs/event-calendar: "Deletion without
		// confirmation" must leave the event unchanged).
		if (
			!confirm(
				'Supprimer cet évènement ? Les réponses de présence associées seront aussi supprimées.'
			)
		) {
			cancel();
		}
	}}
	class="mx-auto mt-4 max-w-lg"
>
	<Button type="submit" variant="destructive">Supprimer l'évènement</Button>
</form>
