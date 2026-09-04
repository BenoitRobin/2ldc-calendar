<script lang="ts">
	import { enhance } from '$app/forms';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import StatusBadge, { type PresenceStatus } from '$lib/components/status-badge.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

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
</script>

<svelte:head><title>{data.event.name} — 2LDC Calendar</title></svelte:head>

<div class="p-4">
	<Card class="max-w-lg">
		<CardHeader>
			<CardTitle>{data.event.name}</CardTitle>
			<p class="text-sm text-muted-foreground">
				{data.event.date}{data.event.startTime ? ` · ${data.event.startTime}` : ''}{data.event
					.endTime
					? `–${data.event.endTime}`
					: ''}
				{data.event.location ? ` · ${data.event.location}` : ''}
			</p>
		</CardHeader>
		<CardContent class="flex flex-col gap-4">
			{#if data.event.description}
				<p class="text-sm">{data.event.description}</p>
			{/if}
			<div>
				<p class="mb-2 text-sm font-medium">Votre présence</p>
				<StatusBadge status={displayStatus} />
				{#if saveFailed}
					<p class="mt-1 text-sm text-destructive" role="alert">
						Échec de l'enregistrement, réessayez.
					</p>
				{/if}
				<div class="mt-3 flex gap-2">
					<form method="POST" action="?/respond" use:enhance={respondWith('oui')}>
						<input type="hidden" name="status" value="oui" />
						<Button type="submit" variant="outline" size="sm">Oui</Button>
					</form>
					<form method="POST" action="?/respond" use:enhance={respondWith('non')}>
						<input type="hidden" name="status" value="non" />
						<Button type="submit" variant="outline" size="sm">Non</Button>
					</form>
					<form method="POST" action="?/respond" use:enhance={respondWith('indecis')}>
						<input type="hidden" name="status" value="indecis" />
						<Button type="submit" variant="outline" size="sm">Indécis</Button>
					</form>
				</div>
			</div>
		</CardContent>
	</Card>
</div>
