import { Miniflare, Log, LogLevel } from 'miniflare';

export const fallBackPlatformToMiniFlareInDev = async (platform?: App.Platform) => {
	if (platform !== undefined) return platform;

	const mf = new Miniflare({
		log: new Log(LogLevel.INFO),
		kvPersist: true,
		kvNamespaces: ['BIRTHDAY_STORE'],
		globalAsyncIO: true,
		globalTimers: true,
		globalRandom: true,

		script: `
		addEventListener("fetch", (event) => {
			event.waitUntil(Promise.resolve(event.request.url));
			event.respondWith(new Response(event.request.headers.get("X-Message")));
		});
		addEventListener("scheduled", (event) => {
			event.waitUntil(Promise.resolve(event.scheduledTime));
		});
		`
	});

	const env = await mf.getBindings();
	return { env } as App.Platform;
};
