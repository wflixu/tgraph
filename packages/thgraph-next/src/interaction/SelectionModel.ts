import { EventEmitter } from './EventEmitter'
import type { Cell } from '../types'

/**
 * Selection model for managing cell selection state
 */
export class SelectionModel extends EventEmitter {
  private _selection = new Set<string>()
  private _cells = new Map<string, Cell>()
  private _singleSelection = false

  constructor(singleSelection = false) {
    super()
    this._singleSelection = singleSelection
  }

  /**
   * Get current selection as readonly array of cells
   */
  get selection(): readonly Cell[] {
    return Array.from(this._selection)
      .map(id => this._cells.get(id))
      .filter((cell): cell is Cell => cell !== undefined)
  }

  /**
   * Check if a cell is selected
   */
  isSelected(cell: Cell): boolean {
    return this._selection.has(cell.id)
  }

  /**
   * Check if selection is empty
   */
  isEmpty(): boolean {
    return this._selection.size === 0
  }

  /**
   * Get number of selected cells
   */
  size(): number {
    return this._selection.size
  }

  /**
   * Get the first selected cell (primary selection)
   */
  getCell(): Cell | undefined {
    if (this._selection.size === 0) return undefined
    const firstId = this._selection.values().next().value
    return this._cells.get(firstId)
  }

  /**
   * Select a cell (with optional add to selection)
   */
  selectCell(cell: Cell, add = false): void {
    if (this._singleSelection) {
      this.setCell(cell)
      return
    }

    const wasSelected = this._selection.has(cell.id)
    const added: Cell[] = []
    const removed: Cell[] = []

    if (!add) {
      // Clear existing selection
      const currentSelection = this.selection
      currentSelection.forEach(c => {
        if (c.id !== cell.id) {
          this._selection.delete(c.id)
          removed.push(c)
        }
      })
    }

    // Add the new cell
    if (!wasSelected) {
      this._selection.add(cell.id)
      this._cells.set(cell.id, cell)
      added.push(cell)
    }

    // Emit selection changed event
    if (added.length > 0 || removed.length > 0) {
      this.emit('selection:changed', {
        added,
        removed,
        selection: this.selection
      })
    }
  }

  /**
   * Set single cell selection (clearing all others)
   */
  setCell(cell: Cell): void {
    const currentSelection = this.selection
    const removed: Cell[] = []
    const added: Cell[] = []

    // Clear existing selection
    currentSelection.forEach(c => {
      if (c.id !== cell.id) {
        this._selection.delete(c.id)
        removed.push(c)
      }
    })

    // Add new cell if not already selected
    if (!this._selection.has(cell.id)) {
      this._selection.add(cell.id)
      this._cells.set(cell.id, cell)
      added.push(cell)
    }

    // Emit event if selection changed
    if (added.length > 0 || removed.length > 0) {
      this.emit('selection:changed', {
        added,
        removed,
        selection: this.selection
      })
    }
  }

  /**
   * Select multiple cells
   */
  selectCells(cells: readonly Cell[]): void {
    if (this._singleSelection && cells.length > 0) {
      this.setCell(cells[0])
      return
    }

    const added: Cell[] = []
    const removed: Cell[] = []

    // Clear existing selection
    const currentSelection = this.selection
    currentSelection.forEach(c => {
      this._selection.delete(c.id)
      if (!cells.find(cell => cell.id === c.id)) {
        removed.push(c)
      }
    })

    // Add new cells
    cells.forEach(cell => {
      if (!this._selection.has(cell.id)) {
        this._selection.add(cell.id)
        this._cells.set(cell.id, cell)
        added.push(cell)
      }
    })

    // Emit event if selection changed
    if (added.length > 0 || removed.length > 0) {
      this.emit('selection:changed', {
        added,
        removed,
        selection: this.selection
      })
    }
  }

  /**
   * Deselect a cell
   */
  deselectCell(cell: Cell): void {
    if (this._selection.has(cell.id)) {
      this._selection.delete(cell.id)
      this.emit('selection:changed', {
        added: [],
        removed: [cell],
        selection: this.selection
      })
    }
  }

  /**
   * Deselect multiple cells
   */
  deselectCells(cells: readonly Cell[]): void {
    const removed: Cell[] = []

    cells.forEach(cell => {
      if (this._selection.has(cell.id)) {
        this._selection.delete(cell.id)
        removed.push(cell)
      }
    })

    // Emit event if selection changed
    if (removed.length > 0) {
      this.emit('selection:changed', {
        added: [],
        removed,
        selection: this.selection
      })
    }
  }

  /**
   * Toggle cell selection
   */
  toggleCell(cell: Cell): void {
    if (this.isSelected(cell)) {
      this.deselectCell(cell)
    } else {
      this.selectCell(cell, true)
    }
  }

  /**
   * Clear all selection
   */
  clearSelection(): void {
    if (this._selection.size > 0) {
      const currentSelection = this.selection
      this._selection.clear()

      this.emit('selection:changed', {
        added: [],
        removed: currentSelection,
        selection: this.selection
      })
    }
  }

  /**
   * Select all cells in the model
   */
  selectAll(cells: Iterable<Cell>): void {
    if (this._singleSelection) {
      const firstCell = cells[Symbol.iterator]().next().value
      if (firstCell) {
        this.setCell(firstCell)
      }
      return
    }

    const cellArray = Array.from(cells)
    this.selectCells(cellArray)
  }

  /**
   * Check if cell is selectable (can be overridden)
   */
  isSelectable(cell: Cell): boolean {
    return cell.visible && cell.connectable
  }

  /**
   * Get cells in a rectangle area
   */
  getCellsInArea(
    cells: Iterable<Cell>,
    x: number,
    y: number,
    width: number,
    height: number
  ): Cell[] {
    const result: Cell[] = []

    for (const cell of cells) {
      if (this.isSelectable(cell)) {
        const geometry = cell.geometry
        if (geometry && this.isRectangleIntersecting(
          geometry.x, geometry.y, geometry.width, geometry.height,
          x, y, width, height
        )) {
          result.push(cell)
        }
      }
    }

    return result
  }

  /**
   * Check if two rectangles intersect
   */
  private isRectangleIntersecting(
    x1: number, y1: number, w1: number, h1: number,
    x2: number, y2: number, w2: number, h2: number
  ): boolean {
    return !(
      x1 + w1 < x2 || x2 + w2 < x1 ||
      y1 + h1 < y2 || y2 + h2 < y1
    )
  }

  /**
   * Dispose the selection model
   */
  dispose(): void {
    this.removeAllListeners()
    this._selection.clear()
    this._cells.clear()
  }
}