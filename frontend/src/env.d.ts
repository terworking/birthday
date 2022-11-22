/// <reference types="astro/client" />
/// <reference types="vue/macros-global" />

interface ImportMetaEnv {
  readonly PUBLIC_BACKEND_SERVER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
