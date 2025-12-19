/**
 * Core type definitions for thgraph-next
 */

// Basic geometry types
export interface Point {
  readonly x: number
  readonly y: number
}

export interface Rectangle extends Point {
  readonly width: number
  readonly height: number
}

export interface Size {
  readonly width: number
  readonly height: number
}

// Cell types
export type CellType = 'vertex' | 'edge'

export interface CellStyle {
  readonly shape?: string
  readonly fillColor?: string
  readonly strokeColor?: string
  readonly strokeWidth?: number
  readonly opacity?: number
  readonly fontSize?: number
  readonly fontFamily?: string
  readonly fontColor?: string
  readonly fontStyle?: 'normal' | 'italic' | 'bold'
  readonly fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
  readonly align?: 'left' | 'center' | 'right'
  readonly verticalAlign?: 'top' | 'middle' | 'bottom'
  readonly rounded?: boolean
  readonly shadow?: boolean
  readonly glass?: boolean
  readonly sketch?: boolean
  readonly fillOpacity?: number
  readonly strokeOpacity?: number
  readonly dashPattern?: string
  readonly startArrow?: string
  readonly endArrow?: string
  readonly cornerRadius?: number
  readonly textDecoration?: 'none' | 'underline' | 'line-through' | 'overline'
  readonly imageAspectRatio?: string
  readonly imageSrc?: string
  readonly [key: string]: string | number | boolean | undefined
}

// Alias for CellStyle to match Style usage in renderer
export type Style = CellStyle

// Cell value types
export type CellValue = string | number | boolean | Record<string, unknown> | null | undefined

// Cell interface
export interface Cell {
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

  // Methods
  isEdge(): boolean
  isVertex(): boolean
  isDescendant(cell: Cell): boolean
  getDepth(): number
  isConnectedTo(cell: Cell): boolean
  getConnectedEdges(): Cell[]
  getPath(): Cell[]
  hasStyle(key: string): boolean
  getStyle<K extends keyof CellStyle>(key: K): CellStyle[K]
  getStyleOrDefault<K extends keyof CellStyle>(key: K, defaultValue: CellStyle[K]): CellStyle[K]
  isVisible(): boolean
  getAbsoluteGeometry(): Geometry | null
}

// Geometry for positioning and sizing
export interface Geometry {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly points?: readonly Point[]
  readonly offsets?: Geometry
  readonly relative?: boolean
  readonly terminal?: Point
}

// Event types
export interface CellClickEvent {
  readonly cell: Cell
  readonly event: MouseEvent
}

export interface CellDoubleClickEvent {
  readonly cell: Cell
  readonly event: MouseEvent
}

export interface CellMoveEvent {
  readonly cell: Cell
  readonly oldGeometry: Geometry
  readonly newGeometry: Geometry
}

export interface CellResizeEvent {
  readonly cell: Cell
  readonly oldGeometry: Geometry
  readonly newGeometry: Geometry
}

export interface SelectionChangeEvent {
  readonly added: readonly Cell[]
  readonly removed: readonly Cell[]
  readonly selection: readonly Cell[]
}

export interface ViewScaleChangeEvent {
  readonly oldScale: number
  readonly newScale: number
}

export interface ViewTranslateChangeEvent {
  readonly oldTranslate: Point
  readonly newTranslate: Point
}

// Event map for type-safe event handling
export interface GraphEventMap {
  'cell:click': CellClickEvent
  'cell:double-click': CellDoubleClickEvent
  'cell:move': CellMoveEvent
  'cell:resize': CellResizeEvent
  'selection:changed': SelectionChangeEvent
  'view:scale-changed': ViewScaleChangeEvent
  'view:translate-changed': ViewTranslateChangeEvent
}

// Graph data model interface
export interface GraphModel {
  readonly cells: Map<string, Cell>
  readonly root: Cell
  getCell(id: string): Cell | undefined
  addCell(cell: Cell, parent?: Cell): void
  removeCell(cell: Cell): void
  setGeometry(cell: Cell, geometry: Geometry): void
  setStyle(cell: Cell, style: CellStyle): void
  setValue(cell: Cell, value: CellValue): void
  execute(change: Change): void
  beginUpdate(): void
  endUpdate(): void
}

// Change tracking for undo/redo
export interface Change {
  readonly cell: Cell
  execute(model: GraphModel): void
  undo(model: GraphModel): void
}

// Selection model
export interface SelectionModel {
  readonly selection: readonly Cell[]
  isSelected(cell: Cell): boolean
  selectCell(cell: Cell): void
  deselectCell(cell: Cell): void
  selectCells(cells: readonly Cell[]): void
  clearSelection(): void
}

// View and rendering
export interface GraphViewState {
  readonly scale: number
  readonly translate: Point
  readonly bounds: Rectangle
}

// Style sheet
export interface Stylesheet {
  getCellStyle(style: CellStyle): CellStyle
  putCellStyle(name: string, style: CellStyle): void
  getDefaultStyle(): CellStyle
}

// Export utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>