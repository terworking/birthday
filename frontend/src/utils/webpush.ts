import { fetchBirthdayNotificationServer } from './backend'

export const registerServiceWorker = () =>
  navigator.serviceWorker.register('/sw.js')

export const fetchPublicKey = () =>
  fetchBirthdayNotificationServer('key')
    .then((response) => response.json())
    .then((json: { publicKey: string }) => json.publicKey)

// https://web.dev/push-notifications-subscribing-a-user/#subscribe-a-user-with-pushmanager
export const generateSubscriptionPayload = async (key: string) => {
  const localPublicKey = localStorage.getItem('application-server-key')

  const publicKey =
    localPublicKey != null ? localPublicKey : await fetchPublicKey()

  const serviceWorker = await registerServiceWorker()
  const pushSubscription = await serviceWorker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: publicKey,
  })

  if (localPublicKey == null)
    localStorage.setItem('application-server-key', publicKey)

  const { timeZone } = Intl.DateTimeFormat().resolvedOptions()
  return {
    subscription: pushSubscription,
    target: key,
    timeZone,
  } as SubscriptionPayload
}

// https://web.dev/push-notifications-subscribing-a-user/#requesting-permission
export const askNotificationPermission = (): Promise<NotificationPermission> =>
  new Promise(function (resolve, reject) {
    const permissionResult = Notification.requestPermission(resolve)

    if (permissionResult) {
      permissionResult.then(resolve, reject)
    }
  })

export const checkWebpushCompability = (): void => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service worker is not supported in this browser.')
  } else if (!('PushManager' in window)) {
    throw new Error('Push notification is not supported in this browser.')
  }
}
