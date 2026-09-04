import { fail } from '@sveltejs/kit';
import { asc, eq } from 'drizzle-orm';
import { isAPIError } from 'better-auth/api';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const members = await db
		.select({ id: user.id, name: user.name, email: user.email, role: user.role })
		.from(user)
		.orderBy(asc(user.name));

	return { members };
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const userId = formData.get('userId');

		if (typeof userId !== 'string' || !userId) {
			return fail(400, { error: 'Membre invalide.' });
		}

		// Auto-lockout guard (PRD phase 8): never let the last admin be deleted.
		const [target] = await db.select({ role: user.role }).from(user).where(eq(user.id, userId));
		if (!target) {
			return fail(404, { error: 'Membre introuvable.' });
		}
		if (target.role === 'admin') {
			const admins = await db.select({ id: user.id }).from(user).where(eq(user.role, 'admin'));
			if (admins.length <= 1) {
				return fail(400, {
					error: 'Impossible de supprimer ce compte : ce compte est le seul administrateur.'
				});
			}
		}

		try {
			// headers required: removeUser checks the caller's session/permissions
			// itself (better-auth's adminMiddleware), and also rejects self-deletion.
			await auth.api.removeUser({ body: { userId }, headers: request.headers });
		} catch (error) {
			if (isAPIError(error)) {
				if (error.body?.code === 'YOU_CANNOT_REMOVE_YOURSELF') {
					return fail(400, { error: 'Vous ne pouvez pas supprimer votre propre compte.' });
				}
				return fail(400, { error: 'Impossible de supprimer ce compte.' });
			}
			// event.createdBy has no ON DELETE clause (drizzle default NO ACTION):
			// deleting a member who created events fails at the DB level instead of
			// silently orphaning or cascading away those events.
			if (error instanceof Error && error.message.includes('FOREIGN KEY constraint failed')) {
				return fail(400, {
					error: 'Impossible de supprimer ce membre : il a créé des évènements existants.'
				});
			}
			throw error;
		}
	}
};
