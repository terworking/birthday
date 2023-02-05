import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	define: { 'import.meta.vitest': 'undefined' },
	plugins: [sveltekit(), Icons({ compiler: 'svelte', defaultClass: 't-icon', scale: 1 })],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		includeSource: ['src/**/*.{js,ts}']
	}
};

export default config;
