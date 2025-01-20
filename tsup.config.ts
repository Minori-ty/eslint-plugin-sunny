import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/**/*.ts'],
    outDir: 'dist',
    dts: true,
    clean: true,
    format: ['esm', 'cjs'],
    tsconfig: './tsconfig.json',
    external: ['tty', '@typescript-eslint/typescript-estree'],
})
