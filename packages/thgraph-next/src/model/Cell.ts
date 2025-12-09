import type { Cell as ICell, CellType, CellValue, CellStyle, Geometry } from '../types/index.js'

/**
 * Immutable implementation of the Cell interface
 */
export class Cell implements ICell {
  readonly id: string
  readonly type: CellType
  readonly value: CellValue
  readonly geometry: Geometry | null
  readonly style: CellStyle
  readonly parent: Cell | null
  readonly children: readonly Cell[]
  readonly source: Cell | null
  readonly target: Cell | null
  readonly vertex: boolean
  readonly edge: boolean
  readonly connectable: boolean
  readonly visible: boolean
  readonly collapsed: boolean

  constructor(params: {
    id: string
    type: CellType
    value?: CellValue
    geometry?: Geometry | null
    style?: CellStyle
    parent?: Cell | null
    children?: readonly Cell[]
    source?: Cell | null
    target?: Cell | null
    connectable?: boolean
    visible?: boolean
    collapsed?: boolean
  }) {
    this.id = params.id
    this.type = params.type
    this.value = params.value ?? null
    this.geometry = params.geometry ?? null
    this.style = { ...params.style }
    this.parent = params.parent ?? null
    this.children = [...(params.children ?? [])]
    this.source = params.source ?? null
    this.target = params.target ?? null
    this.vertex = params.type === 'vertex'
    this.edge = params.type === 'edge'
    this.connectable = params.connectable ?? true
    this.visible = params.visible ?? true
    this.collapsed = params.collapsed ?? false
  }

  /**
   * Create a new Cell with updated properties
   */
  with(params: Partial<{
    value: CellValue
    geometry: Geometry | null
    style: CellStyle
    parent: Cell | null
    children: readonly Cell[]
    source: Cell | null
    target: Cell | null
    connectable: boolean
    visible: boolean
    collapsed: boolean
  }>): Cell {
    return new Cell({
      id: this.id,
      type: this.type,
      value: params.value ?? this.value,
      geometry: params.geometry ?? this.geometry,
      style: params.style ? { ...this.style, ...params.style } : this.style,
      parent: params.parent ?? this.parent,
      children: params.children ?? this.children,
      source: params.source ?? this.source,
      target: params.target ?? this.target,
      connectable: params.connectable ?? this.connectable,
      visible: params.visible ?? this.visible,
      collapsed: params.collapsed ?? this.collapsed,
    })
  }

  /**
   * Create a vertex cell
   */
  static vertex(params: {
    id: string
    value?: CellValue
    geometry?: Geometry | null
    style?: CellStyle
    parent?: Cell | null
  }): Cell {
    return new Cell({
      ...params,
      type: 'vertex',
    })
  }

  /**
   * Create an edge cell
   */
  static edge(params: {
    id: string
    value?: CellValue
    geometry?: Geometry | null
    style?: CellStyle
    parent?: Cell | null
    source?: Cell | null
    target?: Cell | null
  }): Cell {
    return new Cell({
      ...params,
      type: 'edge',
    })
  }

  /**
   * Create a vertex cell with convenience parameters
   */
  static createVertex(
    id: string,
    value?: CellValue,
    geometry?: Geometry | null,
    style?: CellStyle
  ): Cell {
    return new Cell({
      id,
      type: 'vertex',
      value,
      geometry,
      style,
      connectable: true,
      visible: true
    })
  }

  /**
   * Create an edge cell with convenience parameters
   */
  static createEdge(
    id: string,
    value?: CellValue,
    geometry?: Geometry | null,
    style?: CellStyle
  ): Cell {
    return new Cell({
      id,
      type: 'edge',
      value,
      geometry,
      style,
      connectable: true,
      visible: true
    })
  }

  /**
   * Check if this cell is a descendant of the given cell
   */
  isDescendant(cell: Cell): boolean {
    if (!this.parent) {
      return false
    }
    if (this.parent === cell) {
      return true
    }
    return this.parent.isDescendant(cell)
  }

  /**
   * Get the depth of this cell in the hierarchy
   */
  getDepth(): number {
    if (!this.parent) {
      return 0
    }
    return this.parent.getDepth() + 1
  }

  /**
   * Check if this cell is connected to another cell
   */
  isConnectedTo(cell: Cell): boolean {
    if (this.source === cell || this.target === cell) {
      return true
    }

    // Check if any child is connected to the cell
    return this.children.some(child => child.isConnectedTo(cell))
  }

  /**
   * Get all edges connected to this cell
   */
  getConnectedEdges(): Cell[] {
    const edges: Cell[] = []

    // Check all children for edges
    for (const child of this.children) {
      if (child.edge && (child.source === this || child.target === this)) {
        edges.push(child)
      }
      // Recursively check children
      edges.push(...child.getConnectedEdges())
    }

    return edges
  }

  /**
   * Get the path from the root to this cell
   */
  getPath(): Cell[] {
    if (!this.parent) {
      return [this]
    }
    return [...this.parent.getPath(), this]
  }

  /**
   * Check if this cell has the given style property
   */
  hasStyle(key: string): boolean {
    return key in this.style
  }

  /**
   * Get a style property value
   */
  getStyle<K extends keyof CellStyle>(key: K): CellStyle[K] {
    return this.style[key]
  }

  /**
   * Get a style property value with a default
   */
  getStyleOrDefault<K extends keyof CellStyle>(key: K, defaultValue: CellStyle[K]): CellStyle[K] {
    return this.style[key] ?? defaultValue
  }

  /**
   * Check if the cell is visible and all its parents are visible
   */
  isVisible(): boolean {
    if (!this.visible) {
      return false
    }
    if (!this.parent) {
      return true
    }
    return this.parent.isVisible()
  }

  /**
   * Get the absolute geometry (accounting for parent transforms)
   */
  getAbsoluteGeometry(): Geometry | null {
    if (!this.geometry) {
      return null
    }

    if (!this.parent) {
      return this.geometry
    }

    const parentGeometry = this.parent.getAbsoluteGeometry()
    if (!parentGeometry) {
      return this.geometry
    }

    return {
      ...this.geometry,
      x: this.geometry.x + parentGeometry.x,
      y: this.geometry.y + parentGeometry.y,
    }
  }
}