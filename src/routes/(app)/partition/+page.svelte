<script lang="ts">
	import { resolve } from '$app/paths';
	import { buttonVariants } from '$lib/components/ui/button';
	import InstrumentIcon from '$lib/components/instrument-icon.svelte';
	import {
		INSTRUMENTS,
		INSTRUMENT_LABELS,
		familyBg,
		isInstrument,
		type Instrument
	} from '$lib/instruments';
	import { cn } from '$lib/utils';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import Search from '@lucide/svelte/icons/search';
	import X from '@lucide/svelte/icons/x';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Defaults to the member's own instrument: the page's whole point is "open MY part"
	// without being asked which one. The select only exists to stand in for someone else.
	// Initial value only; the member then picks freely.
	// svelte-ignore state_referenced_locally
	let shown = $state<Instrument | ''>(data.myInstrument ?? '');
	let query = $state('');

	// Accent- and case-insensitive, so "ete" finds "Été".
	const normalize = (s: string) =>
		s
			.normalize('NFD')
			.replace(/\p{Diacritic}/gu, '')
			.toLowerCase();

	let filtered = $derived(
		query.trim()
			? data.pieces.filter((p) => normalize(p.title).includes(normalize(query.trim())))
			: data.pieces
	);

	let isMine = $derived(shown !== '' && shown === data.myInstrument);
</script>

<svelte:head><title>Partition — 2LDC Calendar</title></svelte:head>

<div class="p-4">
	<div class="mb-10 flex items-center justify-between gap-4 md:mb-16">
		<h1 class="font-display text-2xl font-extrabold">Partition</h1>
		{#if data.isAdmin}
			<a href={resolve('/admin/partitions/new')} class={buttonVariants()}>Ajouter un morceau</a>
		{/if}
	</div>

	{#if data.pieces.length === 0}
		<p class="py-6 text-sm text-muted-foreground">Aucun morceau pour le moment.</p>
	{:else}
		<div class="mb-6 flex flex-col gap-3 md:flex-row md:items-end">
			<div class="relative flex-1">
				<label for="piece-search" class="sr-only">Rechercher un morceau</label>
				<Search
					class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
					aria-hidden="true"
				/>
				<input
					id="piece-search"
					type="search"
					bind:value={query}
					placeholder="Rechercher un morceau"
					autocomplete="off"
					class="h-11 w-full rounded-md border border-input bg-transparent pr-11 pl-9 text-sm placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none"
				/>
				{#if query}
					<button
						type="button"
						onclick={() => (query = '')}
						aria-label="Effacer la recherche"
						class="absolute top-0 right-0 flex size-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
					>
						<X class="size-4" aria-hidden="true" />
					</button>
				{/if}
			</div>
			<div class="flex items-center gap-2 md:w-64">
				<label for="shown-part" class="shrink-0 text-sm text-muted-foreground">Partie</label>
				<select
					id="shown-part"
					value={shown}
					onchange={(e) => {
						const v = e.currentTarget.value;
						shown = isInstrument(v) ? v : '';
					}}
					class="h-11 min-w-0 flex-1 rounded-md border border-input bg-card px-3 text-sm"
				>
					{#if !data.myInstrument}
						<option value="" disabled>Choisis un instrument</option>
					{/if}
					{#each INSTRUMENTS as instrument (instrument)}
						<option value={instrument}>
							{INSTRUMENT_LABELS[instrument]}{instrument === data.myInstrument
								? ' (la mienne)'
								: ''}
						</option>
					{/each}
				</select>
			</div>
		</div>

		<ul class="border-t border-foreground">
			{#each filtered as p (p.id)}
				{@const parts = shown ? (p.parts[shown] ?? []) : []}
				<li class="border-b border-border md:flex md:items-center">
					<div class="flex min-w-0 flex-1 items-center gap-4 py-4">
						<div class="flex w-14 shrink-0 justify-center">
							{#if shown}
								{#if parts.length}
									<InstrumentIcon instrument={shown} class="h-8" tinted />
								{:else}
									<InstrumentIcon instrument={shown} class="h-8 text-muted-foreground/40" />
								{/if}
							{/if}
						</div>
						<p class="min-w-0 flex-1 font-display text-lg leading-snug font-extrabold text-balance">
							{p.title}
						</p>
					</div>
					<div class="flex items-center gap-2 pb-4 md:py-4">
						{#if parts.length}
							{@const label = INSTRUMENT_LABELS[shown as Instrument].toLowerCase()}
							{#each parts as part (part.partNumber)}
								<!-- eslint-disable svelte/no-navigation-without-resolve -- external Google Drive link -->
								<a
									href={part.driveUrl}
									target="_blank"
									rel="noopener noreferrer"
									class={cn(
										buttonVariants({ variant: 'outline' }),
										'flex-1 gap-1.5 border-transparent md:flex-none',
										familyBg(shown as Instrument)
									)}
								>
									<ExternalLink class="size-4 shrink-0" aria-hidden="true" />
									<!-- Numbered whenever the number tells you something: several parts, or a
									     lone partie 2 whose partie 1 isn't uploaded yet. -->
									{#if parts.length > 1 || part.partNumber > 1}
										Partie {part.partNumber}
										<span class="sr-only">{label} — {p.title} (nouvel onglet)</span>
									{:else}
										{isMine ? 'Ma partie' : `Partie ${label}`}
										<span class="sr-only">— {p.title} (nouvel onglet)</span>
									{/if}
								</a>
								<!-- eslint-enable svelte/no-navigation-without-resolve -->
							{/each}
						{:else}
							<p
								class="flex min-h-11 flex-1 items-center text-sm text-muted-foreground md:flex-none"
							>
								{shown
									? `Pas encore de partie ${INSTRUMENT_LABELS[shown].toLowerCase()}`
									: 'Choisis un instrument'}
							</p>
						{/if}
						{#if data.isAdmin}
							<a
								href={resolve('/admin/partitions/[pieceId]/edit', { pieceId: p.id })}
								class={buttonVariants({ variant: 'outline', size: 'sm' })}
							>
								Modifier<span class="sr-only"> {p.title}</span>
							</a>
						{/if}
					</div>
				</li>
			{:else}
				<li class="flex flex-col items-start gap-3 py-6">
					<p class="text-sm text-muted-foreground">
						Aucun morceau pour «&nbsp;{query.trim()}&nbsp;».
					</p>
					<button
						type="button"
						onclick={() => (query = '')}
						class={buttonVariants({ variant: 'outline', size: 'sm' })}
					>
						Effacer la recherche
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
