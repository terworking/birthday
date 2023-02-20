import { targets } from '$lib/server/target';
import { birthdayTargetAsKey } from '$lib/util';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (({ params: { name } }) => {
	const target = targets.find((value) => value.name.toLowerCase().replaceAll(' ', '-') === name);

	if (target === undefined) {
		throw error(404);
	}

	return { key: birthdayTargetAsKey(target), value: target };
}) satisfies PageServerLoad;
