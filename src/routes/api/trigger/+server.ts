import { isAfter as dateIsAfter, isBefore as dateIsBefore, addHours, subHours } from 'date-fns';
import { targets } from '$lib/server/target';
import type { RequestHandler } from '@sveltejs/kit';
import { asOrdinalNumber, birthdayTargetAsKey } from '$lib/util';
import { utcToZonedTime } from 'date-fns-tz';
import { buildRequest } from 'cf-webpush';
import type { NotificationPayload, PushSubscription } from '$lib/types';

interface BirthdaySubscriptionMetadata {
	timeZone: string;
}

export const GET = (async ({ locals: { jwk }, platform }) => {
	const KV = platform?.env?.BIRTHDAY_STORE!;
	try {
		const now = new Date();

		const birthdayMatches = targets.filter(({ date, month }) => {
			const targetDate = new Date(now.getFullYear(), month - 1, date);
			return (
				dateIsAfter(subHours(targetDate, 12), now) && dateIsBefore(addHours(targetDate, 14), now)
			);
		});

		const targetKeys = birthdayMatches.map((match) => birthdayTargetAsKey(match));
		const subscriptionKeys = await Promise.all(
			targetKeys.map((target) =>
				Promise.all([
					KV.list({ prefix: 'all' }),
					KV.list({
						prefix: target
					})
				]).then((result) =>
					result.map(({ keys }) => ({
						target,
						keys: keys.map(({ name }) => name)
					}))
				)
			)
		).then((it) => it.flat());
		const subscriptions = await Promise.all(
			subscriptionKeys.map(({ target, keys }) =>
				Promise.all(
					keys.map((key) =>
						KV.getWithMetadata<PushSubscription, BirthdaySubscriptionMetadata>(key, 'json').then(
							({ value, metadata }) => ({
								key,
								target,
								value: value!,
								metadata: metadata!
							})
						)
					)
				)
			)
		).then((it) =>
			it.flat().filter(({ metadata }) => {
				const localDate = utcToZonedTime(now, metadata.timeZone);
				return localDate.getHours() === 0;
			})
		);

		const requests = await Promise.all(
			birthdayMatches.map(async (match) => {
				const ageOrdinal = asOrdinalNumber(now.getFullYear() - match.year);
				const notificationPayload = {
					body: `Happy ${ageOrdinal} Birthday ${match.name}!?`,
					title: 'Terworking birthday'
				} as NotificationPayload;

				return Promise.all(
					subscriptions
						.filter(({ target }) => target === birthdayTargetAsKey(match))
						.map(async ({ key, value: subscription }) => {
							const ttl = 20 * 60 * 60;
							const host = new URL(subscription.endpoint).origin;
							const request = await buildRequest(
								{
									jwk,
									jwt: {
										aud: host,
										exp: Math.floor(Date.now() / 1000) + ttl,
										sub: '99479536+aynh@users.noreply.github.com'
									},
									ttl,
									payload: JSON.stringify(notificationPayload)
								},
								subscription
							);

							return { key, request };
						})
				);
			})
		).then((it) => it.flat());

		await Promise.allSettled(
			requests.map(async ({ key, request }) => {
				const response = await fetch(request);
				const text = await response.text();
				if (response.status === 404 || response.status === 410) {
					await KV.delete(key);
				} else if (response.status < 200 || response.status > 299) {
					throw new Error(`UNEXPECTED HTTP STATUS ${response.status}: ${text}`);
				}
			})
		);
	} catch (err) {
		try {
			await KV.put('___error', JSON.stringify(err, Object.getOwnPropertyNames(err)));
		} catch (err) {
			console.error(JSON.stringify(err, Object.getOwnPropertyNames(err)));
		}
	}

	return new Response(undefined, { status: 204 });
}) satisfies RequestHandler;
