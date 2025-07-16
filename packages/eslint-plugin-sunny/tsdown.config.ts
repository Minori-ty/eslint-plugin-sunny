import { defineConfig } from 'tsdown'
import { analyzer, unstableRolldownAdapter } from 'vite-bundle-analyzer'

export default defineConfig({
    entry: 'src/index.ts',
    outDir: 'dist',
    format: ['es', 'cjs'],
    clean: true,
    plugins: [unstableRolldownAdapter(analyzer())],
    skipNodeModulesBundle: true,
    tsconfig: './tsconfig.json',
    minify: true,
    outputOptions: {
        exports: 'named',
    },
})
