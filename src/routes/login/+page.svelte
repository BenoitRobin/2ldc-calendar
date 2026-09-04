<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import logo from '$lib/assets/logo-2ldc-white.png';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head><title>Connexion — 2LDC Calendar</title></svelte:head>

<div class="flex min-h-dvh flex-col items-center justify-center gap-6 p-4">
	<img src={logo} alt="2LDC" class="w-full max-w-xs rounded-lg" />

	<Card class="w-full max-w-sm border-t-2 border-primary/70">
		<CardContent class="pt-6">
			<h1 class="mb-5 text-sm font-semibold">Connexion</h1>
			<form method="POST" use:enhance class="flex flex-col gap-4">
				<div class="flex flex-col gap-1.5">
					<label for="name" class="text-sm font-medium">Prénom</label>
					<input
						id="name"
						name="name"
						type="text"
						required
						autocomplete="username"
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
					<p class="text-sm text-danger" role="alert">{form.error}</p>
				{/if}
				<Button type="submit" class="w-full">Se connecter</Button>
			</form>
		</CardContent>
	</Card>
</div>
