import { json, type RequestHandler } from '@sveltejs/kit';
import { items } from '$lib/server/target.json';

export const GET = (() => json({ items })) satisfies RequestHandler;
