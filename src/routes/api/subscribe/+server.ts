import type { SubscriptionMetadata } from '$lib/server/schedule/subscription';
import { targetMap } from '$lib/server/target';
import type { SubscriptionPayload } from '$lib/types';
import { error, type RequestHandler } from '@sveltejs/kit';
import { timeZonesNames } from '@vvo/tzdb';

const parseBody = async (request: Request): Promise<SubscriptionPayload> => {
	const body = (await request.json().catch(() => undefined)) as SubscriptionPayload | undefined;

	if (body == undefined) {
		throw error(400, 'missing request body');
	} else if (body.target === undefined) {
		throw error(400, 'missing subscription target');
	} else if (body.timeZone === undefined) {
		throw error(400, 'missing time zone');
	} else if (
		body.subscription?.endpoint === undefined ||
		body.subscription.keys?.auth === undefined ||
		body.subscription.keys.p256dh === undefined
	) {
		throw error(400, 'missing push subscription');
	}

	const { target, timeZone } = body;

	if (target !== 'all' && !(target in targetMap)) {
		throw error(400, 'invalid target');
	} else if (!timeZonesNames.includes(timeZone)) {
		throw error(400, 'invalid time zone');
	}

	return body;
};

export const DELETE = (async ({ platform, request }) => {
	const { subscription, target } = await parseBody(request);

	const KV = platform?.env?.BIRTHDAY_STORE!;
	const key = `${target}:${subscription.keys!.auth}`;
	await KV.delete(key);

	return new Response(undefined, { status: 204 });
}) satisfies RequestHandler;

export const POST = (async ({ platform, request }) => {
	const { subscription, target, timeZone } = await parseBody(request);

	const KV = platform?.env?.BIRTHDAY_STORE!;
	const key = `${target}:${subscription.keys!.auth}`;
	const metadata = { timeZone } satisfies SubscriptionMetadata;
	await KV.put(key, JSON.stringify(subscription), { metadata });

	return new Response(undefined, { status: 204 });
}) satisfies RequestHandler;
