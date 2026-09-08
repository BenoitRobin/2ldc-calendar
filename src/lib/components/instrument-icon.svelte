<script lang="ts">
	import type { Instrument } from '$lib/instruments';
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
		saxophone,
		trompette,
		sousaphone,
		tuba,
		trombone
	};

	let { instrument, class: className = '' }: { instrument: Instrument; class?: string } = $props();
</script>

<span class={className} aria-hidden="true">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- ICONS only holds our own build-time ?raw SVG imports, never user input -->
	{@html ICONS[instrument]}
</span>

<style>
	span {
		display: inline-flex;
		align-items: center;
	}

	span :global(svg) {
		height: 100%;
		width: auto;
		display: block;
	}
</style>
