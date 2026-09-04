<script lang="ts">
	import { resolve } from '$app/paths';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Calendrier — 2LDC Calendar</title></svelte:head>

<div class="p-4">
	<h1 class="mb-4 text-lg font-semibold">Calendrier</h1>

	<div class="flex flex-col gap-3">
		{#each data.events as evt (evt.id)}
			<a href={resolve('/(app)/calendar/[eventId]', { eventId: evt.id })} class="block">
				<Card>
					<CardHeader>
						<CardTitle>{evt.name}</CardTitle>
						<p class="text-sm text-muted-foreground">
							{evt.date}{evt.startTime ? ` · ${evt.startTime}` : ''}{evt.endTime
								? `–${evt.endTime}`
								: ''}
							{evt.location ? ` · ${evt.location}` : ''}
						</p>
					</CardHeader>
					{#if evt.description}
						<CardContent>
							<p class="text-sm">{evt.description}</p>
						</CardContent>
					{/if}
				</Card>
			</a>
		{:else}
			<p class="text-sm text-muted-foreground">Aucun évènement pour le moment.</p>
		{/each}
	</div>
</div>
