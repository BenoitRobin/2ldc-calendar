<script lang="ts">
	import BottomNav from '$lib/components/bottom-nav.svelte';

	let { children } = $props();
</script>

<div class="pb-16">
	{@render children()}
</div>
<BottomNav />
