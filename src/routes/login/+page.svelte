<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head><title>Connexion — 2LDC Calendar</title></svelte:head>

<div class="flex min-h-dvh items-center justify-center p-4">
	<Card class="w-full max-w-sm">
		<CardHeader>
			<CardTitle>Connexion</CardTitle>
		</CardHeader>
		<CardContent>
			<form method="POST" use:enhance class="flex flex-col gap-4">
				<div class="flex flex-col gap-1.5">
					<label for="email" class="text-sm font-medium">Email</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						autocomplete="email"
						class="h-11 rounded-md border border-input px-3 text-sm"
					/>
				</div>
				<div class="flex flex-col gap-1.5">
					<label for="password" class="text-sm font-medium">Mot de passe</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						autocomplete="current-password"
						class="h-11 rounded-md border border-input px-3 text-sm"
					/>
				</div>
				{#if form?.error}
					<p class="text-sm text-destructive" role="alert">{form.error}</p>
				{/if}
				<Button type="submit" class="w-full">Se connecter</Button>
			</form>
		</CardContent>
	</Card>
</div>
