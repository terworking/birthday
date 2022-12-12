import { atom } from 'nanostores'

export interface TTimeZone {
  name: string
  abbreviation: string
  offset: string
}

export interface BirthdayContainerData {
  data: BackendListResponse
  timeZones: TTimeZone[]
}

export const data = atom<BackendListResponse>({})
export const timeZones = atom<TTimeZone[]>([])
