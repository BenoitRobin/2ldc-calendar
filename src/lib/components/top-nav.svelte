<script lang="ts">
	import type { Component } from 'svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { cn } from '$lib/utils';
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';
	import LogOut from '@lucide/svelte/icons/log-out';
	import logo from '$lib/assets/logo-2ldc-drum.svg';

	let {
		links,
		roleTag,
		class: className
	}: {
		links: { href: string; label: string; icon?: Component }[];
		roleTag?: string;
		class?: string;
	} = $props();

	let open = $state(false);

	let homeHref = $derived(
		page.data.user?.role === 'admin' ? resolve('/admin/events') : resolve('/(app)/calendar')
	);

	// Ferme le menu mobile après un changement de page (clic sur un lien),
	// sinon il resterait ouvert par-dessus la page suivante.
	$effect(() => {
		void page.url.pathname;
		open = false;
	});
</script>

<div
	class={cn(
		'fixed inset-x-0 top-0 z-20 border-b border-foreground bg-background md:inset-x-auto md:left-1/2 md:w-4/5 md:-translate-x-1/2',
		className
	)}
>
	<nav
		class="flex items-center gap-4 px-4 py-3"
		aria-label={roleTag ? `Navigation ${roleTag.toLowerCase()}` : 'Navigation principale'}
	>
		<!-- items-baseline: the logo (an image) has no text baseline, so its bottom edge acts as
		     one and the name sits on the bottom of the logo's frame. The role tag is a box, so
		     its bottom border goes on that line instead: self-end + mb-1.5 cancels the name's
		     descent (6px below its baseline at text-sm). -->
		<div class="flex flex-1 shrink-0 items-baseline gap-2">
			<a href={homeHref} class="flex shrink-0">
				<img src={logo} alt="2LDC — accueil" class="h-8 w-auto" />
			</a>
			{#if roleTag}
				<span
					class="mb-1.5 self-end rounded-sm border border-border px-1.5 py-0.5 text-xs text-muted-foreground"
				>
					{roleTag}
				</span>
			{/if}
			{#if page.data.user?.name}
				<span class="text-sm text-muted-foreground">{page.data.user.name}</span>
			{/if}
		</div>
		<div class="hidden shrink-0 items-center gap-5 overflow-x-auto md:flex">
			{#each links as link (link.href)}
				{@const active = page.url.pathname.startsWith(link.href)}
				<!-- eslint-disable svelte/no-navigation-without-resolve -- links is built with resolve() by every caller (admin/team layouts) -->
				<a
					href={link.href}
					class={cn(
						'flex shrink-0 items-center gap-1.5 text-sm',
						active ? 'font-semibold text-primary' : 'text-muted-foreground hover:text-foreground'
					)}
					aria-current={active ? 'page' : undefined}
				>
					{#if link.icon}
						<link.icon class="size-4 shrink-0" aria-hidden="true" />
					{/if}
					{link.label}
				</a>
				<!-- eslint-enable svelte/no-navigation-without-resolve -->
			{/each}
		</div>
		<div class="hidden flex-1 shrink-0 justify-end md:flex">
			<form method="POST" action="/logout">
				<button
					type="submit"
					class="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
				>
					<LogOut class="size-4 shrink-0" aria-hidden="true" />
					Déconnexion
				</button>
			</form>
		</div>
		<button
			type="button"
			class="-mr-2.5 flex size-11 shrink-0 items-center justify-center text-foreground md:hidden"
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
		<div id="top-nav-mobile-menu" class="border-t border-foreground md:hidden">
			<div class="flex flex-col p-2">
				{#each links as link (link.href)}
					{@const active = page.url.pathname.startsWith(link.href)}
					<!-- eslint-disable svelte/no-navigation-without-resolve -- links is built with resolve() by every caller (admin/team layouts) -->
					<a
						href={link.href}
						class={cn(
							'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm',
							active ? 'font-semibold text-primary' : 'text-muted-foreground hover:text-foreground'
						)}
						aria-current={active ? 'page' : undefined}
					>
						{#if link.icon}
							<link.icon class="size-4 shrink-0" aria-hidden="true" />
						{/if}
						{link.label}
					</a>
					<!-- eslint-enable svelte/no-navigation-without-resolve -->
				{/each}
				<form method="POST" action="/logout">
					<button
						type="submit"
						class="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-muted-foreground hover:text-foreground"
					>
						<LogOut class="size-4 shrink-0" aria-hidden="true" />
						Déconnexion
					</button>
				</form>
			</div>
		</div>
	{/if}
</div>
