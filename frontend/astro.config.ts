import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import vue from '@astrojs/vue'

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  integrations: [vue({ reactivityTransform: true })],
  output: 'server',
  vite: {
    ssr: {
      noExternal: ['modern-normalize'],
    },
  },
})
