/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
/** @type {ServiceWorkerGlobalScope} */
var sw = self;

sw.addEventListener('push', (event) => {
	/** @type {NotificationPayload} */
	const { body, title } = event.data.json();

	event.waitUntil(sw.registration.showNotification(title, { body }));
});
