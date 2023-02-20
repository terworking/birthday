import { targets } from '$lib/server/target';
import { birthdayTargetAsKey } from '$lib/util';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (({ params: { name } }) => {
	const match = targets.find((value) => value.name.toLowerCase().replaceAll(' ', '-') === name);

	if (match === undefined) {
		throw error(404);
	}

	return { target: { key: birthdayTargetAsKey(match), ...match } };
}) satisfies PageServerLoad;
