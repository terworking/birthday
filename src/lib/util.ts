import type { BirthdayTarget } from './types';

export const birthdayTargetAsKey = ({ date, month, name, year }: BirthdayTarget) => {
	const escapedName = name.replace(/\W/g, '_').toLowerCase();
	const birthDate = new Date(year, month - 1, date);

	return `${escapedName}:${birthDate.valueOf()}`;
};

export const calculateNextBirthdayDate = (target: BirthdayTarget, { now = new Date() } = {}) => {
	const next = new Date(now.getFullYear(), target.month - 1, target.date);
	if (next <= now) {
		next.setFullYear(next.getFullYear() + 1);
	}

	return next;
};

export const asOrdinalNumber = (n: number) => {
	const lastDigit = n % 10;
	switch (lastDigit) {
		case 1:
			return `${n}st`;

		case 2:
			return `${n}nd`;

		case 3:
			return `${n}rd`;

		default:
			return `${n}th`;
	}
};

if (import.meta.vitest) {
	const { describe, expect, it } = import.meta.vitest;

	const now = new Date(2010, 5, 12); // 12th june 2010
	describe.each([
		{ date: 1, month: 12, year: 2000, next: new Date(2010, 11, 1) },
		{ date: 5, month: 6, year: 2000, next: new Date(2011, 5, 5) }
	])(`$date-$month-$year next birthday is $next from ${now}`, ({ date, month, year, next }) => {
		it('should calculate next birthday date correctly', () => {
			const target = { date, month, year, name: '' } satisfies BirthdayTarget;
			expect(calculateNextBirthdayDate(target, { now })).toStrictEqual(next);
		});
	});

	describe.each([
		[100, '100th'],
		[11, '11st'],
		[33, '33rd'],
		[62, '62nd'],
		[1999, '1999th']
	])('$1 -> $2', (from, to) => {
		it('should be correct', () => {
			expect(asOrdinalNumber(from)).toBe(to);
		});
	});
}
