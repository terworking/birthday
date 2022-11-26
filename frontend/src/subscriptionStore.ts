import { persistentAtom } from '@nanostores/persistent'
import { action } from 'nanostores'

export const subscriptions = persistentAtom<Set<string>>(
  'subscriptions',
  new Set([]),
  {
    decode: (v) => new Set(JSON.parse(v)),
    encode: (v) => JSON.stringify([...v]),
  }
)

export const addSubscription = action(
  subscriptions,
  'add',
  (store, value: string) => store.set(new Set([...store.get(), value]))
)

export const removeSubscription = action(
  subscriptions,
  'remove',
  (store, value: string) => {
    const tmp = store.get()
    tmp.delete(value)
    store.set(tmp)
  }
)
