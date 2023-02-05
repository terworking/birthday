import type { NotificationPayload } from '$lib/types';
import { asOrdinalNumber } from '$lib/util';
import { buildRequest } from 'cf-webpush';
import { keyedTargets } from '../target';
import type { Subscription } from './subscription';

export interface WebpushRequest {
	key: string;
	request: Request;
}

export const buildRequests = async (
	subscriptionMap: Record<string, Subscription[]>,
	jwk: JsonWebKey,
	{ now = new Date() } = {}
): Promise<WebpushRequest[]> => {
	const requests = [] as WebpushRequest[];
	for (const key in subscriptionMap) {
		const match = keyedTargets[key];
		const ageOrdinal = asOrdinalNumber(now.getFullYear() - match.year);
		const payload = JSON.stringify({
			body: `Happy ${ageOrdinal} Birthday ${match.name}!?`,
			title: 'Terworking birthday'
		} as NotificationPayload);

		const ttl = 20 * 60 * 60; // 20 hours
		for (const { value: subscription, key: subscriptionKey } of subscriptionMap[key]) {
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
					payload
				},
				subscription
			);

			requests.push({ key: subscriptionKey, request });
		}
	}

	return requests;
};
