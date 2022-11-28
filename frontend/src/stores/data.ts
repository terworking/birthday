import { action, atom } from 'nanostores'

export const data = atom<BackendListResponse>({})

export const initializeData = action(
  data,
  'initialize',
  (store, value: BackendListResponse) => store.set(value)
)
