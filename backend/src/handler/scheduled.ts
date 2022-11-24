import {
  isAfter as dateIsAfter,
  isBefore as dateIsBefore,
  addHours,
  subHours,
} from 'date-fns'
import utcToZonedTime from 'date-fns-tz/esm/utcToZonedTime'

import { items } from '~target.json'
import { birthdayTargetAsKey, asOrdinalNumber } from '~utils'
import { buildRequest } from 'cloudflare-webpush-request-builder'

export const handle = async (
  _: ScheduledController | undefined,
  environment: Environment
) => {
  try {
    const now = new Date()
    if (
      environment.FRONTEND_DEPLOY_HOOK !== undefined &&
      now.getHours() === 0
    ) {
      await fetch(environment.FRONTEND_DEPLOY_HOOK, { method: 'POST' })
    }

    const birthdayMatches = items.filter(({ date, month }) => {
      const targetDate = new Date(now.getFullYear(), month - 1, date)
      return (
        dateIsAfter(subHours(targetDate, 12), now) &&
        dateIsBefore(addHours(targetDate, 14), now)
      )
    })

    if (birthdayMatches.length === 0) return

    const targetKeys = birthdayMatches.map((match) =>
      birthdayTargetAsKey(match)
    )
    const subscriptionKeys = await Promise.all(
      targetKeys.map((target) =>
        environment.BIRTHDAY_SUBSCRIPTIONS.list({
          prefix: target,
        }).then(({ keys }) => ({ target, keys: keys.map(({ name }) => name) }))
      )
    )
    const subscriptions = await Promise.all(
      subscriptionKeys.map(({ target, keys }) =>
        Promise.all(
          keys.map((key) =>
            environment.BIRTHDAY_SUBSCRIPTIONS.getWithMetadata<
              PushSubscription,
              BirthdaySubscriptionMetadata
            >(key, 'json').then(({ value, metadata }) => ({
              key,
              target,
              value: value!,
              metadata: metadata!,
            }))
          )
        )
      )
    ).then((it) =>
      it.flat().filter(({ metadata }) => {
        const localDate = utcToZonedTime(now, metadata.timeZone)
        return localDate.getHours() === 0
      })
    )

    const jwk: JsonWebKey = JSON.parse(environment.SERVER_JWK)

    const requests = await Promise.all(
      birthdayMatches.map(async (match) => {
        const ageOrdinal = asOrdinalNumber(now.getFullYear() - match.year)
        const notificationPayload: NotificationPayload = {
          body: `Happy ${ageOrdinal} Birthday ${match.name}!?`,
          title: environment.NOTIFICATION_TITLE,
        }

        return Promise.all(
          subscriptions
            .filter(({ target }) => target === birthdayTargetAsKey(match))
            .map(async ({ key, value: subscription }) => {
              const ttl = 20 * 60 * 60
              const host = new URL(subscription.endpoint).origin
              const request = await buildRequest(
                {
                  jwk,
                  jwt: {
                    aud: host,
                    exp: Math.floor(Date.now() / 1000) + ttl,
                    sub: environment.SERVER_JWT_SUB,
                  },
                  ttl,
                  payload: JSON.stringify(notificationPayload),
                },
                subscription
              )

              return { key, request }
            })
        )
      })
    ).then((it) => it.flat())

    await Promise.allSettled(
      requests.map(async ({ key, request }) => {
        const response = await fetch(request)
        const text = await response.text()
        if (response.status === 404 || response.status === 410) {
          await environment.BIRTHDAY_SUBSCRIPTIONS.delete(key)
        } else if (response.status < 200 || response.status > 299) {
          throw new Error(`UNEXPECTED HTTP STATUS ${response.status}: ${text}`)
        }
      })
    )
  } catch (err) {
    try {
      await environment.BIRTHDAY_SUBSCRIPTIONS.put(
        '___error',
        JSON.stringify(err, Object.getOwnPropertyNames(err))
      )
    } catch (err) {
      console.error(JSON.stringify(err, Object.getOwnPropertyNames(err)))
    }
  }
}
