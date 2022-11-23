import { timeZonesNames } from '@vvo/tzdb'
import { ThrowableRouter, status, json } from 'itty-router-extras'

import { items } from '~target.json'
import { handle as triggerScheduled } from '~handler/scheduled'
import type { ExtendedRequest } from '~types'
import { birthdayTargetAsKey, NestedPartial } from '~utils'
import { getPublicKeyFromJwk } from 'cloudflare-webpush-request-builder'

const itemsWithKey = items.map((value) => ({
  key: birthdayTargetAsKey(value),
  ...value,
}))
const keyedItems = Object.fromEntries(
  itemsWithKey.map(({ key, ...rest }) => [key, rest] as const)
)

const processPostRequest = async (request: ExtendedRequest) => {
  const body = await request
    .json<NestedPartial<SubscriptionPayload>>()
    .catch(() => undefined)

  // a helper function that returns bad request response
  const bad = (text: string) => status(400, text)

  if (body == undefined) {
    return bad('MISSING REQUEST BODY')
  } else if (body.target === undefined) {
    return bad('MISSING SUBSCRIPTION TARGET')
  } else if (body.timeZone === undefined) {
    return bad('MISSING TIMEZONE')
  } else if (
    body.subscription?.endpoint === undefined ||
    body.subscription.keys?.auth === undefined ||
    body.subscription.keys.p256dh === undefined
  ) {
    return bad('MISSING PUSH SUBSCRIPTION')
  }

  // safe to type cast here as we already check them before
  const { target, subscription, timeZone } = body as SubscriptionPayload

  if (keyedItems[target] !== undefined) {
    return bad('INVALID SUBSCRIPTION TARGET')
  } else if (!timeZonesNames.includes(timeZone)) {
    return bad('INVALID TIMEZONE')
  }

  request.subscription = {
    body: subscription,
    key: `${target}:${subscription.keys.auth}`,
    timeZone,
  }

  return
}

export const handle: ExportedHandlerFetchHandler<Environment> = async (
  request,
  environment
) => {
  const router = ThrowableRouter()

  router.get!('/trigger', async (_, environment) => {
    await triggerScheduled(undefined, environment)

    return status(200, 'OK')
  })
  router.get!('/key', (_, environment: Environment) => {
    const jwk: JsonWebKey = JSON.parse(environment.SERVER_JWK)
    const publicKey = getPublicKeyFromJwk(jwk)

    return status(200, { publicKey })
  })
  router.get!('/list', () => (items.length > 0 ? json(itemsWithKey) : null))

  router.post!(
    '/subscribe',
    processPostRequest,
    async (request: ExtendedRequest) => {
      const { subscription } = request

      await environment.BIRTHDAY_SUBSCRIPTIONS.put(
        subscription.key,
        JSON.stringify(subscription.body),
        {
          metadata: { timeZone: subscription.timeZone },
        }
      )

      return status(201, 'SUBSCRIBED')
    }
  )
  router.post!(
    '/unsubscribe',
    processPostRequest,
    async (request: ExtendedRequest) => {
      await environment.BIRTHDAY_SUBSCRIPTIONS.delete(request.subscription.key)

      return status(200, 'UNSUBSCRIBED')
    }
  )

  router.all('*', () => new Response('NOT FOUND', { status: 404 }))

  return router.handle(request, environment).then((response: Response) => {
    response.headers.append('Access-Control-Request-Method', 'GET, POST')
    response.headers.append('Access-Control-Allow-Origin', '*')

    return response
  })
}
