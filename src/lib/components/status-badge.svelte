<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	// Single source of truth for status -> color-token classes, reused by the pill
	// variant below and by any other status-colored control (e.g. the editable
	// select in attendance-matrix.svelte) so the mapping only lives in one place.
	export const STATUS_COLOR_CLASSES = {
		oui: 'bg-status-oui text-status-oui-foreground',
		non: 'bg-status-non text-status-non-foreground',
		indecis: 'bg-status-indecis text-status-indecis-foreground',
		none: 'bg-status-none text-status-none-foreground'
	} as const;

	export const statusBadgeVariants = tv({
		base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
		variants: {
			status: STATUS_COLOR_CLASSES
		},
		defaultVariants: {
			status: 'none'
		}
	});

	export type PresenceStatus = VariantProps<typeof statusBadgeVariants>['status'];

	export const STATUS_LABELS: Record<NonNullable<PresenceStatus>, string> = {
		oui: 'Oui',
		non: 'Non',
		indecis: 'Indécis',
		none: 'Pas de réponse'
	};
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	let {
		status,
		class: className,
		...restProps
	}: HTMLAttributes<HTMLSpanElement> & { status: PresenceStatus } = $props();
</script>

<span class={cn(statusBadgeVariants({ status }), className)} {...restProps}>
	{STATUS_LABELS[status ?? 'none']}
</span>
