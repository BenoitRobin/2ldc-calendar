<script lang="ts">
	import EventForm from '$lib/components/event-form.svelte';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head><title>Nouvel évènement — 2LDC Calendar</title></svelte:head>

<Card class="max-w-lg">
	<CardHeader>
		<CardTitle>Nouvel évènement</CardTitle>
	</CardHeader>
	<CardContent>
		<EventForm values={form?.values} error={form?.error} submitLabel="Créer" />
	</CardContent>
</Card>
