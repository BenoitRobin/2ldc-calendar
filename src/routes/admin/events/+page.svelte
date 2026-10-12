<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
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

	// Set by the create action's redirect after the members email went out (or didn't).
	const notified = $derived(page.url.searchParams.get('notified'));
	const notifyError = $derived(page.url.searchParams.has('notifyError'));
</script>

<svelte:head><title>Dates — 2LDC Calendar</title></svelte:head>

<div class="mb-10 flex items-center justify-between md:mb-16">
	<h1 class="font-display text-2xl font-extrabold">Dates</h1>
	<a href={resolve('/admin/events/new')} class={buttonVariants()}>Nouvelle date</a>
</div>

{#if notifyError}
	<p class="mb-6 text-sm font-medium text-danger" role="alert">
		La date est créée, mais le mail aux membres n'a pas pu partir.
	</p>
{:else if notified}
	<p class="mb-6 text-sm text-muted-foreground" role="status">
		Mail envoyé à {notified} membre{Number(notified) > 1 ? 's' : ''}.
	</p>
{/if}

<div class="border-t border-foreground">
	{#each data.events as evt (evt.id)}
		<div class="border-b border-border md:flex md:items-center md:gap-4">
			<div class="flex min-w-0 items-center gap-4 py-4 md:flex-1">
				<EventTicketHeader {evt} />
			</div>
			<div class="flex items-center justify-end gap-2 pb-4 md:pb-0">
				<a
					href={resolve('/admin/events/[eventId]/edit', { eventId: evt.id })}
					class={buttonVariants({ variant: 'outline', size: 'sm' })}>Modifier</a
				>
				<button
					type="button"
					onclick={() => (deletingEvent = { id: evt.id, name: evt.name })}
					aria-label="Supprimer {evt.name}"
					class="flex size-11 shrink-0 items-center justify-center rounded-md border-[1.5px] border-destructive text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
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
