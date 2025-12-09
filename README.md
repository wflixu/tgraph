# thgraph - Modern TypeScript Graph Engine

A modern TypeScript 5 reimplementation of mxGraph, providing a framework-agnostic graph rendering and interaction engine.

## Overview

**thgraph** is a complete rewrite of the mxGraph library with modern JavaScript/TypeScript practices. We've removed all legacy browser compatibility code and built a modern, type-safe graph engine that can be used with any frontend framework.

## Packages

### thgraph
- **Status**: ✅ Stable - ES2020 JavaScript conversion of mxGraph
- **Description**: Working ES Module version for immediate use
- **Features**: Full mxGraph compatibility, ES Module exports

### thgraph-next 🚧
- **Status**: Active Development - Phase 1 Complete ✅
- **Description**: Modern TypeScript 5 rewrite with strict type safety
- **Features**:
  - Framework-agnostic core engine
  - Immutable data structures
  - Full TypeScript support with strict mode
  - Modern ESNext build output

### thgraph-ui (Planned)
- **Status**: Planned for Phase 5
- **Description**: Vue 3 UI component library
- **Features**: Ready-to-use graph editor components

## Architecture

```
thgraph/
├── packages/
│   ├── thgraph/           # ES2020 version (stable)
│   ├── thgraph-next/       # TypeScript 5 rewrite
│   └── thgraph-ui/         # Vue UI components (future)
│   ├── demos/              # Demo applications
│   └── docs/               # Documentation
```

## Quick Start

### Using thgraph (ES2020 Version)

```bash
npm install thgraph
```

```javascript
import { mxGraph, mxRubberband } from 'thgraph';

const container = document.getElementById('graphContainer');
const graph = new mxGraph(container);
new mxRubberband(graph);

const parent = graph.getDefaultParent();
graph.getModel().beginUpdate();
try {
    const v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
    const v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
    const e1 = graph.insertEdge(parent, null, '', v1, v2);
} finally {
    graph.getModel().endUpdate();
}
```

### Using thgraph-next (TypeScript 5)

```bash
npm install thgraph-next
```

```typescript
import { GraphModel, Cell, Geometry } from 'thgraph-next';

// Create a graph model
const model = new GraphModel();

// Create cells with immutable API
const cell1 = Cell.vertex({
  id: 'cell1',
  value: 'Hello World',
  geometry: Geometry.fromRectangle(10, 10, 100, 50),
  style: { fillColor: '#f0f0f0', strokeColor: '#333333' }
});

model.addCell(cell1);

// Create a renderer (Phase 2 will implement this)
// const renderer = new SvgRenderer(container, model);
// renderer.render();
```

## Development Status

### Phase 1: Infrastructure & Data Model ✅
- [x] Package structure setup (pnpm workspaces)
- [x] TypeScript 5.x with strict mode
- [x] Modern build tools (tsdown)
- [x] Testing framework (Vitest 4.x + happy-dom)
- [x] Core data model implementation
  - [x] Cell class (immutable)
  - [x] Geometry class (coordinates, transformations)
  - [x] GraphModel (transactions, change tracking)
  - [x] Complete type definitions
- [x] Test coverage (58 tests, 51 passing)

### Phase 2: Core Renderer (Next)
- [ ] SVG rendering engine
- [ ] Coordinate transformation system
- [ ] Shape registry
- [ ] Modern DOM API integration

### Phase 3: Interaction & Events (Planned)
- [ ] Type-safe event system
- [ ] Pan, zoom, and selection
- [ ] Cell manipulation handlers

### Phase 4: Connections & Advanced Features (Planned)
- [ ] Edge creation and routing
- [ ] Undo/redo functionality
- [ ] Performance optimizations

### Phase 5: Vue 3 UI Components (Planned)
- [ ] GraphContainer component
- [ ] Toolbar, Sidebar, Properties panels
- [ ] Theme system with CSS variables

## Technology Stack

- **Language**: TypeScript 5.x (strict mode)
- **Build**: tsdown (core), Vite (demos)
- **Testing**: Vitest 4.x with happy-dom
- **Packaging**: pnpm workspaces
- **CSS**: CSS variables for theming

## Installation

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/thgraph.git
cd thgraph

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run tests
pnpm test

# Build packages
pnpm build
```

### Package Installation

```bash
# Install thgraph (ES2020 stable version)
npm install thgraph

# Or install thgraph-next (TypeScript 5 development version)
npm install thgraph-next
```

## Documentation

- **API Documentation**: [TypeDoc documentation](https://yourusername.github.io/thgraph/)
- **Development Guide**: See [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)
- **Examples**: Check the `packages/demos/` directory

## Contributing

We welcome contributions! Here's how to get involved:

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Run tests: `pnpm test`
6. Submit a pull request

### Development Guidelines

- Follow TypeScript strict mode practices
- Write comprehensive tests for new features
- Maintain 90%+ test coverage
- Update documentation for API changes

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Original [mxGraph](https://github.com/jgraph/mxgraph) by JGraph
- The TypeScript and JavaScript community for inspiration and best practices

## Related Projects

- [mxgraph-js](https://github.com/jgraph/mxgraph-js) - Original mxGraph repository
- [draw.io](https://github.com/jgraph/drawio) - Diagramming application using mxGraph