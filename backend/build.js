require('esbuild').build({
  entryPoints: ['src/index.ts'],
  format: 'esm',
  bundle: true,
  outdir: 'dist',
  target: 'esnext',
})
