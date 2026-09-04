<script lang="ts">
	import AttendanceMatrix from '$lib/components/attendance-matrix.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Vue d’ensemble — 2LDC Calendar</title></svelte:head>

<div class="p-4">
	<h1 class="mb-4 text-lg font-semibold">Vue d’ensemble</h1>

	{#if data.events.length === 0}
		<p class="text-sm text-muted-foreground">Aucun évènement pour le moment.</p>
	{:else}
		<AttendanceMatrix
			events={data.events}
			users={data.users}
			responses={data.responses}
			editable={data.isAdmin}
		/>
	{/if}
</div>
