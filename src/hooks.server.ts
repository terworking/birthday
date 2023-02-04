import type { Handle } from '@sveltejs/kit';
import { JWK } from '$env/static/private';
import { getPublicKeyFromJwk } from 'cf-webpush';
import { dev } from '$app/environment';

export const handle = (async ({ event, resolve }) => {
	event.locals.jwk = JSON.parse(JWK);

	if (dev) {
		const { fallBackPlatformToMiniFlareInDev } = await import('$lib/server/miniflare-env');
		event.platform = await fallBackPlatformToMiniFlareInDev(event.platform);
	}

	return resolve(event);
}) satisfies Handle;
