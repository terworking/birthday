import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import Icons from 'unplugin-icons/vite';
import { presetUno } from 'unocss';
import UnoCSS from 'unocss/vite';

const config: UserConfig = {
	define: { 'import.meta.vitest': 'undefined' },
	plugins: [
		UnoCSS({ mode: 'svelte-scoped', presets: [presetUno()] }),
		sveltekit(),
		Icons({ compiler: 'svelte', defaultClass: 't-icon', scale: 1 })
	]
};

export default config;
