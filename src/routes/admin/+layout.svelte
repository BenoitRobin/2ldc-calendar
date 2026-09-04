<script lang="ts">
	import AdminNav from '$lib/components/admin-nav.svelte';

	let { children } = $props();
</script>

<AdminNav />
<div class="p-4">
	{@render children()}
</div>
