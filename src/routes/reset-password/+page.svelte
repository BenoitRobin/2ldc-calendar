<script lang="ts">
	import { page } from '$app/state';
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let token = $derived(page.url.searchParams.get('token') ?? '');
</script>

<svelte:head><title>Choisir un mot de passe — 2LDC Calendar</title></svelte:head>

<div class="flex min-h-dvh items-center justify-center p-4">
	<Card class="w-full max-w-sm">
		<CardHeader>
			<CardTitle>Choisissez votre mot de passe</CardTitle>
		</CardHeader>
		<CardContent>
			<form method="POST" use:enhance class="flex flex-col gap-4">
				<input type="hidden" name="token" value={token} />
				<div class="flex flex-col gap-1.5">
					<label for="password" class="text-sm font-medium">Nouveau mot de passe</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						minlength="8"
						autocomplete="new-password"
						class="h-11 rounded-md border border-input px-3 text-sm"
					/>
				</div>
				{#if form?.error}
					<p class="text-sm text-destructive" role="alert">{form.error}</p>
				{/if}
				<Button type="submit" class="w-full">Valider</Button>
			</form>
		</CardContent>
	</Card>
</div>
