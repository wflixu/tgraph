import type { GraphModel, Change, Cell, Geometry, CellStyle, CellValue } from '../types/index.js'

/**
 * Base class for all changes in the graph model
 */
export abstract class BaseChange implements Change {
  abstract readonly cell: Cell
  abstract execute(model: GraphModel): void
  abstract undo(model: GraphModel): void
}

/**
 * Change for setting cell geometry
 */
export class GeometryChange extends BaseChange {
  readonly cell: Cell
  private readonly oldGeometry: Geometry | null
  private readonly newGeometry: Geometry | null

  constructor(cell: Cell, newGeometry: Geometry | null) {
    super()
    this.cell = cell
    this.oldGeometry = cell.geometry
    this.newGeometry = newGeometry
  }

  execute(model: GraphModel): void {
    // The model should handle updating the cell
    // This is a simplified implementation
    // In a real implementation, the model would manage cell updates
    const updatedCell = this.cell.with({ geometry: this.newGeometry })
    // model.setCell(updatedCell)
  }

  undo(model: GraphModel): void {
    const updatedCell = this.cell.with({ geometry: this.oldGeometry })
    // model.setCell(updatedCell)
  }
}

/**
 * Change for setting cell style
 */
export class StyleChange extends BaseChange {
  readonly cell: Cell
  private readonly oldStyle: CellStyle
  private readonly newStyle: CellStyle

  constructor(cell: Cell, newStyle: CellStyle) {
    super()
    this.cell = cell
    this.oldStyle = cell.style
    this.newStyle = { ...newStyle }
  }

  execute(model: GraphModel): void {
    const updatedCell = this.cell.with({ style: this.newStyle })
    // model.setCell(updatedCell)
  }

  undo(model: GraphModel): void {
    const updatedCell = this.cell.with({ style: this.oldStyle })
    // model.setCell(updatedCell)
  }
}

/**
 * Change for setting cell value
 */
export class ValueChange extends BaseChange {
  readonly cell: Cell
  private readonly oldValue: CellValue
  private readonly newValue: CellValue

  constructor(cell: Cell, newValue: CellValue) {
    super()
    this.cell = cell
    this.oldValue = cell.value
    this.newValue = newValue
  }

  execute(model: GraphModel): void {
    const updatedCell = this.cell.with({ value: this.newValue })
    // model.setCell(updatedCell)
  }

  undo(model: GraphModel): void {
    const updatedCell = this.cell.with({ value: this.oldValue })
    // model.setCell(updatedCell)
  }
}

/**
 * Change for adding a child cell to a parent
 */
export class ChildChange extends BaseChange {
  readonly cell: Cell
  private readonly parent: Cell | null
  private readonly index: number
  private readonly isAdd: boolean

  constructor(parent: Cell | null, child: Cell, index?: number) {
    super()
    this.cell = child
    this.parent = parent
    this.index = index ?? (parent?.children.length ?? 0)
    this.isAdd = true
  }

  execute(model: GraphModel): void {
    if (this.isAdd && this.parent) {
      const updatedParent = this.parent.with({
        children: [
          ...this.parent.children.slice(0, this.index),
          this.cell,
          ...this.parent.children.slice(this.index),
        ],
      })
      // model.setCell(updatedParent)

      const updatedChild = this.cell.with({ parent: this.parent })
      // model.setCell(updatedChild)
    }
  }

  undo(model: GraphModel): void {
    if (this.isAdd && this.parent) {
      const updatedParent = this.parent.with({
        children: this.parent.children.filter(c => c !== this.cell),
      })
      // model.setCell(updatedParent)

      const updatedChild = this.cell.with({ parent: null })
      // model.setCell(updatedChild)
    }
  }
}

/**
 * Change for removing a cell from the model
 */
export class RemoveChange extends BaseChange {
  readonly cell: Cell
  private readonly parent: Cell | null

  constructor(cell: Cell) {
    super()
    this.cell = cell
    this.parent = cell.parent
  }

  execute(model: GraphModel): void {
    if (this.parent) {
      const updatedParent = this.parent.with({
        children: this.parent.children.filter(c => c !== this.cell),
      })
      // model.setCell(updatedParent)
    }
    // model.removeCell(this.cell)
  }

  undo(model: GraphModel): void {
    if (this.parent) {
      const updatedParent = this.parent.with({
        children: [...this.parent.children, this.cell],
      })
      // model.setCell(updatedParent)
    }
    // model.addCell(this.cell, this.parent)
  }
}

/**
 * Composite change for multiple changes
 */
export class CompositeChange extends BaseChange {
  readonly cell: Cell
  private readonly changes: Change[]

  constructor(changes: Change[]) {
    super()
    if (changes.length === 0) {
      throw new Error('CompositeChange requires at least one change')
    }
    this.changes = [...changes]
    // Use the first change's cell as representative
    this.cell = changes[0].cell
  }

  execute(model: GraphModel): void {
    for (const change of this.changes) {
      change.execute(model)
    }
  }

  undo(model: GraphModel): void {
    // Undo in reverse order
    for (let i = this.changes.length - 1; i >= 0; i--) {
      this.changes[i].undo(model)
    }
  }

  isEmpty(): boolean {
    return this.changes.length === 0
  }
}