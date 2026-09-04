<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '$lib/utils';
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';

	let {
		links,
		roleTag,
		class: className
	}: {
		links: { href: string; label: string }[];
		roleTag?: string;
		class?: string;
	} = $props();

	let open = $state(false);

	// Ferme le menu mobile après un changement de page (clic sur un lien),
	// sinon il resterait ouvert par-dessus la page suivante.
	$effect(() => {
		void page.url.pathname;
		open = false;
	});
</script>

<div
	class={cn(
		'fixed inset-x-0 top-0 z-20 border-b border-border bg-card md:inset-x-auto md:left-1/2 md:w-4/5 md:-translate-x-1/2',
		className
	)}
>
	<nav
		class="flex items-center gap-4 px-4 py-3"
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
		<div class="hidden shrink-0 gap-5 overflow-x-auto md:flex">
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
		<div class="hidden flex-1 shrink-0 justify-end md:flex">
			<form method="POST" action="/logout">
				<button type="submit" class="text-sm text-muted-foreground hover:text-foreground">
					Déconnexion
				</button>
			</form>
		</div>
		<button
			type="button"
			class="shrink-0 text-muted-foreground md:hidden"
			aria-expanded={open}
			aria-controls="top-nav-mobile-menu"
			aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
			onclick={() => (open = !open)}
		>
			{#if open}
				<X class="size-6" aria-hidden="true" />
			{:else}
				<Menu class="size-6" aria-hidden="true" />
			{/if}
		</button>
	</nav>
	{#if open}
		<div id="top-nav-mobile-menu" class="border-t border-border md:hidden">
			<div class="flex flex-col p-2">
				{#each links as link (link.href)}
					{@const active = page.url.pathname.startsWith(link.href)}
					<!-- eslint-disable svelte/no-navigation-without-resolve -- links is built with resolve() by every caller (admin/team layouts) -->
					<a
						href={link.href}
						class={cn(
							'rounded-md px-3 py-2.5 text-sm',
							active ? 'font-semibold text-primary' : 'text-muted-foreground hover:text-foreground'
						)}
						aria-current={active ? 'page' : undefined}
					>
						{link.label}
					</a>
					<!-- eslint-enable svelte/no-navigation-without-resolve -->
				{/each}
				<form method="POST" action="/logout">
					<button
						type="submit"
						class="w-full rounded-md px-3 py-2.5 text-left text-sm text-muted-foreground hover:text-foreground"
					>
						Déconnexion
					</button>
				</form>
			</div>
		</div>
	{/if}
</div>
