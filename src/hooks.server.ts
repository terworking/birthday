import type { Handle } from '@sveltejs/kit';
import { APP_JWK } from '$env/static/private';
import { dev } from '$app/environment';

export const handle = (async ({ event, resolve }) => {
	event.locals.jwk = JSON.parse(APP_JWK);

	if (dev) {
		const { fallBackPlatformToMiniFlareInDev } = await import('$lib/server/miniflare-env');
		event.platform = await fallBackPlatformToMiniFlareInDev(event.platform);
	}

	return resolve(event);
}) satisfies Handle;
