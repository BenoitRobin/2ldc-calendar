<script lang="ts">
	import { resolve } from '$app/paths';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Évènements — 2LDC Calendar</title></svelte:head>

<div class="flex items-center justify-between">
	<h1 class="text-lg font-semibold">Évènements</h1>
	<a href={resolve('/admin/events/new')} class={buttonVariants()}>Nouvel évènement</a>
</div>

<div class="mt-4 flex flex-col gap-3">
	{#each data.events as evt (evt.id)}
		<Card>
			<CardHeader class="flex-row items-center justify-between space-y-0">
				<div>
					<CardTitle>{evt.name}</CardTitle>
					<p class="text-sm text-muted-foreground">
						{evt.date}{evt.startTime ? ` · ${evt.startTime}` : ''}{evt.endTime
							? `–${evt.endTime}`
							: ''}
						{evt.location ? ` · ${evt.location}` : ''}
					</p>
				</div>
				<a
					href={resolve('/admin/events/[eventId]/edit', { eventId: evt.id })}
					class={buttonVariants({ variant: 'outline', size: 'sm' })}>Modifier</a
				>
			</CardHeader>
			{#if evt.description}
				<CardContent>
					<p class="text-sm">{evt.description}</p>
				</CardContent>
			{/if}
		</Card>
	{:else}
		<p class="text-sm text-muted-foreground">Aucun évènement pour le moment.</p>
	{/each}
</div>
