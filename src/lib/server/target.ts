import type { BirthdayTarget } from '$lib/types';
import { birthdayTargetAsKey } from '$lib/util';
import { items } from './target.json';

export const targets: BirthdayTarget[] = items;
export const keyedTargets: Record<string, BirthdayTarget> = Object.fromEntries(
	targets.map((target) => [birthdayTargetAsKey(target), target])
);
