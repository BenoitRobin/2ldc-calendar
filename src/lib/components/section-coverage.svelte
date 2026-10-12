<script lang="ts">
	import { INSTRUMENT_LABELS, type Instrument } from '$lib/instruments';
	import { weightFor, type SectionCoverage } from '$lib/specimen';
	import { cn } from '$lib/utils';

	let { sections, class: className }: { sections: SectionCoverage[]; class?: string } = $props();

	const SHORT: Record<Instrument, string> = {
		batterie: 'Batt.',
		saxophone: 'Sax',
		trompette: 'Trp',
		sousaphone: 'Sousa.',
		tuba: 'Tuba',
		trombone: 'Trb'
	};
</script>

<dl class={cn('grid grid-cols-6 gap-1 border-t border-foreground pt-3 text-center', className)}>
	{#each sections as s (s.instrument)}
		<div class="flex flex-col-reverse items-center">
			<dt class="text-xs tracking-wide text-muted-foreground uppercase">
				<abbr title={INSTRUMENT_LABELS[s.instrument]} class="no-underline"
					>{SHORT[s.instrument]}</abbr
				>
			</dt>
			<dd
				class={cn(
					'text-3xl leading-none tabular-nums',
					s.oui === 0 && s.members > 0 && 'text-accent'
				)}
				style="font-weight: {weightFor(s.oui, s.members)}; font-variation-settings: 'wdth' 80"
			>
				{s.oui}<span class="sr-only"> oui sur {s.members}</span>
			</dd>
		</div>
	{/each}
</dl>
