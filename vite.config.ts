import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import UnoCSS from 'unocss/vite';

const config: UserConfig = {
	define: { 'import.meta.vitest': 'undefined' },
	plugins: [UnoCSS({ mode: 'svelte-scoped' }), sveltekit()],
};

export default config;
