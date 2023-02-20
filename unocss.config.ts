import { defineConfig, presetUno, transformerDirectives } from 'unocss';

export default defineConfig({
	transformers: [transformerDirectives()],
	presets: [presetUno()]
});
