import { targetMap } from '$lib/server/target';
import { rawTimeZones } from '@vvo/tzdb';
import { getPublicKeyFromJwk } from 'cf-webpush';
import type { PageServerLoad } from './$types';

export const load = (({ locals: { jwk } }) => {
	const timeZoneMap = Object.fromEntries(
		rawTimeZones
			.sort(({ name: a }, { name: b }) => a.localeCompare(b))
			.map(({ name, abbreviation, rawOffsetInMinutes }) => {
				const offsetInHour = rawOffsetInMinutes / 60;
				const offset = `${offsetInHour >= 0 ? '+' : ''}${offsetInHour}`;

				return [name, `${name} (${abbreviation}, UTC${offset})`];
			})
	);

	return { targetMap, timeZoneMap, publicKey: getPublicKeyFromJwk(jwk) };
}) satisfies PageServerLoad;
