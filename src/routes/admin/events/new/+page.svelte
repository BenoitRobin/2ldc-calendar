<script lang="ts">
	import { resolve } from '$app/paths';
	import EventForm from '$lib/components/event-form.svelte';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import X from '@lucide/svelte/icons/x';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head><title>Nouvel évènement — 2LDC Calendar</title></svelte:head>

<Card class="mx-auto max-w-lg">
	<CardHeader class="flex-row items-center justify-between">
		<CardTitle>Nouvel évènement</CardTitle>
		<a
			href={resolve('/admin/events')}
			aria-label="Fermer"
			class="flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
		>
			<X class="size-4" aria-hidden="true" />
		</a>
	</CardHeader>
	<CardContent>
		<EventForm values={form?.values} error={form?.error} submitLabel="Créer" />
	</CardContent>
</Card>
