<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { buttonVariants } from '$lib/components/ui/button';
	import StatusBadge, { type PresenceStatus } from '$lib/components/status-badge.svelte';
	import { formatEventDay } from '$lib/format-date';
	import { cn } from '$lib/utils';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let day = $derived(formatEventDay(data.event.date));

	// Optimistic update (specs/event-attendance): reflect the new status immediately,
	// then roll back to the last server-confirmed value if the save fails. Synced from
	// `data` via $effect (not initialized directly) so navigating between different
	// event pages re-syncs this instead of keeping stale state.
	let displayStatus = $state<PresenceStatus>('none');
	let confirmedStatus = $state<PresenceStatus>('none');
	let saveFailed = $state(false);

	$effect(() => {
		displayStatus = data.myStatus as PresenceStatus;
		confirmedStatus = data.myStatus as PresenceStatus;
		saveFailed = false;
	});

	function respondWith(status: PresenceStatus) {
		return () => {
			displayStatus = status;
			saveFailed = false;
			return async ({ result }: { result: { type: string } }) => {
				if (result.type === 'success') {
					confirmedStatus = status;
				} else {
					displayStatus = confirmedStatus;
					saveFailed = true;
				}
			};
		};
	}

	const CHOICES: { status: PresenceStatus; label: string }[] = [
		{ status: 'oui', label: 'Oui' },
		{ status: 'non', label: 'Non' },
		{ status: 'indecis', label: 'Indécis' }
	];
</script>

<svelte:head><title>{data.event.name} — 2LDC Calendar</title></svelte:head>

<div class="p-4">
	<a
		href={resolve('/(app)/calendar')}
		class={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'mb-4')}
	>
		<ArrowLeft class="size-4" aria-hidden="true" />
		Retour au calendrier
	</a>

	<div class="mx-auto flex max-w-lg items-center gap-2 md:max-w-3xl">
		{#if data.prevEvent}
			{@const prevDay = formatEventDay(data.prevEvent.date)}
			<a
				href={resolve('/(app)/calendar/[eventId]', { eventId: data.prevEvent.id })}
				aria-label="Évènement précédent : {data.prevEvent.name}"
				class="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground md:hidden"
			>
				<ChevronLeft class="size-5" aria-hidden="true" />
			</a>
			<a
				href={resolve('/(app)/calendar/[eventId]', { eventId: data.prevEvent.id })}
				class="hidden w-40 shrink-0 items-start gap-2 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-accent/60 md:flex"
			>
				<ChevronLeft class="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
				<div class="min-w-0">
					<p class="text-xs text-muted-foreground">{prevDay.day} {prevDay.month}</p>
					<p class="line-clamp-2 text-sm font-semibold">{data.prevEvent.name}</p>
				</div>
			</a>
		{:else}
			<span class="size-9 shrink-0 md:hidden" aria-hidden="true"></span>
			<span class="hidden w-40 shrink-0 md:block" aria-hidden="true"></span>
		{/if}

		<div class="min-w-0 flex-1 rounded-lg border border-border bg-card">
			<div class="flex gap-4 p-4">
				<div class="w-14 shrink-0 text-center">
					<p class="font-display text-2xl leading-none font-extrabold text-accent">{day.day}</p>
					<p class="mt-1 text-xs text-muted-foreground">{day.month}</p>
				</div>
				<div class="min-w-0 flex-1">
					<h1 class="font-display text-xl leading-snug font-extrabold">
						{data.event.name}
					</h1>
					<p class="mt-0.5 text-sm text-muted-foreground">
						{[
							data.event.startTime && data.event.endTime
								? `${data.event.startTime}–${data.event.endTime}`
								: data.event.startTime,
							data.event.location
						]
							.filter(Boolean)
							.join(', ')}
					</p>

					{#if data.event.description}
						<p class="mt-3 line-clamp-3 text-sm">{data.event.description}</p>
					{/if}
				</div>
			</div>

			<div class="border-t border-dashed border-border p-4">
				<p class="mb-2 text-sm font-medium">Votre présence</p>
				<div class="grid grid-cols-3 gap-2">
					{#each CHOICES as choice (choice.status)}
						{@const active = displayStatus === choice.status}
						<form method="POST" action="?/respond" use:enhance={respondWith(choice.status)}>
							<input type="hidden" name="status" value={choice.status} />
							<button
								type="submit"
								class={cn(
									buttonVariants({ variant: active ? 'default' : 'outline', size: 'sm' }),
									'w-full px-1',
									active && `bg-status-${choice.status} text-status-${choice.status}-foreground`
								)}
							>
								{choice.label}
							</button>
						</form>
					{/each}
				</div>
				{#if displayStatus === 'none'}
					<p class="mt-2 text-sm text-muted-foreground">
						<StatusBadge status="none" /> — vous n'avez pas encore répondu.
					</p>
				{/if}
				{#if saveFailed}
					<p class="mt-2 text-sm text-danger" role="alert">Échec de l'enregistrement, réessayez.</p>
				{/if}
			</div>
		</div>

		{#if data.nextEvent}
			{@const nextDay = formatEventDay(data.nextEvent.date)}
			<a
				href={resolve('/(app)/calendar/[eventId]', { eventId: data.nextEvent.id })}
				aria-label="Évènement suivant : {data.nextEvent.name}"
				class="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground md:hidden"
			>
				<ChevronRight class="size-5" aria-hidden="true" />
			</a>
			<a
				href={resolve('/(app)/calendar/[eventId]', { eventId: data.nextEvent.id })}
				class="hidden w-40 shrink-0 items-start justify-between gap-2 rounded-lg border border-border bg-card p-3 text-right transition-colors hover:border-accent/60 md:flex"
			>
				<div class="min-w-0">
					<p class="text-xs text-muted-foreground">{nextDay.day} {nextDay.month}</p>
					<p class="line-clamp-2 text-sm font-semibold">{data.nextEvent.name}</p>
				</div>
				<ChevronRight class="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
			</a>
		{:else}
			<span class="size-9 shrink-0 md:hidden" aria-hidden="true"></span>
			<span class="hidden w-40 shrink-0 md:block" aria-hidden="true"></span>
		{/if}
	</div>
</div>
