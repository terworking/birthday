/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_BACKEND_SERVER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
