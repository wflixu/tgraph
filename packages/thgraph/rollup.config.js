import path from 'path';
import { fileURLToPath } from 'url';
import {babel} from '@rollup/plugin-babel';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import image from '@rollup/plugin-image';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = path.join(__dirname, './index.js');

const bundles = [
  {
    input,
    output: {
      file: path.join(__dirname, 'dist/thgraph.esm.js'),
      format: 'esm',
    },
    plugins: []
  },
  {
    input,
    output: {
      file: path.join(__dirname, 'dist/thgraph.esm.min.js'),
      format: 'esm',
    },
    plugins: []
  },
  {
    input,
    output: {
      file: path.join(__dirname, 'dist/thgraph.esm.development.js'),
      format: 'esm',
    },
    plugins: []
  },
  {
    input,
    output: {
      name: 'thgraph',
      file: path.join(__dirname, 'dist/thgraph.js'),
      format: 'iife',
    },
    plugins: []
  },
  {
    input,
    output: {
      name: 'thgraph',
      file: path.join(__dirname, 'dist/thgraph.min.js'),
      format: 'iife',
    },
    plugins: []
  },
];

const isDevEnv = (file) => file.includes('.development.');
const isUMD = (file) => file.includes('.core.js');
const isMinEnv = (file) => file.includes('.min.');
const isSpecificEnv = (file) => isMinEnv(file) || isDevEnv(file);
const isDebugAlways = (file) => isDevEnv(file) || isUMD(file) ? 'true' : 'false';

const buildExport = bundles.map(({input, output, plugins}) => ({
  input,
  output,
  external: ['detect-browser'],
  plugins: [
    
    image(),
    nodeResolve({extensions: ['.js']}),
    replace({
      __DEV__: isSpecificEnv(output.file)
        ? isDebugAlways(output.file)
        : 'process.env.NODE_ENV !== "production"',
      preventAssignment: true,
    }),
    
    ...plugins,
    
    output.file.includes('.min.') && terser(),
  ],
}));

const devExport = {
  input: path.join(__dirname, 'src/index.ts'),
  output: {
    file: path.join(__dirname, `dist/thgraph.esm.js`),
    format: 'esm',
  },
  external: ['detect-browser'],
  plugins: [
    image(),
    nodeResolve({extensions: ['.js']}),
   
   
    replace({
      __DEV__: 'true',
      preventAssignment: true,
    }),
  ],
};

export default process.env.NODE_ENV === 'build' ? buildExport : devExport;
