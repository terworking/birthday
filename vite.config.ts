import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit(), Icons({ compiler: 'svelte', defaultClass: 't-icon', scale: 1 })]
	// test: {
	// 	include: ['src/**/*.{test,spec}.{js,ts}']
	// }
};

export default config;
