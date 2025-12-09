export type { Shape, ShapeConfig } from './Shape'
export { ShapeRegistry } from './Shape'
export { RectangleShape } from './RectangleShape'
export { EllipseShape } from './EllipseShape'
export { TextShape } from './TextShape'
export { ImageShape } from './ImageShape'

import { ShapeRegistry } from './Shape'
import { RectangleShape } from './RectangleShape'
import { EllipseShape } from './EllipseShape'
import { TextShape } from './TextShape'
import { ImageShape } from './ImageShape'

/**
 * Initialize default shapes in the registry
 */
export function initializeDefaultShapes(): void {
  ShapeRegistry.register({
    type: 'rectangle',
    createRenderer: () => new RectangleShape()
  })

  ShapeRegistry.register({
    type: 'ellipse',
    createRenderer: () => new EllipseShape()
  })

  ShapeRegistry.register({
    type: 'text',
    createRenderer: () => new TextShape()
  })

  ShapeRegistry.register({
    type: 'image',
    createRenderer: () => new ImageShape()
  })

  // Register aliases
  ShapeRegistry.register({
    type: 'rect',
    createRenderer: () => new RectangleShape()
  })

  ShapeRegistry.register({
    type: 'circle',
    createRenderer: () => new EllipseShape()
  })

  ShapeRegistry.register({
    type: 'label',
    createRenderer: () => new TextShape()
  })
}