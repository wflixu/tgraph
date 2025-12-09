import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'model/index': 'src/model/index.ts',
    'view/index': 'src/view/index.ts',
    'renderer/index': 'src/renderer/index.ts',
    'interaction/index': 'src/interaction/index.ts',
    'edge/index': 'src/edge/index.ts',
    'undo/index': 'src/undo/index.ts',
  },
  format: ['esm'],
  target: 'esnext',
  minify: true,
  sourcemap: true,
  clean: true,
  dts: {
    enabled: true,
  },
  external: [
    // Add external dependencies here if needed
  ],
})