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
	import { formatEventDay } from '$lib/format-date';
	import X from '@lucide/svelte/icons/x';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let deletingEvent = $state<{ id: string; name: string } | null>(null);
</script>

<svelte:head><title>Évènements — 2LDC Calendar</title></svelte:head>

<div class="flex items-center justify-between">
	<h1 class="font-display text-2xl font-extrabold">Évènements</h1>
	<a href={resolve('/admin/events/new')} class={buttonVariants()}>Nouvel évènement</a>
</div>

<div class="mt-4 flex flex-col gap-3">
	{#each data.events as evt (evt.id)}
		{@const day = formatEventDay(evt.date)}
		<div class="rounded-lg border border-border bg-card">
			<div class="flex items-center gap-4 p-4">
				<div class="w-14 shrink-0 text-center">
					<p class="font-display text-2xl leading-none font-extrabold text-accent">{day.day}</p>
					<p class="mt-1 text-xs text-muted-foreground">{day.month}</p>
				</div>
				<div class="min-w-0 flex-1">
					<p class="font-display text-lg leading-snug font-extrabold">{evt.name}</p>
					<p class="mt-0.5 text-sm text-muted-foreground">
						{[
							evt.startTime && evt.endTime ? `${evt.startTime}–${evt.endTime}` : evt.startTime,
							evt.location
						]
							.filter(Boolean)
							.join(', ')}
					</p>
				</div>
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
		<p class="py-6 text-sm text-muted-foreground">Aucun évènement pour le moment.</p>
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
				Cette action est définitive : l'évènement et toutes les réponses de présence associées
				seront supprimés. Impossible d'annuler après confirmation.
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
