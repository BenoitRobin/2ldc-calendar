<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import BottomNav from '$lib/components/bottom-nav.svelte';
	import TopNav from '$lib/components/top-nav.svelte';

	let { children } = $props();

	// An admin browsing the shared calendar/overview pages must still see the admin
	// sections in the nav — otherwise they hit a dead end with no way back to
	// Évènements/Équipe (this component's links don't know about admin routes
	// otherwise, since /calendar and /overview are shared with standard accounts).
	let isAdmin = $derived(page.data.user?.role === 'admin');
	let links = $derived([
		...(isAdmin
			? [
					{ href: resolve('/admin/events'), label: 'Évènements' },
					{ href: resolve('/admin/team'), label: 'Équipe' }
				]
			: []),
		{ href: resolve('/(app)/calendar'), label: 'Calendrier' },
		{ href: resolve('/(app)/overview'), label: 'Vue d’ensemble' }
	]);
</script>

<TopNav
	{links}
	roleTag={isAdmin ? 'Admin' : undefined}
	class={isAdmin ? undefined : 'hidden md:block'}
/>
<div
	class={isAdmin
		? 'pt-24 md:mx-auto md:w-4/5 md:pt-28'
		: 'pb-16 md:mx-auto md:w-4/5 md:pt-28 md:pb-0'}
>
	{@render children()}
</div>
{#if !isAdmin}
	<BottomNav />
{/if}
