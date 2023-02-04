import { keyedTargets } from '$lib/server/target';
import { rawTimeZones } from '@vvo/tzdb';
import type { PageServerLoad } from './$types';

export const load = (() => {
	const timeZones = Object.fromEntries(
		rawTimeZones
			.sort(({ name: a }, { name: b }) => a.localeCompare(b))
			.map(({ name, abbreviation, rawOffsetInMinutes }) => {
				const offsetInHour = rawOffsetInMinutes / 60;
				const offset = `${offsetInHour >= 0 ? '+' : ''}${offsetInHour}`;

				return [name, `${name} (${abbreviation}, UTC${offset})`];
			})
	);

	return { targets: keyedTargets, timeZones };
}) satisfies PageServerLoad;
