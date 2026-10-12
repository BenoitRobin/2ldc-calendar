<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { buttonVariants } from '$lib/components/ui/button';
	import StatusBadge, { type PresenceStatus } from '$lib/components/status-badge.svelte';
	import SectionCoverage from '$lib/components/section-coverage.svelte';
	import { formatEventDay } from '$lib/format-date';
	import { percent, weightFor } from '$lib/specimen';
	import { cn } from '$lib/utils';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let day = $derived(formatEventDay(data.event.date));

	// Optimistic update (specs/event-attendance): reflect the new status immediately,
	// then roll back to the last server-confirmed value if the save fails. Synced from
	// `data` via $effect (not initialized directly) so navigating between different
	// event pages re-syncs this instead of keeping stale state.
	let displayStatus = $state<PresenceStatus>('none');
	let confirmedStatus = $state<PresenceStatus>('none');
	let saveFailed = $state(false);
	// Once a response is recorded, only an admin can change it (from Vue d'ensemble)
	// — locked as soon as the server has confirmed a non-"none" status, not on the
	// optimistic displayStatus, so a still-saving first click isn't locked prematurely.
	let locked = $derived(confirmedStatus !== 'none');

	$effect(() => {
		displayStatus = data.myStatus as PresenceStatus;
		confirmedStatus = data.myStatus as PresenceStatus;
		saveFailed = false;
		// Landing on the new event: clear the exit animation, whether we arrived via
		// the animated slide (below) or a plain link/back-button navigation.
		slideDirection = null;
	});

	function respondWith(status: PresenceStatus) {
		return () => {
			displayStatus = status;
			saveFailed = false;
			return async ({ result }: { result: { type: string } }) => {
				if (result.type === 'success') {
					confirmedStatus = status;
				} else {
					displayStatus = confirmedStatus;
					saveFailed = true;
				}
			};
		};
	}

	const CHOICES: { status: PresenceStatus; label: string }[] = [
		{ status: 'oui', label: 'Oui' },
		{ status: 'non', label: 'Non' },
		{ status: 'indecis', label: 'Indécis' }
	];

	// Exit animation: slide the card out before actually navigating, so both swipe
	// (mobile) and clicking a preview card (desktop) get the same effect. The card
	// is a sibling of "Retour au calendrier", never a transformed ancestor of it, so
	// that button never moves. Cleared by the $effect above once the new event lands.
	let slideDirection = $state<'left' | 'right' | null>(null);
	const SLIDE_OUT_MS = 180;

	function navigateToEvent(eventId: string, direction: 'left' | 'right') {
		slideDirection = direction;
		setTimeout(() => {
			goto(resolve('/(app)/calendar/[eventId]', { eventId }));
		}, SLIDE_OUT_MS);
	}

	// Desktop preview-card links: animate like swipe instead of navigating instantly,
	// but only for a plain left-click — a modifier click (open in new tab, etc.) or
	// non-primary button falls through to the link's default behavior.
	function handlePreviewClick(e: MouseEvent, eventId: string, direction: 'left' | 'right') {
		if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		e.preventDefault();
		navigateToEvent(eventId, direction);
	}

	// Swipe navigation (mobile, replaces the prev/next arrows there — desktop keeps
	// the visible preview cards instead). Requires a mostly-horizontal, sufficiently
	// long gesture so page scrolling and simple taps don't trigger a navigation.
	let touchStartX = 0;
	let touchStartY = 0;

	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
	}

	function handleTouchEnd(e: TouchEvent) {
		const touch = e.changedTouches[0];
		const deltaX = touch.clientX - touchStartX;
		const deltaY = touch.clientY - touchStartY;
		if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY) * 1.5) return;

		if (deltaX < 0 && data.nextEvent) navigateToEvent(data.nextEvent.id, 'left');
		else if (deltaX > 0 && data.prevEvent) navigateToEvent(data.prevEvent.id, 'right');
	}
</script>

<svelte:head><title>{data.event.name} — 2LDC Calendar</title></svelte:head>

