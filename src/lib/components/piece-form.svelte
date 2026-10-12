<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import InstrumentIcon from '$lib/components/instrument-icon.svelte';
	import { INSTRUMENTS, INSTRUMENT_LABELS, type Instrument } from '$lib/instruments';
	import Plus from '@lucide/svelte/icons/plus';
	import X from '@lucide/svelte/icons/x';

	// Mirrors MAX_PARTS in $lib/server/validate-piece (server code can't be imported here).
	const MAX_PARTS = 3;

	let {
		values,
		error,
		submitLabel = 'Enregistrer',
		action
	}: {
		values?: { title?: string } & Partial<Record<Instrument, string[]>>;
		error?: string;
		submitLabel?: string;
		action?: string;
	} = $props();

	// Each field gets a stable id so removing partie 1 doesn't make Svelte reuse its
	// input (and its typed value) for the field that slides up into its place.
	type Field = { id: number; url: string };
	let nextId = 0;
	const field = (url = ''): Field => ({ id: nextId++, url });

	// Initial values only: after a failed submit the inputs keep what was typed.
	let fields = $state(
		Object.fromEntries(
			INSTRUMENTS.map((i) => [
				i,
				values?.[i]?.length ? values[i].map((url) => field(url)) : [field()]
			])
		) as Record<Instrument, Field[]>
	);
</script>

<form method="POST" {action} use:enhance class="flex flex-col gap-4">
	<div class="flex flex-col gap-1.5">
		<label for="title" class="text-sm font-medium">Titre</label>
		<input
			id="title"
			name="title"
			type="text"
			required
			value={values?.title ?? ''}
			class="h-11 rounded-md border border-input px-3 text-sm"
		/>
	</div>

	<fieldset class="flex flex-col gap-3 border-t border-border pt-4">
		<legend class="float-left mb-1 w-full text-sm font-medium">Liens Google Drive</legend>
		<p class="text-sm text-muted-foreground">
			Un PDF par partie, partagé en «&nbsp;Tous les utilisateurs disposant du lien&nbsp;». Laisse
			vide s'il n'y a pas encore de partie.
		</p>
		{#each INSTRUMENTS as instrument (instrument)}
			{@const parts = fields[instrument]}
			<div class="flex flex-col gap-1.5">
				<label for="part-{instrument}-0" class="flex items-center gap-2 text-sm font-medium">
					<InstrumentIcon {instrument} class="h-4 shrink-0" />
					{INSTRUMENT_LABELS[instrument]}
				</label>
				{#each parts as part, i (part.id)}
					<div class="flex items-center gap-2">
						{#if parts.length > 1}
							<label for="part-{instrument}-{i}" class="w-16 shrink-0 text-sm text-muted-foreground"
								>Partie {i + 1}</label
							>
						{/if}
						<input
							id="part-{instrument}-{i}"
							name={instrument}
							type="url"
							inputmode="url"
							placeholder="https://drive.google.com/…"
							bind:value={part.url}
							class="h-11 min-w-0 flex-1 rounded-md border border-input px-3 text-sm placeholder:text-muted-foreground"
						/>
						{#if parts.length > 1}
							<button
								type="button"
								onclick={() => parts.splice(i, 1)}
								aria-label="Retirer la partie {i + 1} {INSTRUMENT_LABELS[instrument].toLowerCase()}"
								class="flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
							>
								<X class="size-4" aria-hidden="true" />
							</button>
						{/if}
					</div>
				{/each}
				{#if parts.length < MAX_PARTS}
					<button
						type="button"
						onclick={() => parts.push(field())}
						class="flex min-h-11 items-center gap-1.5 self-start text-sm text-muted-foreground transition-colors hover:text-foreground"
					>
						<Plus class="size-4" aria-hidden="true" />
						Ajouter une partie<span class="sr-only">
							{INSTRUMENT_LABELS[instrument].toLowerCase()}</span
						>
					</button>
				{/if}
			</div>
		{/each}
	</fieldset>

	{#if error}
		<p class="text-sm text-danger" role="alert">{error}</p>
	{/if}
	<Button type="submit">{submitLabel}</Button>
</form>
