import rss from '@astrojs/rss'
import type { APIRoute } from 'astro'
import { subYears } from 'date-fns'

import { fetchBirthdayNotificationServer } from '~utils/backend'
import { calculateNextBirthdayDate } from '~utils/birthday'

export const get: APIRoute = async (context) => {
  try {
    const items = await fetchBirthdayNotificationServer('list')
      .then((response) => response.json())
      .then((values: BirthdayData[]) =>
        values
          .map((value) => {
            const pastBirthday = subYears(calculateNextBirthdayDate(value), 1)
            const age = pastBirthday.getFullYear() - value.year

            return { age, name: value.name, pastBirthday }
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
        title: `${name} birthday`,
        description: `${name} turns ${age} today`,
      })),
      stylesheet: '/rss/pretty-feed-v3.xsl',
    })
  } catch (e) {
    return new Response(JSON.stringify(e), { status: 500 })
  }
}
