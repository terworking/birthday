export const calculateNextBirthdayDate = (
  target?: BirthdayData,
  now = new Date()
) => {
  if (target === undefined) return new Date(1971, 0, 1)

  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  const currentDate = now.getDate()

  const { month, date } = target
  const birthdayIsThisYear =
    currentMonth < month || (currentMonth === month && currentDate < date)

  return new Date(
    birthdayIsThisYear ? currentYear : currentYear + 1,
    month - 1,
    date
  )
}
