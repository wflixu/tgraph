import { defineConfig } from 'rolldown'

import image from '@rollup/plugin-image';

export default defineConfig({
    input: {
       thgraph: './index.js',
    },

    output: {
        dir: './dist',
        format: 'esm',
        minify: true,
        entryFileNames: '[name].mjs',
        chunkFileNames: 'thgraph.esm.mini.js',
        name: 'thgraph',
        sourcemap: true,
        banner: '/* thgraph v1.0.0 */',
        advancedChunks: {
            minSize: 1000,
        }
    },
    plugins: [
        image(),
    ],
})