<script lang="ts">
	import { enhance } from '$app/forms';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { buttonVariants } from '$lib/components/ui/button';
	import StatusBadge, { type PresenceStatus } from '$lib/components/status-badge.svelte';
	import { formatEventDay } from '$lib/format-date';
	import { cn } from '$lib/utils';
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
	<Card class="max-w-lg border-t-2 border-primary/70">
		<CardContent class="flex gap-4 pt-6">
			<div class="w-12 shrink-0 text-center">
				<p class="font-display text-2xl leading-none font-semibold">{day.day}</p>
				<p class="mt-1 text-xs text-muted-foreground">{day.month}</p>
			</div>
			<div class="min-w-0 flex-1">
				<h1 class="font-display text-xl leading-snug font-extrabold">{data.event.name}</h1>
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
					<p class="mt-3 text-sm">{data.event.description}</p>
				{/if}

				<div class="mt-5">
					<p class="mb-2 text-sm font-medium">Votre présence</p>
					<div class="flex gap-2">
						{#each CHOICES as choice (choice.status)}
							{@const active = displayStatus === choice.status}
							<form method="POST" action="?/respond" use:enhance={respondWith(choice.status)}>
								<input type="hidden" name="status" value={choice.status} />
								<button
									type="submit"
									class={cn(
										buttonVariants({ variant: active ? 'default' : 'outline', size: 'sm' }),
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
</div>
