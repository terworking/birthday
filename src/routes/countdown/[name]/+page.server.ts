import { targets } from '$lib/server/target';
import { birthdayTargetAsKey } from '$lib/util';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const normalizeName = (name: string) => name.toLowerCase().replaceAll(' ', '-');

export const load = (({ params }) => {
	const matchIndex = targets.findIndex((value) => normalizeName(value.name) === params.name);

	if (matchIndex === -1) {
		throw error(404);
	}

	const [left, match, right] = Array.from(
		{ length: 3 },
		(_, index) => targets.at((-1 + index + matchIndex) % targets.length)!,
	);

	const key = birthdayTargetAsKey(match);
	const [previous, next] = [left, right].map(({ name }) => normalizeName(name));

	return { target: { key, ...match }, previous, next };
}) satisfies PageServerLoad;
