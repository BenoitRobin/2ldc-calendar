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
	class="flex items-center gap-4 overflow-x-auto border-b bg-background px-4 py-3"
	aria-label="Navigation admin"
>
	<span class="shrink-0 font-semibold">2LDC Calendar — Admin</span>
	<div class="flex flex-1 gap-4">
		{#each links as link (link.href)}
			{@const active = page.url.pathname.startsWith(link.href)}
			<a
				href={link.href}
				class={cn(
					'shrink-0 text-sm',
					active ? 'font-medium text-primary' : 'text-muted-foreground'
				)}
				aria-current={active ? 'page' : undefined}
			>
				{link.label}
			</a>
		{/each}
	</div>
	<form method="POST" action="/logout" class="shrink-0">
		<button type="submit" class="text-sm text-muted-foreground">Déconnexion</button>
	</form>
</nav>
