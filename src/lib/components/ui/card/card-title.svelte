<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		ref?: HTMLDivElement | null;
	} = $props();
</script>

<div
	bind:this={ref}
	class={cn('font-display text-xl leading-tight font-extrabold tracking-tight', className)}
	{...restProps}
>
	{@render children?.()}
</div>
