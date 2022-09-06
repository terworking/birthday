import { birthdayTargetAsKey } from '~utils'

// the user at your frontend can `subscribe` to targets listed here
export const targets: BirthdayTarget[] = [
  // Example borns at 1st January 2000
  // The subscriber will get notified at 1st January 2020, 1st January 2021, etc about Example's birthday
  { name: 'Example', date: 1, month: 1, year: 2000 },
]

export const targetsWithKey = targets.map((target) => ({
  key: birthdayTargetAsKey(target),
  ...target,
}))
