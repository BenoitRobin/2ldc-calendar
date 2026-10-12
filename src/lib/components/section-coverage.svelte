<script lang="ts">
	import { INSTRUMENT_LABELS, type Instrument } from '$lib/instruments';
	import { weightFor, type SectionCoverage } from '$lib/specimen';
	import { cn } from '$lib/utils';

	let { sections, class: className }: { sections: SectionCoverage[]; class?: string } = $props();

	const SHORT: Record<Instrument, string> = {
		batterie: 'Batt.',
		sax_alto: 'Alto',
		sax_tenor: 'Tén.',
		sax_baryton: 'Bar.',
		trompette: 'Trp',
		sousaphone: 'Sousa.',
		basse: 'Basse',
		trombone: 'Trb'
	};
</script>

<dl class={cn('grid grid-cols-8 gap-1 border-t border-foreground pt-3 text-center', className)}>
	{#each sections as s (s.instrument)}
		<div class="flex flex-col-reverse items-center">
			<!-- Eight columns on a phone: smaller, untracked labels so SOUSA. and BASSE don't touch. -->
			<dt class="text-[0.625rem] text-muted-foreground uppercase md:text-xs md:tracking-wide">
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
