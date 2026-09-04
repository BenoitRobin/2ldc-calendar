<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import X from '@lucide/svelte/icons/x';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head><title>Nouveau membre — 2LDC Calendar</title></svelte:head>

<Card class="mx-auto max-w-lg">
	<CardHeader class="flex-row items-center justify-between">
		<CardTitle>Nouveau membre</CardTitle>
		<a
			href={resolve('/admin/team')}
			aria-label="Fermer"
			class="flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
		>
			<X class="size-4" aria-hidden="true" />
		</a>
	</CardHeader>
	<CardContent>
		<form method="POST" use:enhance class="flex flex-col gap-4">
			<div class="flex flex-col gap-1.5">
				<label for="name" class="text-sm font-medium">Prénom</label>
				<input
					id="name"
					name="name"
					type="text"
					required
					class="h-11 rounded-md border border-input px-3 text-sm"
				/>
				<p class="text-xs text-muted-foreground">
					Utilisé pour se connecter — doit être unique dans l'équipe.
				</p>
			</div>
			<div class="flex flex-col gap-1.5">
				<label for="email" class="text-sm font-medium">Email</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					class="h-11 rounded-md border border-input px-3 text-sm"
				/>
			</div>
			<div class="flex flex-col gap-1.5">
				<label for="password" class="text-sm font-medium">Mot de passe</label>
				<input
					id="password"
					name="password"
					type="text"
					required
					minlength="8"
					class="h-11 rounded-md border border-input px-3 text-sm"
				/>
				<p class="text-xs text-muted-foreground">À transmettre au membre — 8 caractères minimum.</p>
			</div>
			<div class="flex flex-col gap-1.5">
				<label for="role" class="text-sm font-medium">Rôle</label>
				<select id="role" name="role" class="h-11 rounded-md border border-input px-3 text-sm">
					<option value="standard" selected>Standard</option>
					<option value="admin">Administrateur</option>
				</select>
			</div>
			{#if form?.error}
				<p class="text-sm text-danger" role="alert">{form.error}</p>
			{/if}
			<Button type="submit" class="w-full">Ajouter</Button>
		</form>
	</CardContent>
</Card>
