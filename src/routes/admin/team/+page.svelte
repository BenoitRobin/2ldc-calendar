<script lang="ts">
	import { resolve } from '$app/paths';
	import { buttonVariants } from '$lib/components/ui/button';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Équipe — 2LDC Calendar</title></svelte:head>

<div class="flex items-center justify-between">
	<h1 class="font-display text-2xl font-extrabold">Équipe</h1>
	<a href={resolve('/admin/team/new')} class={buttonVariants()}>Nouveau membre</a>
</div>

<div class="mt-4 divide-y divide-border border-t border-border">
	{#each data.members as member (member.id)}
		<div class="flex items-center gap-4 py-4">
			<div class="min-w-0 flex-1">
				<p class="font-display text-lg leading-snug font-extrabold">{member.name}</p>
				<p class="mt-0.5 text-sm text-muted-foreground">{member.email}</p>
			</div>
			<span class="rounded-sm border border-border px-2 py-1 text-xs text-muted-foreground">
				{member.role === 'admin' ? 'Administrateur' : 'Standard'}
			</span>
			<a
				href={resolve('/admin/team/[userId]/edit', { userId: member.id })}
				class={buttonVariants({ variant: 'outline', size: 'sm' })}>Modifier</a
			>
		</div>
	{:else}
		<p class="py-6 text-sm text-muted-foreground">Aucun membre pour le moment.</p>
	{/each}
</div>
