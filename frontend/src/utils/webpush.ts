import { fetchBirthdayNotificationServer } from './backend'

const registerServiceWorker = () => navigator.serviceWorker.register('/sw.js')

const fetchPublicKey = () =>
  fetchBirthdayNotificationServer('key')
    .then((response) => response.json())
    .then((json: { publicKey: string }) => json.publicKey)

const getApplicationServerKey = async () => {
  const localKey = localStorage.getItem('application-server-key')
  if (localKey == null) {
    const key = await fetchPublicKey()
    localStorage.setItem('application-server-key', key)
    return key
  } else {
    return localKey
  }
}

// https://web.dev/push-notifications-subscribing-a-user/#subscribe-a-user-with-pushmanager
export const generateSubscriptionPayload = async (
  key: string,
  timeZone: string
) => {
  const publicKey = await getApplicationServerKey()
  const serviceWorker = await registerServiceWorker()
  const pushSubscription = await serviceWorker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: publicKey,
  })

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
