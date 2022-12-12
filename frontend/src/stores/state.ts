import { atom, computed, map } from 'nanostores'
import { calculateNextBirthdayDate } from '~utils/birthday'
import { data } from './data'
import { subscriptions } from './subscription'
import utcToZonedTime from 'date-fns-tz/esm/utcToZonedTime'

interface State {
  selected: string
  timeZone: string
}

export const disableInteraction = atom(false)
export const state = map<State>({
  selected: '',
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
})

export const now = atom(new Date())
const updateNow = () =>
  now.set(utcToZonedTime(new Date(), state.get().timeZone))
let nowTimer: NodeJS.Timer
state.subscribe((_, key) => {
  if (key === 'timeZone') {
    updateNow()
    clearInterval(nowTimer)
    nowTimer = setInterval(updateNow, 1000)
  }
})

export const sortedByDistanceData = computed([data, now], (data, now) =>
  Object.entries(data).sort(
    ([_, a], [__, b]) =>
      calculateNextBirthdayDate(a, now).valueOf() -
      calculateNextBirthdayDate(b, now).valueOf()
  )
)
state.setKey('selected', sortedByDistanceData.get().at(0)?.[0] ?? '')

export const subscribed = computed(
  [subscriptions, state],
  (subscriptions, { selected }) => subscriptions.has(selected)
)
