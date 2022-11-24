import utcToZonedTime from 'date-fns-tz/esm/utcToZonedTime'

export const calculateNextBirthdayDate = (
  target?: BirthdayTarget,
  timeZone?: string,
  now = new Date()
) => {
  if (target === undefined) return new Date(1971, 0, 1)

  const now_ = timeZone !== undefined ? utcToZonedTime(now, timeZone) : now
  const next = new Date(now_.getFullYear(), target.month - 1, target.date)
  if (next.valueOf() <= now_.valueOf()) next.setFullYear(next.getFullYear() + 1)

  return next
}
