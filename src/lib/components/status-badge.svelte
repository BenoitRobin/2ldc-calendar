<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const statusBadgeVariants = tv({
		base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
		variants: {
			status: {
				oui: 'bg-status-oui text-status-oui-foreground',
				non: 'bg-status-non text-status-non-foreground',
				indecis: 'bg-status-indecis text-status-indecis-foreground',
				none: 'bg-status-none text-status-none-foreground'
			}
		},
		defaultVariants: {
			status: 'none'
		}
	});

	export type PresenceStatus = VariantProps<typeof statusBadgeVariants>['status'];

	const STATUS_LABELS: Record<NonNullable<PresenceStatus>, string> = {
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
