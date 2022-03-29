import path from 'path';
import {babel} from '@rollup/plugin-babel';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import {terser} from 'rollup-plugin-terser';
import bundleSize from '@atomico/rollup-plugin-sizes';
import image from '@rollup/plugin-image';

const input = path.join(__dirname, './index.js');

const bundles = [
  {
    input,
    output: {
      file: path.join(__dirname, 'dist/thgraph.esm.js'),
      format: 'esm',
    },
    plugins: [image()]
  },
  {
    input,
    output: {
      file: path.join(__dirname, 'dist/thgraph.esm.min.js'),
      format: 'esm',
    },
    plugins: [image()]
  },
  {
    input,
    output: {
      file: path.join(__dirname, 'dist/thgraph.esm.development.js'),
      format: 'esm',
    },
    plugins: [image()]
  },
  {
    input,
    output: {
      name: 'thgraph',
      file: path.join(__dirname, 'dist/thgraph.js'),
      format: 'umd',
    },
    plugins: [image()]
  },
  {
    input,
    output: {
      name: 'thgraph',
      file: path.join(__dirname, 'dist/thgraph.min.js'),
      format: 'umd',
    },
    plugins: [image()]
  },
  {
    input,
    output: {
      file: path.join(__dirname, 'dist/thgraph.cjs'),
      format: 'cjs',
    },
    plugins: [image()]
  },
];

const isDevEnv = (file) => file.includes('.development.');
const isUMD = (file) => file.includes('.core.js');
const isMinEnv = (file) => file.includes('.min.');
const isSpecificEnv = (file) => isMinEnv(file) || isDevEnv(file);
const isDebugAlways = (file) => isDevEnv(file) || isUMD(file) ? 'true' : 'false';

const buildExport = bundles.map(({input, output}) => ({
  input,
  output,
  plugins: [
    image(),
    nodeResolve({extensions: ['.ts']}),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts'],
      plugins: ['annotate-pure-calls'],
    }),
    replace({
      __DEV__: isSpecificEnv(output.file)
        ? isDebugAlways(output.file)
        : 'process.env.NODE_ENV !== "production"',
      preventAssignment: true,
    }),
    output.file.includes('.min.') && terser(),
    bundleSize(),
  ],
}));

const devExport = {
  input: path.join(__dirname, 'src/index.ts'),
  output: {
    file: path.join(__dirname, `dist/thgraph.esm.js`),
    format: 'esm',
  },
  plugins: [
    image(),
    nodeResolve({extensions: ['.ts']}),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts'],
      plugins: ['annotate-pure-calls'],
    }),
    replace({
      __DEV__: 'true',
      preventAssignment: true,
    }),
  ],
};

export default process.env.NODE_ENV === 'build' ? buildExport : devExport;
