<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '$lib/utils';

	let {
		links,
		roleTag,
		class: className
	}: {
		links: { href: string; label: string }[];
		roleTag?: string;
		class?: string;
	} = $props();
</script>

<div
	class={cn(
		'fixed inset-x-0 top-0 z-20 border-b border-border bg-card md:inset-x-auto md:left-1/2 md:w-4/5 md:-translate-x-1/2',
		className
	)}
>
	<nav
		class="flex items-center gap-4 overflow-x-auto px-4 py-3"
		aria-label={roleTag ? `Navigation ${roleTag.toLowerCase()}` : 'Navigation principale'}
	>
		<div class="flex flex-1 shrink-0 items-center gap-2">
			<span class="font-display text-lg font-black">2LDC</span>
			{#if roleTag}
				<span class="rounded-sm border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
					{roleTag}
				</span>
			{/if}
			{#if page.data.user?.name}
				<span class="text-sm text-muted-foreground">{page.data.user.name}</span>
			{/if}
		</div>
		<div class="flex shrink-0 gap-5">
			{#each links as link (link.href)}
				{@const active = page.url.pathname.startsWith(link.href)}
				<!-- eslint-disable svelte/no-navigation-without-resolve -- links is built with resolve() by every caller (admin/team layouts) -->
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
				<!-- eslint-enable svelte/no-navigation-without-resolve -->
			{/each}
		</div>
		<div class="flex flex-1 shrink-0 justify-end">
			<form method="POST" action="/logout">
				<button type="submit" class="text-sm text-muted-foreground hover:text-foreground">
					Déconnexion
				</button>
			</form>
		</div>
	</nav>
</div>
