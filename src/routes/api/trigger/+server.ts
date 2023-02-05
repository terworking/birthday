import { error, type RequestHandler } from '@sveltejs/kit';
import { APP_TRIGGER_KEY } from '$env/static/private';
import { getBirthdayMatches } from '$lib/server/schedule/match';
import { buildRequests } from '$lib/server/schedule/request';
import { getSubscriptions } from '$lib/server/schedule/subscription';
import { targets } from '$lib/server/target';

export const POST = (async ({ locals: { jwk }, platform, request }) => {
	if (request.headers.get('x-trigger-key') !== APP_TRIGGER_KEY) {
		throw error(401);
	}

	const KV = platform?.env?.BIRTHDAY_STORE!;
	const now = new Date();
	try {
		const birthdayMatches = getBirthdayMatches(targets, { now });
		const subscriptions = await getSubscriptions(KV, birthdayMatches, { now });
		const requests = await buildRequests(subscriptions, jwk, { now });

		for (const { key, request } of requests) {
			const response = await fetch(request);
			if (response.status === 404 || response.status === 410) {
				await KV.delete(key);
			} else if (!response.ok) {
				throw error(500, `received http code ${response.status}`);
			}
		}
	} catch (err) {
		try {
			await KV.put('___error', JSON.stringify(err, Object.getOwnPropertyNames(err)));
		} catch (err) {
			console.error(JSON.stringify(err, Object.getOwnPropertyNames(err)));
		} finally {
			throw err;
		}
	}

	return new Response(undefined, { status: 204 });
}) satisfies RequestHandler;
