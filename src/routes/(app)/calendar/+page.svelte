<script lang="ts">
	import { resolve } from '$app/paths';
	import { formatEventDay } from '$lib/format-date';
	import { STATUS_LABELS } from '$lib/components/status-badge.svelte';
	import { cn } from '$lib/utils';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Calendrier — 2LDC Calendar</title></svelte:head>

<div class="p-4">
	<h1 class="mb-2 font-display text-2xl font-extrabold">Calendrier</h1>

	<div class="flex flex-col gap-3">
		{#each data.events as evt (evt.id)}
			{@const day = formatEventDay(evt.date)}
			<a
				href={resolve('/(app)/calendar/[eventId]', { eventId: evt.id })}
				class="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent/60"
			>
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
				<span
					class={cn(
						'size-2.5 shrink-0 rounded-full',
						evt.myStatus === 'none'
							? 'border border-muted-foreground/50'
							: `bg-status-${evt.myStatus}`
					)}
					aria-hidden="true"
				></span>
				<span class="sr-only">Votre réponse : {STATUS_LABELS[evt.myStatus]}</span>
			</a>
		{:else}
			<p class="py-6 text-sm text-muted-foreground">Aucun évènement pour le moment.</p>
		{/each}
	</div>
</div>
