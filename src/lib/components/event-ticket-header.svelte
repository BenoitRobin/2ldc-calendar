<script lang="ts">
	import { formatEventDay } from '$lib/format-date';

	let {
		evt
	}: {
		evt: {
			name: string;
			date: string;
			startTime?: string | null;
			endTime?: string | null;
			location?: string | null;
		};
	} = $props();

	let day = $derived(formatEventDay(evt.date));
</script>

<div class="w-14 shrink-0 text-center">
	<p class="font-display text-2xl leading-none font-extrabold text-accent">{day.day}</p>
	<p class="mt-1 text-xs text-muted-foreground">{day.month}</p>
</div>
<div class="min-w-0 flex-1">
	<p class="font-display text-lg leading-snug font-extrabold">{evt.name}</p>
	{#if evt.startTime || evt.location}
		<p class="mt-0.5 text-sm text-muted-foreground">
			{[
				evt.startTime && evt.endTime ? `${evt.startTime}–${evt.endTime}` : evt.startTime,
				evt.location
			]
				.filter(Boolean)
				.join(', ')}
		</p>
	{/if}
</div>
