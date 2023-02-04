import type { BirthdayTarget } from './types';

export const birthdayTargetAsKey = ({ date, month, name, year }: BirthdayTarget) => {
	const escapedName = name.replace(/\W/g, '_').toLowerCase();
	const birthDate = new Date(year, month - 1, date);

	return `${escapedName}:${birthDate.valueOf()}`;
};

export const calculateNextBirthdayDate = (target?: BirthdayTarget, now = new Date()) => {
	if (target === undefined) return new Date(1971, 0, 1);

	const next = new Date(now.getFullYear(), target.month - 1, target.date);
	if (next.valueOf() <= now.valueOf()) {
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
