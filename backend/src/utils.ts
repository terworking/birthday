export const birthdayTargetAsKey = ({
  name,
  date,
  month,
  year,
}: BirthdayTarget) => {
  const escapedName = name.replace(/\W/g, '_').toLowerCase()
  const birthDate = new Date(year, month - 1, date)

  return `${escapedName}:${birthDate.valueOf()}`
}

export const dateWithTimeZone = (date: Date, timeZone: string) =>
  new Date(date.toLocaleDateString('en-US', { timeZone }))

export const isValidTimeZone = (timeZone: string) => {
  try {
    new Intl.DateTimeFormat(undefined, { timeZone })
    return true
  } catch {
    return false
  }
}

export const asOrdinalNumber = (n: number) => {
  const lastDigit = n % 10
  switch (lastDigit) {
    case 1:
      return `${n}st`

    case 2:
      return `${n}nd`

    case 3:
      return `${n}rd`

    default:
      return `${n}th`
  }
}

export type NestedPartial<T> = { [P in keyof T]?: NestedPartial<T[P]> }
