import type { TimeZone } from '@vvo/tzdb'
import { atom } from 'nanostores'

export interface BirthdayContainerData {
  data: BackendListResponse
  timeZones: TimeZone[]
}

export const data = atom<BackendListResponse>({})
export const timeZones = atom<TimeZone[]>([])
