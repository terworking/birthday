import { atom, computed, map } from 'nanostores'
import { calculateNextBirthdayDate } from '~utils/birthday'
import { data } from './data'
import { subscriptions } from './subscription'
import utcToZonedTime from 'date-fns-tz/esm/utcToZonedTime'

interface State {
  disableInteraction: boolean
  selected: string
  timeZone: string
}

export const state = map<State>({
  disableInteraction: false,
  selected: '',
  timeZone: '',
})

export const now = atom(new Date())
const updateNow = (timeZone: string) =>
  now.set(utcToZonedTime(new Date(), timeZone))
let nowTimer: NodeJS.Timer
state.subscribe((state, key) => {
  if (key === 'timeZone') {
    updateNow(state.timeZone)
    clearInterval(nowTimer)
    nowTimer = setInterval(() => updateNow(state.timeZone), 1000)
  }
})
state.setKey('timeZone', Intl.DateTimeFormat().resolvedOptions().timeZone)

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
