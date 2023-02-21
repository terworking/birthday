import { targets } from '$lib/server/target';
import { birthdayTargetAsKey } from '$lib/util';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const normalizeName = (name: string) => name.toLowerCase().replaceAll(' ', '-');

export const load = (({ params, url }) => {
	let matchIndex = targets.findIndex(
		(value) =>
			birthdayTargetAsKey(value) === params.name || normalizeName(value.name) === params.name
	);

	if (matchIndex === -1) {
		throw error(404);
	}

	let shouldRedirect = false;
	if (url.searchParams.get('previous') === '1') {
		matchIndex -= 1;
		shouldRedirect = true;
	} else if (url.searchParams.get('next') === '1') {
		matchIndex += 1;
		shouldRedirect = true;
	}

	const match = targets.at(matchIndex % targets.length)!;

	const key = birthdayTargetAsKey(match);
	if (key === params.name) {
		shouldRedirect = true;
	}

	if (shouldRedirect) {
		const name = normalizeName(match.name);
		throw redirect(301, `/countdown/${name}`);
	}

	return { target: { key, ...match } };
}) satisfies PageServerLoad;
