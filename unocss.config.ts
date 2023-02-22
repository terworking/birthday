import { defineConfig, presetIcons, presetUno, transformerDirectives } from 'unocss';

export default defineConfig({
	transformers: [transformerDirectives()],
	presets: [presetUno(), presetIcons()],
});
