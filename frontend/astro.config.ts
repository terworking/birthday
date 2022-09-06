import type { AstroUserConfig } from 'astro'

import cloudflare from '@astrojs/cloudflare'

// https://astro.build/config
export default <AstroUserConfig>{
  output: 'server',
  adapter: cloudflare(),
  vite: {
    ssr: {
      noExternal: ['modern-normalize'],
    },
  },
}
