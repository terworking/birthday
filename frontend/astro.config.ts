import { defineConfig } from 'astro/config'
import Icons from 'unplugin-icons/vite'
import vue from '@astrojs/vue'

// https://astro.build/config
export default defineConfig({
  site: 'https://terworking-birthday.pages.dev',
  integrations: [vue({ reactivityTransform: true })],
  output: 'static',
  vite: {
    plugins: [Icons({ defaultClass: 't-icon', scale: 1 })],
    ssr: {
      noExternal: ['modern-normalize'],
    },
  },
})
