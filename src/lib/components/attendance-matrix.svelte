<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatEventDay } from '$lib/format-date';
	import InstrumentIcon from '$lib/components/instrument-icon.svelte';
	import StatusBadge, {
		STATUS_COLOR_CLASSES,
		type PresenceStatus
	} from '$lib/components/status-badge.svelte';
	import { INSTRUMENTS, isInstrument } from '$lib/instruments';
	import { weightFor, type Coverage } from '$lib/specimen';
	import { cn } from '$lib/utils';

	let {
		events,
		users,
		responses,
		coverage,
		editable
	}: {
		events: {
			id: string;
			name: string;
			date: string;
			startTime?: string | null;
			endTime?: string | null;
			location?: string | null;
		}[];
		users: { id: string; name: string; instrument?: string | null }[];
		responses: { eventId: string; userId: string; status: string }[];
		coverage: Record<string, Coverage>;
		editable: boolean;
	} = $props();

	// Grouped by family (INSTRUMENTS is ordered that way), then by name, so each
	// section's colour chips line up into one block. No instrument goes last.
	const rank = (instrument?: string | null) =>
		isInstrument(instrument) ? INSTRUMENTS.indexOf(instrument) : INSTRUMENTS.length;
	const sortedUsers = $derived(
		[...users].sort(
			(a, b) => rank(a.instrument) - rank(b.instrument) || a.name.localeCompare(b.name, 'fr')
		)
	);

	function statusFor(eventId: string, userId: string): NonNullable<PresenceStatus> {
		const match = responses.find((r) => r.eventId === eventId && r.userId === userId);
		return (match?.status as PresenceStatus) ?? 'none';
	}
</script>

{#snippet responseControl(eventId: string, userId: string)}
	{#if editable}
		{@const current = statusFor(eventId, userId)}
		<form method="POST" action="?/respond" use:enhance>
			<input type="hidden" name="eventId" value={eventId} />
			<input type="hidden" name="userId" value={userId} />
			<select
				name="status"
				onchange={(e) => e.currentTarget.form?.requestSubmit()}
				class={cn(
					'h-9 w-36 rounded-md border px-2 text-sm font-medium',
					STATUS_COLOR_CLASSES[current],
					current === 'none' ? 'border-input' : 'border-transparent'
				)}
			>
				{#if current === 'none'}
					<option value="none" disabled selected class={STATUS_COLOR_CLASSES.none}
						>Pas de réponse</option
					>
				{/if}
				<!-- No "reset to no response" option: setAttendanceResponse only accepts
				     oui/non/indecis — "no response" is row absence, not a settable value. -->
				<option value="oui" selected={current === 'oui'} class={STATUS_COLOR_CLASSES.oui}
					>Oui</option
				>
				<option value="non" selected={current === 'non'} class={STATUS_COLOR_CLASSES.non}
					>Non</option
				>
				<option
					value="indecis"
					selected={current === 'indecis'}
					class={STATUS_COLOR_CLASSES.indecis}>Indécis</option
				>
			</select>
		</form>
	{:else}
		<StatusBadge status={statusFor(eventId, userId)} />
	{/if}
{/snippet}

{#snippet dateNumeral(evt: { id: string; date: string }, size: string)}
	{@const day = formatEventDay(evt.date)}
	{@const c = coverage[evt.id]}
	<span
		class={cn('block leading-none tabular-nums', size)}
		style="font-weight: {weightFor(c.oui, c.members)}; font-variation-settings: 'wdth' 72"
	>
		{day.day}
	</span>
	<span class="mt-1 block text-xs font-normal whitespace-nowrap text-muted-foreground">
		{day.month} · {c.oui}/{c.members} oui
	</span>
{/snippet}

<!-- Desktop: full matrix on the specimen sheet — each column headed by its date
     numeral, weighted by how many musicians said oui. -->
<div class="hidden overflow-x-auto border-t border-foreground md:block">
	<table class="w-full min-w-max border-collapse text-sm">
		<thead>
			<tr>
				<th class="sticky left-0 z-10 border-b border-foreground bg-card p-3 text-left font-medium">
					Fanfaron
				</th>
				{#each events as evt (evt.id)}
					<th
						class="border-b border-foreground p-3 text-left align-bottom font-semibold whitespace-nowrap"
					>
						{@render dateNumeral(evt, 'text-4xl')}
						<span class="mt-2 block font-display font-bold">{evt.name}</span>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each sortedUsers as u (u.id)}
				<tr class="group hover:bg-secondary/40">
					<td
						class="sticky left-0 z-10 border-b border-border bg-card p-3 font-medium whitespace-nowrap group-hover:bg-secondary/40"
					>
						<span class="flex items-center gap-2">
							{#if isInstrument(u.instrument)}
								<InstrumentIcon instrument={u.instrument} class="h-5" tinted />
							{/if}
							{u.name}
						</span>
					</td>
					{#each events as evt (evt.id)}
						<td class="border-b border-border p-3">
							{@render responseControl(evt.id, u.id)}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<!-- Mobile: one specimen column per event (same numeral as the Calendrier list),
     laid out as a horizontally-scrolling, snap-aligned row so members stay listed
     vertically within a card while events themselves are swiped through sideways. -->
<div class="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 md:hidden">
	{#each events as evt (evt.id)}
		<div class="w-[85%] max-w-sm shrink-0 snap-center border-t border-foreground pt-3">
			{@render dateNumeral(evt, 'text-6xl')}
			<p class="mt-2 font-display text-lg leading-tight font-extrabold">{evt.name}</p>

			<div class="mt-3 flex flex-col divide-y divide-border border-t border-foreground">
				{#each sortedUsers as u (u.id)}
					<div class="flex items-center justify-between gap-3 py-2">
						<p class="flex min-w-0 items-center gap-2 truncate text-sm font-medium">
							{#if isInstrument(u.instrument)}
								<InstrumentIcon instrument={u.instrument} class="h-4" tinted />
							{/if}
							{u.name}
						</p>
						{@render responseControl(evt.id, u.id)}
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
