

/**
 * thgraph-next - Modern TypeScript 5 Graph Engine
 *
 * A framework-agnostic graph rendering and interaction engine
 */

// Export all types
export * from './types/index.js'

// Export core model functionality
export * from './model/index.js'

// View and renderer exports (Phase 2)
export * from './view/index.js'
export * from './renderer/index.js'

// Interaction exports (Phase 3)
export * from './interaction/index.js'

// Edge and undo exports (Phase 4)
export * from './edge/index.js'
export * from './undo/index.js'

// Re-export commonly used classes at top level
export { Cell, Geometry, GraphModel } from './model/index.js'
export { GraphView, SvgRenderer, SvgFactory } from './renderer/index.js'
export { EventEmitter, SelectionModel, PanZoomHandler, MouseHandler, DragHandler, ResizeHandler } from './interaction/index.js'
export { ConnectionHandler, EdgeRouter } from './edge/index.js'
export { UndoManager as HistoryManager } from './undo/index.js'
