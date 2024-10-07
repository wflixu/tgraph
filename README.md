

# thgraph

**thgraph** is a modern reimplementation of the mxGraph library, which is no longer actively maintained. Our goal is to refactor the existing jgraph/mxGraph source code into TypeScript, removing legacy browser compatibility code and focusing on modern browsers. Given the extensive codebase, a complete rewrite isn't feasible at this time. Instead, our strategy is to first convert it to ES Modules, allowing compatibility with popular frameworks like Vue, React, and build tools like Vite and Webpack, followed by ongoing refactoring and optimization.

For the original mxGraph codebase, please visit: [mxgraph repository](https://github.com/jgraph/mxgraph-js).

## Roadmap

- [x] Successfully run the Hello World example
- [x] Convert to ES Module format
- [x] Create example website
- [ ] Continue refactoring
- [ ] Optimize TypeScript types

## Installation

To install thgraph, use one of the following package managers:

```bash
# npm
npm install thgraph

# yarn
yarn add thgraph

# View the application
pnpm dev

# Documentation
pnpm dev:doc
```

## Documentation

Currently, thgraph is a direct conversion of mxGraph to ES Modules, allowing previous global variables to be used seamlessly.

[View the new documentation](https://wflixu.github.io/tgraph/).

### Hello World Example

Here’s a simple example of how to use thgraph:

```javascript
import { mxGraph, mxRubberband } from 'thgraph';

const container = document.getElementById('graphContainer');
// Creates the graph inside the specified container
const graph = new mxGraph(container);

// Enables rubberband selection
new mxRubberband(graph);

// Gets the default parent for inserting new cells
const parent = graph.getDefaultParent();

// Adds cells to the model in a single step
graph.getModel().beginUpdate();
try {
    const v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
    const v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
    const e1 = graph.insertEdge(parent, null, '', v1, v2);
} finally {
    // Updates the display
    graph.getModel().endUpdate();
}
```

For more information, refer to the [mxGraph documentation](https://jgraph.github.io/mxgraph/).

## Contributing

We welcome contributions to thgraph! Here’s how you can get involved:

1. Fork this repository
2. Create a new branch named `Feat_xxx`
3. Commit your changes
4. Open a Pull Request

