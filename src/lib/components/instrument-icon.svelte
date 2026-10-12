<script lang="ts">
	import { familyBg, type Instrument } from '$lib/instruments';
	import { cn } from '$lib/utils';
	import batterie from '$lib/assets/instruments/batterie.svg?raw';
	import saxophone from '$lib/assets/instruments/saxophone.svg?raw';
	import trompette from '$lib/assets/instruments/trompette.svg?raw';
	import sousaphone from '$lib/assets/instruments/sousaphone.svg?raw';
	import tuba from '$lib/assets/instruments/tuba.svg?raw';
	import trombone from '$lib/assets/instruments/trombone.svg?raw';

	// Imported `?raw` (inline markup, not an <img> src) so the `fill="currentColor"`
	// baked into each SVG (see src/lib/assets/instruments/) actually inherits the
	// surrounding text color — currentColor only resolves against the DOM it's part
	// of, never against an external image document.
	const ICONS: Record<Instrument, string> = {
		batterie,
		// The three saxes share one pictogram.
		sax_alto: saxophone,
		sax_tenor: saxophone,
		sax_baryton: saxophone,
		trompette,
		sousaphone,
		// Basse keeps the tuba pictogram.
		basse: tuba,
		trombone
	};

	let {
		instrument,
		class: className = '',
		tinted = false
	}: {
		instrument: Instrument;
		// `class` sizes the pictogram itself; `tinted` sets it on its family's pastel
		// chip, which adds padding around that size rather than shrinking the icon.
		class?: string;
		tinted?: boolean;
	} = $props();
</script>

{#snippet icon(cls: string)}
	<span class={cls} aria-hidden="true">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- ICONS only holds our own build-time ?raw SVG imports, never user input -->
		{@html ICONS[instrument]}
	</span>
{/snippet}

{#if tinted}
	<span class={cn('shrink-0 rounded-md p-1 text-foreground', familyBg(instrument))}>
		{@render icon(className)}
	</span>
{:else}
	{@render icon(className)}
{/if}

<style>
	span {
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	span :global(svg) {
		height: 100%;
		width: auto;
		display: block;
	}
</style>
