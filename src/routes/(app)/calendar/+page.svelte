<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { STATUS_LABELS } from '$lib/components/status-badge.svelte';
	import EventTicketHeader from '$lib/components/event-ticket-header.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let isAdmin = $derived(page.data.user?.role === 'admin');
</script>

<svelte:head><title>Calendrier — 2LDC Calendar</title></svelte:head>

<div class="p-4">
	<div class="mb-20 flex items-center justify-between">
		<h1 class="font-display text-2xl font-extrabold">Calendrier</h1>
		{#if isAdmin}
			<a href={resolve('/admin/events/new')} class={buttonVariants()}>Ajouter une date</a>
		{/if}
	</div>

	<div class="flex flex-col gap-3">
		{#each data.events as evt (evt.id)}
			<a
				href={resolve('/(app)/calendar/[eventId]', { eventId: evt.id })}
				class="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent/60"
			>
				<EventTicketHeader {evt} />
				<div class="flex w-14 shrink-0 items-center justify-center md:w-96">
					<span
						class={cn(
							'size-2.5 rounded-full',
							evt.myStatus === 'none'
								? 'border border-muted-foreground/50'
								: `bg-status-${evt.myStatus}`
						)}
						aria-hidden="true"
					></span>
					<span class="sr-only">Votre réponse : {STATUS_LABELS[evt.myStatus]}</span>
				</div>
			</a>
		{:else}
			<p class="py-6 text-sm text-muted-foreground">Aucune date pour le moment.</p>
		{/each}
	</div>
</div>
