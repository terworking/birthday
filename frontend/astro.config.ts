import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'

// https://astro.build/config
export default defineConfig({
  integrations: [vue({ reactivityTransform: true })],
  output: 'static',
  vite: {
    ssr: {
      noExternal: ['modern-normalize'],
    },
  },
})
