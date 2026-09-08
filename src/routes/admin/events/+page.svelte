<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { buttonVariants } from '$lib/components/ui/button';
	import {
		AlertDialog,
		AlertDialogContent,
		AlertDialogHeader,
		AlertDialogFooter,
		AlertDialogTitle,
		AlertDialogDescription,
		AlertDialogAction,
		AlertDialogCancel
	} from '$lib/components/ui/alert-dialog';
	import EventTicketHeader from '$lib/components/event-ticket-header.svelte';
	import X from '@lucide/svelte/icons/x';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let deletingEvent = $state<{ id: string; name: string } | null>(null);
</script>

<svelte:head><title>Dates — 2LDC Calendar</title></svelte:head>

<div class="mb-6 flex items-center justify-between">
	<h1 class="font-display text-2xl font-extrabold">Dates</h1>
	<a href={resolve('/admin/events/new')} class={buttonVariants()}>Nouvelle date</a>
</div>

<div class="flex flex-col gap-3">
	{#each data.events as evt (evt.id)}
		<div class="rounded-lg border border-border bg-card">
			<div class="flex items-center gap-4 p-4">
				<EventTicketHeader {evt} />
			</div>
			<div
				class="flex items-center justify-end gap-2 border-t border-dashed border-border px-4 py-3"
			>
				<a
					href={resolve('/admin/events/[eventId]/edit', { eventId: evt.id })}
					class={buttonVariants({ variant: 'outline', size: 'sm' })}>Modifier</a
				>
				<button
					type="button"
					onclick={() => (deletingEvent = { id: evt.id, name: evt.name })}
					aria-label="Supprimer {evt.name}"
					class="flex size-9 shrink-0 items-center justify-center rounded-md border border-destructive/60 text-destructive transition-colors hover:bg-destructive/10"
				>
					<X class="size-4" aria-hidden="true" />
				</button>
			</div>
		</div>
	{:else}
		<p class="py-6 text-sm text-muted-foreground">Aucune date pour le moment.</p>
	{/each}
</div>

<AlertDialog
	open={!!deletingEvent}
	onOpenChange={(open) => {
		if (!open) deletingEvent = null;
	}}
>
	<AlertDialogContent>
		<AlertDialogHeader>
			<AlertDialogTitle>Supprimer « {deletingEvent?.name} » ?</AlertDialogTitle>
			<AlertDialogDescription>
				Cette action est définitive : la date et toutes les réponses de présence associées seront
				supprimées. Impossible d'annuler après confirmation.
			</AlertDialogDescription>
		</AlertDialogHeader>
		{#if form?.error}
			<p class="text-sm text-danger" role="alert">{form.error}</p>
		{/if}
		<AlertDialogFooter>
			<AlertDialogCancel onclick={() => (deletingEvent = null)}>Annuler</AlertDialogCancel>
			<form
				method="POST"
				action="?/delete"
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'success') {
							deletingEvent = null;
						}
						await update();
					};
				}}
			>
				<input type="hidden" name="eventId" value={deletingEvent?.id ?? ''} />
				<AlertDialogAction type="submit">Supprimer définitivement</AlertDialogAction>
			</form>
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>
