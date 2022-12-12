import { atom } from 'nanostores'

export type RawBirthdayData = [string, string, number, number, number]
export type RawTTimeZone = [string, string, string]
export type BirthdayContainerData = [RawBirthdayData[], RawTTimeZone[]]

export interface TTimeZone {
  name: string
  abbreviation: string
  offset: string
}

export const data = atom<BackendListResponse>({})
export const timeZones = atom<TTimeZone[]>([])
