export const getSubscriptions = () => {
  const subscriptions: string[] = JSON.parse(
    localStorage.getItem('subscriptions') ?? '[]'
  )

  return new Set(
    Array.isArray(subscriptions) &&
    subscriptions.every((value) => typeof value === 'string')
      ? subscriptions
      : []
  )
}

export const updateSubscriptions = (subscriptions: string[]) =>
  localStorage.setItem('subscriptions', JSON.stringify(subscriptions))

export const addSubscription = (k: string) => {
  updateSubscriptions([...getSubscriptions().add(k)])
}

export const removeSubscription = (k: string) => {
  const subscriptions = getSubscriptions()
  if (subscriptions.delete(k)) {
    updateSubscriptions([...subscriptions])
  }
}

export const hasSubscribedTo = (k: string) => getSubscriptions().has(k)
