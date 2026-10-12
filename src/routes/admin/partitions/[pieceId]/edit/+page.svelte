<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import PieceForm from '$lib/components/piece-form.svelte';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import X from '@lucide/svelte/icons/x';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head><title>Modifier le morceau — 2LDC Calendar</title></svelte:head>

<Card class="mx-auto max-w-lg">
	<CardHeader class="flex-row items-center justify-between">
		<CardTitle>Modifier le morceau</CardTitle>
		<a
			href={resolve('/(app)/partition')}
			aria-label="Fermer"
			class="flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
		>
			<X class="size-4" aria-hidden="true" />
		</a>
	</CardHeader>
	<CardContent>
		<PieceForm
			action="?/update"
			values={form?.values ?? data.values}
			error={form?.error}
			submitLabel="Enregistrer"
		/>
	</CardContent>
</Card>

<form
	method="POST"
	action="?/delete"
	use:enhance={({ cancel }) => {
		// cancel() is the only way to abort an enhanced submission (see the same
		// pattern in admin/events/[eventId]/edit).
		if (!confirm('Supprimer ce morceau et tous ses liens de partition ?')) {
			cancel();
		}
	}}
	class="mx-auto mt-4 max-w-lg"
>
	<Button type="submit" variant="destructive">Supprimer le morceau</Button>
</form>
