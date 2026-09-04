<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const buttonVariants = tv({
		base: 'focus-visible:ring-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-bold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/85',
				destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline:
					'border-primary/40 text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent border-2 bg-transparent',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
				ghost: 'hover:bg-secondary',
				link: 'text-accent underline-offset-4 hover:underline'
			},
			size: {
				default: 'h-10 min-h-11 px-4 py-2',
				sm: 'h-9 min-h-11 rounded-md px-3',
				lg: 'h-11 min-h-11 rounded-md px-8',
				icon: 'size-11'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
	export type ButtonSize = VariantProps<typeof buttonVariants>['size'];
</script>

<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	let {
		class: className,
		variant = 'default',
		size = 'default',
		ref = $bindable(null),
		type = 'button',
		children,
		...restProps
	}: HTMLButtonAttributes & {
		variant?: ButtonVariant;
		size?: ButtonSize;
		ref?: HTMLButtonElement | null;
	} = $props();
</script>

<button
	bind:this={ref}
	class={cn(buttonVariants({ variant, size }), className)}
	{type}
	{...restProps}
>
	{@render children?.()}
</button>
