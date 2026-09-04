<script lang="ts">
	import { resolve } from '$app/paths';
	import { buttonVariants } from '$lib/components/ui/button';
	import { formatEventDay } from '$lib/format-date';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Évènements — 2LDC Calendar</title></svelte:head>

<div class="flex items-center justify-between">
	<h1 class="font-display text-2xl font-extrabold">Évènements</h1>
	<a href={resolve('/admin/events/new')} class={buttonVariants()}>Nouvel évènement</a>
</div>

<div class="mt-4 divide-y divide-border border-t border-border">
	{#each data.events as evt (evt.id)}
		{@const day = formatEventDay(evt.date)}
		<div class="flex items-center gap-4 py-4">
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
			<a
				href={resolve('/admin/events/[eventId]/edit', { eventId: evt.id })}
				class={buttonVariants({ variant: 'outline', size: 'sm' })}>Modifier</a
			>
		</div>
	{:else}
		<p class="py-6 text-sm text-muted-foreground">Aucun évènement pour le moment.</p>
	{/each}
</div>
