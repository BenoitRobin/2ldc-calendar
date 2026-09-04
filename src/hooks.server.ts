import { error, redirect, type Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';

// Routes reachable without a session. Everything else requires one (specs/user-auth:
// "Unauthenticated user requests a protected route").
const PUBLIC_PATH_PREFIXES = ['/login', '/reset-password', '/api/auth'];

function isPublicPath(pathname: string) {
	return PUBLIC_PATH_PREFIXES.some(
		(prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
	);
}

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	const { pathname } = event.url;

	if (!event.locals.user && !isPublicPath(pathname)) {
		redirect(303, '/login');
	}

	// Checked before the route's own load/actions run, per specs/user-auth's
	// server-side role-gated routing requirement — never rely on hidden admin UI alone.
	if (pathname.startsWith('/admin') && event.locals.user?.role !== 'admin') {
		error(403, 'Accès réservé aux administrateurs.');
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = handleBetterAuth;
