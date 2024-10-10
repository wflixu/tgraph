import { defineConfig, } from "rolldown";

import image from '@rollup/plugin-image';

// export default defineConfig({
//     input: './index.js',
//     output: {
//         dir: './dist',
//         format: 'esm',
//         sourcemap: true,
//     },
//     plugins: [
//         image(),
//     ],
// })
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const bundles = [
    {

        output: {
            banner:"/* This is a banner */",
            dir: './dist',
            entryFileNames: 'thgraph.esm.js',
            name: 'thgraph.esm.js',
            format: 'esm',
            minify: true,
            sourcemap: true,
        },
    },
    // {

    //     output: {
    //         name: path.join(__dirname, 'dist/thgraph.esm.min.js'),
    //         format: 'esm',
    //     },

    // },
    // {

    //     output: {
    //         name: path.join(__dirname, 'dist/thgraph.esm.development.js'),
    //         format: 'esm',
    //     },
    // }
];

const buildExport = bundles.map((output) => {
    return defineConfig({
        input: './index.js',
        output,
        plugins: [
            image(),
        ],
    })
});

export default buildExport;




