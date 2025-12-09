import type {
  GraphModel as IGraphModel,
  Cell,
  Geometry,
  CellStyle,
  CellValue,
  Change,
} from '../types/index.js'
import { Cell as CellImpl } from './Cell.js'
import { GeometryChange, StyleChange, ValueChange, ChildChange, RemoveChange, CompositeChange } from './Change.js'

/**
 * Implementation of the GraphModel interface
 */
export class GraphModel implements IGraphModel {
  private _cells: Map<string, Cell> = new Map()
  private _root: Cell
  private _updateLevel = 0
  private _currentChanges: Change[] = []

  constructor(root?: Cell) {
    this._root = root ?? CellImpl.vertex({ id: 'root' })
    this._cells.set(this._root.id, this._root)
  }

  get cells(): ReadonlyMap<string, Cell> {
    return this._cells
  }

  get root(): Cell {
    return this._root
  }

  getCell(id: string): Cell | undefined {
    return this._cells.get(id)
  }

  addCell(cell: Cell, parent: Cell = this._root): void {
    if (this._cells.has(cell.id)) {
      throw new Error(`Cell with id '${cell.id}' already exists`)
    }

    // Create updated child with parent reference
    const updatedChild = cell.with({ parent })

    // Create updated parent with new child
    const updatedParent = parent.with({
      children: [...parent.children, updatedChild],
    })

    // Update the cells - parent first so we have the right child reference
    this._cells.set(updatedParent.id, updatedParent)
    this._cells.set(updatedChild.id, updatedChild)
  }

  removeCell(cell: Cell): void {
    if (cell.id === this._root.id) {
      throw new Error('Cannot remove root cell')
    }

    if (!this._cells.has(cell.id)) {
      throw new Error(`Cell with id '${cell.id}' does not exist`)
    }

    // Remove all descendants first
    for (const child of [...cell.children]) {
      this.removeCell(child)
    }

    // Remove from parent
    if (cell.parent) {
      const parent = this._cells.get(cell.parent.id)!
      const updatedParent = parent.with({
        children: parent.children.filter(c => c.id !== cell.id),
      })
      this._cells.set(updatedParent.id, updatedParent)
    }

    // Remove the cell
    this._cells.delete(cell.id)
  }

  setGeometry(cell: Cell, geometry: Geometry | null): void {
    if (!this._cells.has(cell.id)) {
      throw new Error(`Cell with id '${cell.id}' does not exist`)
    }

    const change = new GeometryChange(cell, geometry)
    this.execute(change)
  }

  setStyle(cell: Cell, style: CellStyle): void {
    if (!this._cells.has(cell.id)) {
      throw new Error(`Cell with id '${cell.id}' does not exist`)
    }

    const change = new StyleChange(cell, style)
    this.execute(change)
  }

  setValue(cell: Cell, value: CellValue): void {
    if (!this._cells.has(cell.id)) {
      throw new Error(`Cell with id '${cell.id}' does not exist`)
    }

    const change = new ValueChange(cell, value)
    this.execute(change)
  }

  execute(change: Change): void {
    if (this._updateLevel > 0) {
      // We're in an update transaction, collect changes
      this._currentChanges.push(change)
    } else {
      // Execute immediately - note: Change.execute needs to actually update the model
      // For now, we'll need to manually apply changes
      // In a real implementation, the Change classes would interact with the model directly
      if (change instanceof GeometryChange) {
        const originalCell = (change as any).cell
        const updatedCell = this._cells.get(originalCell.id)?.with({ geometry: (change as any).newGeometry })
        if (updatedCell) {
          this._cells.set(updatedCell.id, updatedCell)
        }
      } else if (change instanceof StyleChange) {
        const originalCell = (change as any).cell
        const updatedCell = this._cells.get(originalCell.id)?.with({ style: (change as any).newStyle })
        if (updatedCell) {
          this._cells.set(updatedCell.id, updatedCell)
        }
      } else if (change instanceof ValueChange) {
        const originalCell = (change as any).cell
        const updatedCell = this._cells.get(originalCell.id)?.with({ value: (change as any).newValue })
        if (updatedCell) {
          this._cells.set(updatedCell.id, updatedCell)
        }
      } else if (change instanceof ChildChange) {
        // This is handled by addCell method
      } else if (change instanceof RemoveChange) {
        // This is handled by removeCell method
      } else {
        change.execute(this)
      }
    }
  }

  beginUpdate(): void {
    this._updateLevel++
  }

