<script lang="ts">
	import { resolve } from '$app/paths';
	import { formatEventDay } from '$lib/format-date';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Calendrier — 2LDC Calendar</title></svelte:head>

<div class="p-4">
	<h1 class="mb-2 font-display text-2xl font-extrabold">Calendrier</h1>

	<div class="divide-y divide-border border-t border-border">
		{#each data.events as evt (evt.id)}
			{@const day = formatEventDay(evt.date)}
			<a
				href={resolve('/(app)/calendar/[eventId]', { eventId: evt.id })}
				class="-mx-4 flex gap-4 px-4 py-4 transition-colors hover:bg-secondary/40"
			>
				<div class="w-12 shrink-0 text-center">
					<p class="font-display text-2xl leading-none font-semibold">{day.day}</p>
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
			</a>
		{:else}
			<p class="py-6 text-sm text-muted-foreground">Aucun évènement pour le moment.</p>
		{/each}
	</div>
</div>
