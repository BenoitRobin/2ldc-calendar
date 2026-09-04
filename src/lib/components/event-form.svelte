<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';

	let {
		values,
		error,
		submitLabel = 'Enregistrer',
		action
	}: {
		values?: {
			name?: string;
			date?: string;
			startTime?: string | null;
			endTime?: string | null;
			location?: string | null;
			description?: string | null;
		};
		error?: string;
		submitLabel?: string;
		action?: string;
	} = $props();
</script>

<form method="POST" {action} use:enhance class="flex flex-col gap-4">
	<div class="flex flex-col gap-1.5">
		<label for="name" class="text-sm font-medium">Nom</label>
		<input
			id="name"
			name="name"
			type="text"
			required
			value={values?.name ?? ''}
			class="h-11 rounded-md border border-input px-3 text-sm"
		/>
	</div>
	<div class="flex flex-col gap-1.5">
		<label for="date" class="text-sm font-medium">Date</label>
		<input
			id="date"
			name="date"
			type="date"
			required
			value={values?.date ?? ''}
			class="h-11 rounded-md border border-input px-3 text-sm"
		/>
	</div>
	<div class="flex gap-4">
		<div class="flex flex-1 flex-col gap-1.5">
			<label for="startTime" class="text-sm font-medium">Heure de début</label>
			<input
				id="startTime"
				name="startTime"
				type="time"
				value={values?.startTime ?? ''}
				class="h-11 rounded-md border border-input px-3 text-sm"
			/>
		</div>
		<div class="flex flex-1 flex-col gap-1.5">
			<label for="endTime" class="text-sm font-medium">Heure de fin</label>
			<input
				id="endTime"
				name="endTime"
				type="time"
				value={values?.endTime ?? ''}
				class="h-11 rounded-md border border-input px-3 text-sm"
			/>
		</div>
	</div>
	<div class="flex flex-col gap-1.5">
		<label for="location" class="text-sm font-medium">Lieu</label>
		<input
			id="location"
			name="location"
			type="text"
			value={values?.location ?? ''}
			class="h-11 rounded-md border border-input px-3 text-sm"
		/>
	</div>
	<div class="flex flex-col gap-1.5">
		<label for="description" class="text-sm font-medium">Description</label>
		<textarea
			id="description"
			name="description"
			rows="3"
			class="rounded-md border border-input px-3 py-2 text-sm"
			value={values?.description ?? ''}></textarea>
	</div>
	{#if error}
		<p class="text-sm text-danger" role="alert">{error}</p>
	{/if}
	<Button type="submit">{submitLabel}</Button>
</form>
