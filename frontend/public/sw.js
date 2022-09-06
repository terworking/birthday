/// <reference lib="webworker" />
/** @type {ServiceWorkerGlobalScope} */
var sw = self

var log = (...data) => console.log(`[service-worker] ${data}`)

sw.addEventListener('push', (event) => {
  /** @type {NotificationPayload} */
  const { body, title } = event.data.json()

  event.waitUntil(sw.registration.showNotification(title, { body }))
})

sw.addEventListener('activate', () => log('activated'))
