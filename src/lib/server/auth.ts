import { env } from '$env/dynamic/private';
import { betterAuth } from 'better-auth/minimal';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { createAuthOptions } from './auth-options';
import { db } from './db';

const options = createAuthOptions({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	db
});

export const auth = betterAuth({
	...options,
	plugins: [
		...(options.plugins ?? []),
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	]
});
