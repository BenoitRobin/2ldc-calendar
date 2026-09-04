<script lang="ts">
	import { enhance } from '$app/forms';
	import StatusBadge, { type PresenceStatus } from '$lib/components/status-badge.svelte';

	let {
		events,
		users,
		responses,
		editable
	}: {
		events: { id: string; name: string; date: string }[];
		users: { id: string; name: string }[];
		responses: { eventId: string; userId: string; status: string }[];
		editable: boolean;
	} = $props();

	function statusFor(eventId: string, userId: string): PresenceStatus {
		const match = responses.find((r) => r.eventId === eventId && r.userId === userId);
		return (match?.status as PresenceStatus) ?? 'none';
	}
</script>

<div class="overflow-x-auto">
	<table class="w-full min-w-max border-collapse text-sm">
		<thead>
			<tr>
				<th class="border-b p-2 text-left font-medium">Membre</th>
				{#each events as evt (evt.id)}
					<th class="border-b p-2 text-left font-medium whitespace-nowrap">
						{evt.name}
						<span class="block text-xs font-normal text-muted-foreground">{evt.date}</span>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each users as u (u.id)}
				<tr>
					<td class="border-b p-2 whitespace-nowrap">{u.name}</td>
					{#each events as evt (evt.id)}
						<td class="border-b p-2">
							{#if editable}
								{@const current = statusFor(evt.id, u.id)}
								<form method="POST" action="?/respond" use:enhance>
									<input type="hidden" name="eventId" value={evt.id} />
									<input type="hidden" name="userId" value={u.id} />
									<select
										name="status"
										onchange={(e) => e.currentTarget.form?.requestSubmit()}
										class="h-9 rounded-md border border-input px-2 text-sm"
									>
										{#if current === 'none'}
											<option value="none" disabled selected>Pas de réponse</option>
										{/if}
										<!-- No "reset to no response" option: setAttendanceResponse only accepts
										     oui/non/indecis — "no response" is row absence, not a settable value. -->
										<option value="oui" selected={current === 'oui'}>Oui</option>
										<option value="non" selected={current === 'non'}>Non</option>
										<option value="indecis" selected={current === 'indecis'}>Indécis</option>
									</select>
								</form>
							{:else}
								<StatusBadge status={statusFor(evt.id, u.id)} />
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
