<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import CalendarDays from '@lucide/svelte/icons/calendar-days';
	import Table2 from '@lucide/svelte/icons/table-2';
	import LogOut from '@lucide/svelte/icons/log-out';
	import { cn } from '$lib/utils';

	const links = [
		{ href: resolve('/(app)/calendar'), label: 'Calendrier', icon: CalendarDays },
		{ href: resolve('/(app)/overview'), label: 'Vue d’ensemble', icon: Table2 }
	];
</script>

<nav
	class="fixed inset-x-0 bottom-0 flex border-t border-border bg-card md:hidden"
	aria-label="Navigation principale"
>
	{#each links as link (link.href)}
		{@const active = page.url.pathname.startsWith(link.href)}
		<a
			href={link.href}
			class={cn(
				'flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 border-t-2 py-2 text-xs',
				active
					? 'border-primary font-semibold text-primary'
					: 'border-transparent text-muted-foreground'
			)}
			aria-current={active ? 'page' : undefined}
		>
			<link.icon class="size-5" aria-hidden="true" />
			{link.label}
		</a>
	{/each}
	<form method="POST" action="/logout" class="flex flex-1">
		<button
			type="submit"
			class="flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 border-t-2 border-transparent py-2 text-xs text-muted-foreground"
		>
			<LogOut class="size-5" aria-hidden="true" />
			Déconnexion
		</button>
	</form>
</nav>
