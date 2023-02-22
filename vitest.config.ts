import type { UserConfig } from 'vitest/config';

const config: UserConfig = {
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		includeSource: ['src/**/*.{js,ts}'],
	},
};

export default config;
