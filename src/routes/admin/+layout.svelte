<script lang="ts">
	import { resolve } from '$app/paths';
	import TopNav from '$lib/components/top-nav.svelte';

	let { children } = $props();

	const links = [
		{ href: resolve('/admin/events'), label: 'Évènements' },
		{ href: resolve('/admin/team'), label: 'Équipe' },
		{ href: resolve('/(app)/calendar'), label: 'Voir le calendrier' },
		{ href: resolve('/(app)/overview'), label: 'Vue d’ensemble' }
	];
</script>

<TopNav {links} roleTag="Admin" />
<div class="p-4 pt-24 md:mx-auto md:w-4/5 md:pt-28">
	{@render children()}
</div>
