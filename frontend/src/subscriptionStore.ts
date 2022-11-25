import { persistentAtom } from '@nanostores/persistent'
import { action } from 'nanostores'

export const subscriptions = persistentAtom<string[]>('subscriptions', [], {
  decode: JSON.parse,
  encode: JSON.stringify,
})

export const addSubscription = action(
  subscriptions,
  'add',
  (store, value: string) => store.set([...new Set([...store.get(), value])])
)

export const removeSubscription = action(
  subscriptions,
  'remove',
  (store, value: string) => {
    const tmp = new Set(store.get())
    tmp.delete(value)
    store.set([...tmp])
  }
)
