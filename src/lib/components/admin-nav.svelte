<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { cn } from '$lib/utils';

	const links = [
		{ href: resolve('/admin/events'), label: 'Évènements' },
		{ href: resolve('/admin/team'), label: 'Équipe' },
		{ href: resolve('/(app)/calendar'), label: 'Voir le calendrier' },
		{ href: resolve('/(app)/overview'), label: 'Vue d’ensemble' }
	];
</script>

<nav
	class="flex items-center gap-5 overflow-x-auto border-b border-border bg-card px-4 py-3"
	aria-label="Navigation admin"
>
	<span class="flex shrink-0 items-baseline gap-2">
		<span class="font-display text-lg font-black">2LDC</span>
		<span class="rounded-sm border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
			Admin
		</span>
	</span>
	<div class="flex flex-1 gap-5">
		{#each links as link (link.href)}
			{@const active = page.url.pathname.startsWith(link.href)}
			<a
				href={link.href}
				class={cn(
					'shrink-0 text-sm',
					active ? 'font-semibold text-primary' : 'text-muted-foreground hover:text-foreground'
				)}
				aria-current={active ? 'page' : undefined}
			>
				{link.label}
			</a>
		{/each}
	</div>
	<form method="POST" action="/logout" class="shrink-0">
		<button type="submit" class="text-sm text-muted-foreground hover:text-foreground">
			Déconnexion
		</button>
	</form>
</nav>
