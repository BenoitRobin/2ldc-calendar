<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { buttonVariants } from '$lib/components/ui/button';
	import {
		AlertDialog,
		AlertDialogContent,
		AlertDialogHeader,
		AlertDialogFooter,
		AlertDialogTitle,
		AlertDialogDescription,
		AlertDialogAction,
		AlertDialogCancel
	} from '$lib/components/ui/alert-dialog';
	import X from '@lucide/svelte/icons/x';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let deletingMember = $state<{ id: string; name: string } | null>(null);
</script>

<svelte:head><title>Équipe — 2LDC Calendar</title></svelte:head>

<div class="flex items-center justify-between">
	<h1 class="font-display text-2xl font-extrabold">Équipe</h1>
	<a href={resolve('/admin/team/new')} class={buttonVariants()}>Nouveau membre</a>
</div>

<div class="mt-4 flex flex-col gap-3">
	{#each data.members as member (member.id)}
		<div class="rounded-lg border border-border bg-card">
			<div class="flex flex-wrap items-center gap-3 p-4">
				<div class="min-w-0 flex-1">
					<p class="font-display text-lg leading-snug font-extrabold">{member.name}</p>
					<p class="mt-0.5 text-sm text-muted-foreground">{member.email}</p>
				</div>
				<span class="rounded-sm border border-border px-2 py-1 text-xs text-muted-foreground">
					{member.role === 'admin' ? 'Administrateur' : 'Standard'}
				</span>
			</div>
			<div
				class="flex items-center justify-end gap-2 border-t border-dashed border-border px-4 py-3"
			>
				<a
					href={resolve('/admin/team/[userId]/edit', { userId: member.id })}
					class={buttonVariants({ variant: 'outline', size: 'sm' })}>Modifier</a
				>
				<button
					type="button"
					onclick={() => (deletingMember = { id: member.id, name: member.name })}
					aria-label="Supprimer {member.name}"
					class="flex size-9 shrink-0 items-center justify-center rounded-md border border-destructive/60 text-destructive transition-colors hover:bg-destructive/10"
				>
					<X class="size-4" aria-hidden="true" />
				</button>
			</div>
		</div>
	{:else}
		<p class="py-6 text-sm text-muted-foreground">Aucun membre pour le moment.</p>
	{/each}
</div>

<AlertDialog
	open={!!deletingMember}
	onOpenChange={(open) => {
		if (!open) deletingMember = null;
	}}
>
	<AlertDialogContent>
		<AlertDialogHeader>
			<AlertDialogTitle>Supprimer {deletingMember?.name} ?</AlertDialogTitle>
			<AlertDialogDescription>
				Cette action est définitive : le compte de {deletingMember?.name} et toutes ses réponses de présence
				seront supprimés. Impossible d'annuler après confirmation.
			</AlertDialogDescription>
		</AlertDialogHeader>
		{#if form?.error}
			<p class="text-sm text-danger" role="alert">{form.error}</p>
		{/if}
		<AlertDialogFooter>
			<AlertDialogCancel onclick={() => (deletingMember = null)}>Annuler</AlertDialogCancel>
			<form
				method="POST"
				action="?/delete"
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'success') {
							deletingMember = null;
						}
						await update();
					};
				}}
			>
				<input type="hidden" name="userId" value={deletingMember?.id ?? ''} />
				<AlertDialogAction type="submit">Supprimer définitivement</AlertDialogAction>
			</form>
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>
