import { env } from '$env/dynamic/private';
import { createDbClient } from './client';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export const db = createDbClient(env.DATABASE_URL, env.TURSO_AUTH_TOKEN || undefined);
