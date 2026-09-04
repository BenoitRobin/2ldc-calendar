<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head><title>Modifier le membre — 2LDC Calendar</title></svelte:head>

<Card class="mx-auto max-w-lg">
	<CardHeader>
		<CardTitle>Modifier le membre</CardTitle>
	</CardHeader>
	<CardContent>
		<form method="POST" action="?/update" use:enhance class="flex flex-col gap-4">
			<div class="flex flex-col gap-1.5">
				<label for="name" class="text-sm font-medium">Nom</label>
				<input
					id="name"
					name="name"
					type="text"
					required
					value={data.member.name}
					class="h-11 rounded-md border border-input px-3 text-sm"
				/>
			</div>
			<div class="flex flex-col gap-1.5">
				<label for="email" class="text-sm font-medium">Email</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					value={data.member.email}
					class="h-11 rounded-md border border-input px-3 text-sm"
				/>
			</div>
			<div class="flex flex-col gap-1.5">
				<label for="role" class="text-sm font-medium">Rôle</label>
				<select id="role" name="role" class="h-11 rounded-md border border-input px-3 text-sm">
					<option value="standard" selected={data.member.role !== 'admin'}>Standard</option>
					<option value="admin" selected={data.member.role === 'admin'}>Administrateur</option>
				</select>
			</div>
			{#if form?.error}
				<p class="text-sm text-danger" role="alert">{form.error}</p>
			{/if}
			<Button type="submit" class="w-full">Enregistrer</Button>
		</form>
	</CardContent>
</Card>
