import rss from '@astrojs/rss'
import type { APIRoute } from 'astro'
import { subYears } from 'date-fns'

import { fetchBirthdayNotificationServer } from '~utils/backend'
import { calculateNextBirthdayDate } from '~utils/birthday'
import { asOrdinalNumber } from 'backend/src/utils'

export const get: APIRoute = async (context) => {
  const items = await fetchBirthdayNotificationServer('list')
    .then((response) => response.json())
    .then((values: BirthdayData[]) =>
      values
        .flatMap((value) => {
          const nextBirthday = calculateNextBirthdayDate(value)
          const nextAge = nextBirthday.getFullYear() - value.year
          return Array.from({ length: nextAge - 1 }, (_, n) => ({
            age: n + 1,
            name: value.name,
            pastBirthday: subYears(nextBirthday, nextAge - (n + 1)),
          }))
        })
        .sort(
          ({ pastBirthday: a }, { pastBirthday: b }) =>
            b.valueOf() - a.valueOf()
        )
    )

  const site = context.url.origin
  return rss({
    description: 'Past birthday history, sorted by recent',
    title: 'Birthday History',
    site,
    items: items.map(({ age, name, pastBirthday }) => ({
      link: site,
      pubDate: pastBirthday,
      title: `${name}'s ${asOrdinalNumber(age)} birthday`,
      description: `${name} turns ${age} today`,
    })),
    stylesheet: '/rss/pretty-feed-v3.xsl',
  })
}
