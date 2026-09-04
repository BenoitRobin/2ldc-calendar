<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import TopNav from '$lib/components/top-nav.svelte';
	import CalendarCog from '@lucide/svelte/icons/calendar-cog';
	import Users from '@lucide/svelte/icons/users';
	import CalendarDays from '@lucide/svelte/icons/calendar-days';
	import Table2 from '@lucide/svelte/icons/table-2';

	let { children } = $props();

	// An admin browsing the shared calendar/overview pages must still see the admin
	// sections in the nav — otherwise they hit a dead end with no way back to
	// Évènements/Équipe (this component's links don't know about admin routes
	// otherwise, since /calendar and /overview are shared with standard accounts).
	let isAdmin = $derived(page.data.user?.role === 'admin');
	let links = $derived([
		...(isAdmin
			? [
					{ href: resolve('/admin/events'), label: 'Évènements', icon: CalendarCog },
					{ href: resolve('/admin/team'), label: 'Équipe', icon: Users }
				]
			: []),
		{ href: resolve('/(app)/calendar'), label: 'Calendrier', icon: CalendarDays },
		{ href: resolve('/(app)/overview'), label: 'Vue d’ensemble', icon: Table2 }
	]);
</script>

<TopNav {links} roleTag={isAdmin ? 'Admin' : undefined} />
<div class="pt-24 md:mx-auto md:w-4/5 md:pt-28">
	{@render children()}
</div>
