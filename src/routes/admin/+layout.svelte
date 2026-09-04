<script lang="ts">
	import { resolve } from '$app/paths';
	import TopNav from '$lib/components/top-nav.svelte';
	import CalendarCog from '@lucide/svelte/icons/calendar-cog';
	import Users from '@lucide/svelte/icons/users';
	import CalendarDays from '@lucide/svelte/icons/calendar-days';
	import Table2 from '@lucide/svelte/icons/table-2';

	let { children } = $props();

	const links = [
		{ href: resolve('/admin/events'), label: 'Évènements', icon: CalendarCog },
		{ href: resolve('/admin/team'), label: 'Équipe', icon: Users },
		{ href: resolve('/(app)/calendar'), label: 'Voir le calendrier', icon: CalendarDays },
		{ href: resolve('/(app)/overview'), label: 'Vue d’ensemble', icon: Table2 }
	];
</script>

<TopNav {links} roleTag="Admin" />
<div class="p-4 pt-24 md:mx-auto md:w-4/5 md:pt-28">
	{@render children()}
</div>
