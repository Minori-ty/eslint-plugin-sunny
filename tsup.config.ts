import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/**/*.ts'],
    outDir: 'dist',
    dts: true,
    clean: true,
    sourcemap: true,
    format: ['esm'],
    tsconfig: './tsconfig.json',
    outExtension: ({ format }) => ({ js: format === 'esm' ? '.mjs' : '.js' }),
})
