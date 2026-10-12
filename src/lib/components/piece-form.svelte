<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import InstrumentIcon from '$lib/components/instrument-icon.svelte';
	import { INSTRUMENTS, INSTRUMENT_LABELS, type Instrument } from '$lib/instruments';

	let {
		values,
		error,
		submitLabel = 'Enregistrer',
		action
	}: {
		values?: { title?: string } & Partial<Record<Instrument, string>>;
		error?: string;
		submitLabel?: string;
		action?: string;
	} = $props();
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
			Un PDF par instrument, partagé en «&nbsp;Tous les utilisateurs disposant du lien&nbsp;».
			Laisse vide s'il n'y a pas encore de partie.
		</p>
		{#each INSTRUMENTS as instrument (instrument)}
			<div class="flex flex-col gap-1.5">
				<label for="part-{instrument}" class="flex items-center gap-2 text-sm font-medium">
					<InstrumentIcon {instrument} class="h-4 shrink-0" />
					{INSTRUMENT_LABELS[instrument]}
				</label>
				<input
					id="part-{instrument}"
					name={instrument}
					type="url"
					inputmode="url"
					placeholder="https://drive.google.com/…"
					value={values?.[instrument] ?? ''}
					class="h-11 min-w-0 rounded-md border border-input px-3 text-sm placeholder:text-muted-foreground"
				/>
			</div>
		{/each}
	</fieldset>

	{#if error}
		<p class="text-sm text-danger" role="alert">{error}</p>
	{/if}
	<Button type="submit">{submitLabel}</Button>
</form>
