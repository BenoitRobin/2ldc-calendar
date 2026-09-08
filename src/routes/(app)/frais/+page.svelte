<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import Receipt from '@lucide/svelte/icons/receipt';

	// Not embedded via <iframe>: this form has a file-upload question (photos des
	// justificatifs), which requires signing into a Google account, and Google
	// refuses to render its own sign-in screens inside a frame — the embed gets
	// stuck on its opening card with no way to actually proceed. A plain link that
	// opens the real page works every time.
	const FORM_URL =
		'https://docs.google.com/forms/d/e/1FAIpQLSextxG5q4d9dhmRYgA08ezLZXZHlw_rbg2LCnG-mKOAezaQnQ/viewform';
</script>

<svelte:head><title>Frais — 2LDC Calendar</title></svelte:head>

<div class="p-4">
	<h1 class="mb-4 font-display text-2xl font-extrabold">Frais</h1>

	<div class="flex flex-col items-start gap-4 rounded-lg border border-border bg-card p-6">
		<Receipt class="size-8 text-accent" aria-hidden="true" />
		<div>
			<p class="font-display text-lg font-extrabold">Demande de remboursement</p>
			<p class="mt-1 text-sm text-muted-foreground">
				Frais ou indemnité kilométrique — le formulaire s'ouvre sur Google Forms et nécessite d'être
				connecté à un compte Google (upload des justificatifs).
			</p>
		</div>
		<a
			href={FORM_URL}
			target="_blank"
			rel="noopener noreferrer"
			class={buttonVariants({ class: 'gap-1.5' })}
		>
			<ExternalLink class="size-4 shrink-0" aria-hidden="true" />
			Ouvrir le formulaire
		</a>
	</div>
</div>