<div class="p-4">
	<a
		href={resolve('/(app)/calendar')}
		class="mb-6 -ml-1 inline-flex min-h-11 items-center gap-1.5 px-1 text-sm text-muted-foreground hover:text-foreground"
	>
		<ArrowLeft class="size-4" aria-hidden="true" />
		Retour au calendrier
	</a>

	<div class="mx-auto flex max-w-lg items-start gap-6 md:max-w-3xl">
		{#if data.prevEvent}
			{@const prev = data.prevEvent}
			{@const prevDay = formatEventDay(prev.date)}
			<a
				href={resolve('/(app)/calendar/[eventId]', { eventId: prev.id })}
				onclick={(e) => handlePreviewClick(e, prev.id, 'right')}
				class="hidden w-40 shrink-0 items-start gap-2 border-t border-foreground pt-3 text-left hover:underline md:flex"
			>
				<ChevronLeft class="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
				<div class="min-w-0">
					<p class="text-xs text-muted-foreground">{prevDay.day} {prevDay.month}</p>
					<p class="line-clamp-2 text-sm font-semibold">{prev.name}</p>
				</div>
			</a>
		{:else}
			<span class="hidden w-40 shrink-0 md:block" aria-hidden="true"></span>
		{/if}

		<!-- The touch handlers are a supplementary swipe shortcut, not this div's only
		     way to navigate — its content (heading, form buttons) stays keyboard/click
		     accessible on its own, so no interactive role belongs here. -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class={cn(
				'min-w-0 flex-1 border-t border-foreground transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none',
				slideDirection === 'left' && '-translate-x-8 opacity-0',
				slideDirection === 'right' && 'translate-x-8 opacity-0'
			)}
			ontouchstart={handleTouchStart}
			ontouchend={handleTouchEnd}
		>
			<div class="pt-3">
				<p
					class="flex items-baseline justify-between text-xs tracking-wider text-muted-foreground uppercase"
				>
					<span>{day.weekday} {day.month}</span>
					<span class="tabular-nums">{data.coverage.oui} / {data.coverage.members} viennent</span>
				</p>
				<p
					class="mt-1 text-[9rem] leading-[0.8] tracking-[-0.04em] tabular-nums md:text-[11rem]"
					style="font-weight: {weightFor(
						data.coverage.oui,
						data.coverage.members
					)}; font-variation-settings: 'wdth' 72"
				>
					{day.day}
				</p>
				<div class="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
					<div class="relative h-px flex-1 bg-border">
						<div
							class="absolute top-[-1px] left-0 h-[3px] bg-foreground"
							style="width: {percent(data.coverage.oui, data.coverage.members)}%"
						></div>
					</div>
					<span class="tabular-nums"
						>{percent(data.coverage.oui, data.coverage.members)} % de oui</span
					>
				</div>
				<h1
					class="mt-5 font-display text-3xl leading-none font-extrabold"
					style="font-variation-settings: 'wdth' 85"
				>
					{data.event.name}
				</h1>
				<p class="mt-1.5 text-sm text-muted-foreground">
					{[
						data.event.startTime && data.event.endTime
							? `${data.event.startTime}–${data.event.endTime}`
							: data.event.startTime,
						data.event.location
					]
						.filter(Boolean)
						.join(' · ')}
				</p>
				{#if data.event.description}
					<p class="mt-3 line-clamp-3 text-sm">{data.event.description}</p>
				{/if}
			</div>

			<div class="mt-6 border-t border-border pt-4">
				<p class="mb-2 text-sm font-medium">Votre présence</p>
				<div class="grid grid-cols-3 gap-2">
					{#each CHOICES as choice (choice.status)}
						{@const active = displayStatus === choice.status}
						<form method="POST" action="?/respond" use:enhance={respondWith(choice.status)}>
							<input type="hidden" name="status" value={choice.status} />
							<button
								type="submit"
								disabled={locked}
								class={cn(
									buttonVariants({ variant: active ? 'default' : 'outline', size: 'sm' }),
									'w-full px-1',
									active && `bg-status-${choice.status} text-status-${choice.status}-foreground`
								)}
							>
								{choice.label}
							</button>
						</form>
					{/each}
				</div>
				{#if displayStatus === 'none'}
					<p class="mt-2 text-sm text-muted-foreground">
						<StatusBadge status="none" /> — réponds vite!.
					</p>
				{:else if locked}
					<p class="mt-2 text-sm text-muted-foreground">Trop tard! seul Dieu peut le modifier.</p>
				{/if}
				{#if saveFailed}
					<p class="mt-2 text-sm text-danger" role="alert">Échec de l'enregistrement, réessaie.</p>
				{/if}
			</div>
			<SectionCoverage sections={data.coverage.sections} class="mt-6" />
		</div>

		{#if data.nextEvent}
			{@const next = data.nextEvent}
			{@const nextDay = formatEventDay(next.date)}
			<a
				href={resolve('/(app)/calendar/[eventId]', { eventId: next.id })}
				onclick={(e) => handlePreviewClick(e, next.id, 'left')}
				class="hidden w-40 shrink-0 items-start justify-between gap-2 border-t border-foreground pt-3 text-right hover:underline md:flex"
			>
				<div class="min-w-0">
					<p class="text-xs text-muted-foreground">{nextDay.day} {nextDay.month}</p>
					<p class="line-clamp-2 text-sm font-semibold">{next.name}</p>
				</div>
				<ChevronRight class="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
			</a>
		{:else}
			<span class="hidden w-40 shrink-0 md:block" aria-hidden="true"></span>
		{/if}
	</div>

	{#if data.prevEvent || data.nextEvent}
		<div class="mt-3 flex items-center justify-center gap-3 md:hidden">
			{#if data.prevEvent}
				{@const prev = data.prevEvent}
				<a
					href={resolve('/(app)/calendar/[eventId]', { eventId: prev.id })}
					onclick={(e) => handlePreviewClick(e, prev.id, 'right')}
					aria-label="Date précédente : {prev.name}"
					class="flex size-11 items-center justify-center"
				>
					<span class="size-1.5 rounded-full bg-muted-foreground/50" aria-hidden="true"></span>
				</a>
			{/if}
			<span class="size-2 rounded-full bg-foreground" aria-hidden="true"></span>
			{#if data.nextEvent}
				{@const next = data.nextEvent}
				<a
					href={resolve('/(app)/calendar/[eventId]', { eventId: next.id })}
					onclick={(e) => handlePreviewClick(e, next.id, 'left')}
					aria-label="Date suivante : {next.name}"
					class="flex size-11 items-center justify-center"
				>
					<span class="size-1.5 rounded-full bg-muted-foreground/50" aria-hidden="true"></span>
				</a>
			{/if}
			<span class="sr-only">Balayez pour changer de date.</span>
		</div>
	{/if}
</div>
