<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { Card, CardContent } from '$lib/components/ui/card';
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

	<div class="mx-auto flex max-w-lg items-center gap-2">
		{#if data.prevEventId}
			<a
				href={resolve('/(app)/calendar/[eventId]', { eventId: data.prevEventId })}
				aria-label="Évènement précédent"
				class="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
			>
				<ChevronLeft class="size-5" aria-hidden="true" />
			</a>
		{:else}
			<span class="size-9 shrink-0" aria-hidden="true"></span>
		{/if}

		<Card class="min-w-0 flex-1 border-t-2 border-primary/70">
			<CardContent class="flex h-96 gap-4 pt-6">
				<div class="w-12 shrink-0 text-center">
					<p class="font-display text-2xl leading-none font-semibold">{day.day}</p>
					<p class="mt-1 text-xs text-muted-foreground">{day.month}</p>
				</div>
				<div class="flex min-w-0 flex-1 flex-col">
					<div>
						<h1 class="line-clamp-2 font-display text-xl leading-snug font-extrabold">
							{data.event.name}
						</h1>
						<p class="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
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

					<div class="mt-auto pt-5">
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
							<p class="mt-2 text-sm text-danger" role="alert">
								Échec de l'enregistrement, réessayez.
							</p>
						{/if}
					</div>
				</div>
			</CardContent>
		</Card>

		{#if data.nextEventId}
			<a
				href={resolve('/(app)/calendar/[eventId]', { eventId: data.nextEventId })}
				aria-label="Évènement suivant"
				class="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
			>
				<ChevronRight class="size-5" aria-hidden="true" />
			</a>
		{:else}
			<span class="size-9 shrink-0" aria-hidden="true"></span>
		{/if}
	</div>
</div>
