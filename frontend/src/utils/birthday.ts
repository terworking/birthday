export const calculateNextBirthdayDate = (
  target?: BirthdayTarget,
  now = new Date()
) => {
  if (target === undefined) return new Date(1971, 0, 1)

  const next = new Date(now.getFullYear(), target.month - 1, target.date)
  if (next.valueOf() <= now.valueOf()) next.setFullYear(next.getFullYear() + 1)

  return next
}
