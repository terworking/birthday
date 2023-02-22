import type { BirthdayTarget } from '$lib/types';
import { rawTimeZones } from '@vvo/tzdb';

const offsets = rawTimeZones.map(({ rawOffsetInMinutes }) => rawOffsetInMinutes);
export const getBirthdayMatches = (
	targets: BirthdayTarget[],
	{
		maxOffset = Math.max(...offsets) / 60,
		minOffset = Math.min(...offsets) / 60,
		now = new Date(),
	} = {},
) => {
	return targets.filter(({ date, month }) => {
		const minDate = new Date(now.getFullYear(), month - 1, date, minOffset);
		const maxDate = new Date(now.getFullYear(), month - 1, date, maxOffset);
		return minDate <= now && now <= maxDate;
	});
};

if (import.meta.vitest) {
	const { describe, expect, it } = import.meta.vitest;

	const targets = [
		{ date: 6, month: 5, name: 'A', year: 2003 },
		{ date: 17, month: 12, name: 'B', year: 2003 },
		{ date: 23, month: 3, name: 'C', year: 2004 },
	] satisfies BirthdayTarget[];

	describe('match birthday', () => {
		it('should match exact time', () => {
			const now = new Date(2023, 11, 17);
			expect(getBirthdayMatches(targets, { now })).toStrictEqual([
				{ date: 17, month: 12, name: 'B', year: 2003 },
			]);
		});

		it('should match with -offsets', () => {
			const now = new Date(2023, 4, 5, 12); // -12 offset
			expect(getBirthdayMatches(targets, { now, minOffset: -12 })).toStrictEqual([
				{ date: 6, month: 5, name: 'A', year: 2003 },
			]);
		});

		it('should match with +offsets', () => {
			const now = new Date(2023, 2, 23, 20); // +20 offset
			expect(getBirthdayMatches(targets, { now, maxOffset: 20 })).toStrictEqual([
				{ date: 23, month: 3, name: 'C', year: 2004 },
			]);
		});
	});
}
