import type { Cell, Geometry, Style, Point, Rectangle } from '../../types'

/**
 * Base interface for all shape implementations
 */
export interface Shape {
  /**
   * The type of shape
   */
  readonly type: string

  /**
   * Render the shape to SVG
   */
  render(
    cell: Cell,
    geometry: Geometry,
    style: Style,
    container: SVGElement
  ): SVGElement

  /**
   * Get the bounds of the shape
   */
  getBounds(geometry: Geometry): Rectangle

  /**
   * Check if a point is inside the shape
   */
  containsPoint(geometry: Geometry, x: number, y: number): boolean

  /**
   * Get the connection points for edges
   */
  getConnectionPoints(geometry: Geometry): Point[]

  /**
   * Update the shape with new geometry
   */
  updateShape(element: SVGElement, geometry: Geometry, style: Style): void
}

/**
 * Shape configuration interface
 */
export interface ShapeConfig {
  type: string
  createRenderer: () => Shape
}

/**
 * Registry for managing shape types and their renderers
 */
export class ShapeRegistry {
  private static shapes = new Map<string, ShapeConfig>()

  /**
   * Register a new shape type
   */
  static register(config: ShapeConfig): void {
    this.shapes.set(config.type, config)
  }

  /**
   * Unregister a shape type
   */
  static unregister(type: string): void {
    this.shapes.delete(type)
  }

  /**
   * Get a shape renderer by type
   */
  static getRenderer(type: string): Shape | undefined {
    const config = this.shapes.get(type)
    return config?.createRenderer()
  }

  /**
   * Check if a shape type is registered
   */
  static has(type: string): boolean {
    return this.shapes.has(type)
  }

  /**
   * Get all registered shape types
   */
  static getRegisteredTypes(): string[] {
    return Array.from(this.shapes.keys())
  }

  /**
   * Clear all registered shapes
   */
  static clear(): void {
    this.shapes.clear()
  }
}