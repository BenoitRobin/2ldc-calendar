<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import StatusBadge from '$lib/components/status-badge.svelte';
	import SectionCoverage from '$lib/components/section-coverage.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import { formatEventDay } from '$lib/format-date';
	import { percent, weightFor } from '$lib/specimen';
	import { cn } from '$lib/utils';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let isAdmin = $derived(page.data.user?.role === 'admin');

	// The date that leads the page: the first one still waiting for this member's
	// answer, otherwise simply the next one.
	let featured = $derived(data.events.find((e) => e.myStatus === 'none') ?? data.events[0]);
	let rest = $derived(data.events.filter((e) => e !== featured));
</script>

<svelte:head><title>Calendrier — 2LDC Calendar</title></svelte:head>

<div class="p-4">
	<div class="mb-10 flex items-center justify-between md:mb-16">
		<h1 class="font-display text-2xl font-extrabold">Calendrier</h1>
		{#if isAdmin}
			<a href={resolve('/admin/events/new')} class={buttonVariants()}>Ajouter une date</a>
		{/if}
	</div>

	{#if featured}
		{@const f = featured}
		{@const day = formatEventDay(f.date)}
		{@const pending = f.myStatus === 'none'}
		<a
			href={resolve('/(app)/calendar/[eventId]', { eventId: f.id })}
			class="group block border-t border-foreground pt-3"
		>
			<span class="flex items-baseline justify-between text-xs tracking-wider uppercase">
				<span class={pending ? 'font-semibold text-accent' : 'text-muted-foreground'}>
					{pending ? 'À répondre' : 'Prochaine date'} · {day.weekday}
					{day.month}
				</span>
				<span class="text-muted-foreground tabular-nums">
					{f.coverage.oui} / {f.coverage.members} viennent
				</span>
			</span>

			<span
				class="mt-1 block text-[10rem] leading-[0.8] tracking-[-0.04em] tabular-nums md:text-[13rem]"
				style="font-weight: {weightFor(
					f.coverage.oui,
					f.coverage.members
				)}; font-variation-settings: 'wdth' 72"
			>
				{day.day}{#if pending}<span class="text-accent" aria-hidden="true">.</span>{/if}
			</span>

			<span class="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
				<span class="relative h-px flex-1 bg-border">
					<span
						class="absolute top-[-1px] left-0 h-[3px] bg-foreground"
						style="width: {percent(f.coverage.oui, f.coverage.members)}%"
					></span>
				</span>
				<span class="tabular-nums">{percent(f.coverage.oui, f.coverage.members)} % de oui</span>
			</span>

			<span
				class="mt-5 block font-display text-3xl leading-none font-extrabold group-hover:underline"
				style="font-variation-settings: 'wdth' 85"
			>
				{f.name}
			</span>
			{#if f.startTime || f.location}
				<span class="mt-1.5 block text-sm text-muted-foreground">
					{[f.startTime && f.endTime ? `${f.startTime}–${f.endTime}` : f.startTime, f.location]
						.filter(Boolean)
						.join(' · ')}
				</span>
			{/if}

			<span class="mt-5 block">
				{#if pending}
					<span class={cn(buttonVariants(), 'w-full md:w-auto')}>Répondre</span>
				{:else}
					<span class="flex items-center gap-2 text-sm">
						Ta réponse <StatusBadge status={f.myStatus} />
					</span>
				{/if}
			</span>
		</a>
		<SectionCoverage sections={f.coverage.sections} class="mt-6" />

		{#if rest.length > 0}
			<ul class="mt-10 border-t border-foreground">
				{#each rest as evt (evt.id)}
					{@const d = formatEventDay(evt.date)}
					<li class="border-b border-border">
						<a
							href={resolve('/(app)/calendar/[eventId]', { eventId: evt.id })}
							class="group grid grid-cols-[4rem_1fr_auto] items-center gap-3 py-3"
						>
							<span
								class="text-5xl leading-none tabular-nums"
								style="font-weight: {weightFor(
									evt.coverage.oui,
									evt.coverage.members
								)}; font-variation-settings: 'wdth' 72"
							>
								{d.day}
							</span>
							<span class="min-w-0">
								<span class="block font-bold group-hover:underline">{evt.name}</span>
								<span class="block text-sm text-muted-foreground">
									{d.weekday}
									{d.month}{evt.startTime ? ` · ${evt.startTime}` : ''} · {evt.coverage.oui}/{evt
										.coverage.members} oui
								</span>
							</span>
							{#if evt.myStatus === 'none'}
								<span class="text-xs font-semibold tracking-wider text-accent uppercase">
									À répondre
								</span>
							{:else}
								<StatusBadge status={evt.myStatus} />
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	{:else}
		<p class="border-t border-foreground py-6 text-sm text-muted-foreground">
			Aucune date pour le moment.
		</p>
	{/if}
</div>