  endUpdate(): void {
    if (this._updateLevel === 0) {
      throw new Error('endUpdate called without matching beginUpdate')
    }

    this._updateLevel--

    if (this._updateLevel === 0 && this._currentChanges.length > 0) {
      // Execute all collected changes
      const compositeChange = new CompositeChange([...this._currentChanges])
      this._currentChanges = []
      compositeChange.execute(this)
    }
  }

  /**
   * Internal method to update a cell in the model
   */
  private _updateCell(cell: Cell): void {
    this._cells.set(cell.id, cell)

    // Update parent-child relationships if needed
    for (const child of cell.children) {
      if (child.parent !== cell) {
        const updatedChild = child.with({ parent: cell })
        this._cells.set(updatedChild.id, updatedChild)
      }
    }
  }

  /**
   * Create a new cell with a unique ID
   */
  createCell(params: {
    value?: CellValue
    geometry?: Geometry | null
    style?: CellStyle
    parent?: Cell
    type?: 'vertex' | 'edge'
  }): Cell {
    const id = this._generateId()
    const type = params.type ?? 'vertex'

    const cell = CellImpl[type]({
      id,
      value: params.value,
      geometry: params.geometry,
      style: params.style,
      parent: params.parent ?? this._root,
    })

    return cell
  }

  /**
   * Get all cells of the specified type
   */
  getCellsByType(type: 'vertex' | 'edge'): readonly Cell[] {
    return Array.from(this._cells.values()).filter(cell => cell.type === type)
  }

  /**
   * Get all descendant cells of a parent
   */
  getDescendants(parent: Cell): readonly Cell[] {
    const descendants: Cell[] = []
    const parentFromModel = this._cells.get(parent.id)
    if (!parentFromModel) return descendants

    for (const child of parentFromModel.children) {
      descendants.push(child)
      descendants.push(...this.getDescendants(child))
    }
    return descendants
  }

  /**
   * Get the bounds of all cells in the model
   */
  getModelBounds(): { x: number; y: number; width: number; height: number } | null {
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    for (const cell of this._cells.values()) {
      if (cell.geometry) {
        const geom = cell.geometry
        minX = Math.min(minX, geom.x)
        minY = Math.min(minY, geom.y)
        maxX = Math.max(maxX, geom.x + geom.width)
        maxY = Math.max(maxY, geom.y + geom.height)
      }
    }

    if (minX === Infinity) {
      return null
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    }
  }

  /**
   * Clone the model
   */
  clone(): GraphModel {
    const newModel = new GraphModel()

    // Clone all cells
    const cellMap = new Map<string, Cell>()

    // First pass: clone all cells without relationships
    for (const cell of this._cells.values()) {
      const clonedCell = new CellImpl({
        id: cell.id,
        type: cell.type,
        value: cell.value,
        geometry: cell.geometry,
        style: cell.style,
        parent: null, // Will set in second pass
        children: [], // Will set in second pass
        source: null, // Will set in second pass
        target: null, // Will set in second pass
        connectable: cell.connectable,
        visible: cell.visible,
        collapsed: cell.collapsed,
      })
      cellMap.set(cell.id, clonedCell)
    }

    // Second pass: restore relationships
    for (const [id, cell] of this._cells.entries()) {
      let clonedCell = cellMap.get(id)!

      // Set parent
      if (cell.parent) {
        clonedCell = clonedCell.with({ parent: cellMap.get(cell.parent.id) })
        cellMap.set(id, clonedCell)
      }

      // Set children
      const clonedChildren = cell.children.map(child => cellMap.get(child.id)!).filter(Boolean)
      if (clonedChildren.length > 0) {
        clonedCell = clonedCell.with({ children: clonedChildren })
        cellMap.set(id, clonedCell)
      }

      // Set source and target for edges
      if (cell.source) {
        clonedCell = clonedCell.with({ source: cellMap.get(cell.source.id)! })
        cellMap.set(id, clonedCell)
      }
      if (cell.target) {
        clonedCell = clonedCell.with({ target: cellMap.get(cell.target.id)! })
        cellMap.set(id, clonedCell)
      }
    }

    // Update the new model's cells
    for (const [id, cell] of cellMap) {
      newModel._cells.set(id, cell)
    }

    newModel._root = cellMap.get(this._root.id)!

    return newModel
  }

  /**
   * Generate a unique cell ID
   */
  private _generateId(): string {
    let id: string
    do {
      id = `cell-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    } while (this._cells.has(id))
    return id
  }

  /**
   * Execute a transaction with automatic beginUpdate/endUpdate
   */
  transaction<T>(fn: () => T): T {
    this.beginUpdate()
    try {
      return fn()
    } finally {
      this.endUpdate()
    }
  }
}