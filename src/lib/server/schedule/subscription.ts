import type { BirthdayTarget, PushSubscription } from '$lib/types';
import { birthdayTargetAsKey } from '$lib/util';
import type { KVNamespace } from '@cloudflare/workers-types';
import { utcToZonedTime } from 'date-fns-tz';

export interface Subscription {
	key: string;
	value: PushSubscription;
}

export interface SubscriptionMetadata {
	timeZone: string;
}

export const getSubscriptions = async (
	KV: KVNamespace,
	targets: BirthdayTarget[],
	{ now = new Date() } = {},
): Promise<Record<string, Subscription[]>> => {
	const targetKeys = targets.map(birthdayTargetAsKey);

	// target keys mapped with their subscription keys
	const subscriptionKeysMap = Object.fromEntries(
		await Promise.all(
			targetKeys.map(async (prefix) => {
				const all = await KV.list({ prefix: 'all' });
				const target = await KV.list({ prefix });

				return [prefix, [...all.keys, ...target.keys].map(({ name }) => name)] as const;
			}),
		),
	);

	// target keys mapped with their subscription
	const subscriptionMap = {} as Record<string, Subscription[]>;
	for (const key of targetKeys) {
		subscriptionMap[key] = [];
		for (const subscriptionKey of subscriptionKeysMap[key]) {
			const { value, metadata } = await KV.getWithMetadata<PushSubscription, SubscriptionMetadata>(
				subscriptionKey,
				'json',
			);

			if (value != null && metadata?.timeZone !== undefined) {
				const localSubscriptionDate = utcToZonedTime(now, metadata.timeZone);
				if (localSubscriptionDate.getHours() === 0) {
					subscriptionMap[key].push({ key: subscriptionKey, value });
				}
			}
		}
	}

	return subscriptionMap;
};
