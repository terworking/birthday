import { atom, computed, map } from 'nanostores'
import { calculateNextBirthdayDate } from '~utils/birthday'
import { data } from './data'

interface State {
  selected: string
  timeZone: string
}

export const state = map<State>({
  selected: '',
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
})

export const sortedByDistanceData = computed(
  [data, state],
  (data, { timeZone }) =>
    Object.entries(data).sort(
      ([_, a], [__, b]) =>
        calculateNextBirthdayDate(a, timeZone).valueOf() -
        calculateNextBirthdayDate(b, timeZone).valueOf()
    )
)
state.setKey('selected', sortedByDistanceData.get()[0]![0])

export const disableInteraction = atom(false)
