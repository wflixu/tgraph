import { EventEmitter } from './EventEmitter'
import type { GraphView } from '../view/GraphView'
import type { Cell, Geometry, Point } from '../types'

/**
 * Drag handler for moving cells
 */
export class DragHandler extends EventEmitter {
  private _view: GraphView
  private _container: HTMLElement | null = null
  private _isEnabled = true

  // Drag state
  private _isDragging = false
  private _dragCells: Cell[] = []
  private _dragGeometries: Map<Cell, Geometry> = new Map()
  private _startPoint: Point = { x: 0, y: 0 }
  private _dragOffset: Point = { x: 0, y: 0 }
  private _gridEnabled = true
  private _dragPreview: HTMLDivElement | null = null

  // Drag constraints
  private _dragBounds: { minX?: number; minY?: number; maxX?: number; maxY?: number } = {}

  constructor(view: GraphView) {
    super()
    this._view = view
  }

  /**
   * Get the enabled state
   */
  get isEnabled(): boolean {
    return this._isEnabled
  }

  /**
   * Enable or disable the handler
   */
  setEnabled(enabled: boolean): void {
    this._isEnabled = enabled
    if (!enabled) {
      this.stopDrag()
    }
  }

  /**
   * Get the container element
   */
  get container(): HTMLElement | null {
    return this._container
  }

  /**
   * Set the container element
   */
  setContainer(container: HTMLElement): void {
    this._container = container
  }

  /**
   * Check if grid snapping is enabled for dragging
   */
  get isGridEnabled(): boolean {
    return this._gridEnabled
  }

  /**
   * Enable or disable grid snapping
   */
  setGridEnabled(enabled: boolean): void {
    this._gridEnabled = enabled
  }

  /**
   * Get drag bounds
   */
  get dragBounds(): { minX?: number; minY?: number; maxX?: number; maxY?: number } {
    return { ...this._dragBounds }
  }

  /**
   * Set drag bounds to constrain dragging
   */
  setDragBounds(bounds: { minX?: number; minY?: number; maxX?: number; maxY?: number }): void {
    this._dragBounds = { ...bounds }
  }

  /**
   * Check if currently dragging
   */
  get isDragging(): boolean {
    return this._isDragging
  }

  /**
   * Get the cells being dragged
   */
  get dragCells(): readonly Cell[] {
    return this._dragCells
  }

  /**
   * Start dragging cells
   */
  startDrag(cells: Cell[], startPoint: Point): void {
    if (!this._isEnabled || this._isDragging || cells.length === 0) return

    // Filter cells that can be moved
    this._dragCells = cells.filter(cell => this.isCellDraggable(cell))
    if (this._dragCells.length === 0) return

    this._isDragging = true
    this._startPoint = { ...startPoint }

    // Store original geometries
    this._dragGeometries.clear()
    this._dragCells.forEach(cell => {
      const geometry = this._view.model.getGeometry(cell)
      if (geometry) {
        this._dragGeometries.set(cell, geometry)
      }
    })

    // Calculate offset from first cell's top-left
    if (this._dragCells.length > 0) {
      const firstCell = this._dragCells[0]
      const geometry = this._dragGeometries.get(firstCell)
      if (geometry) {
        const absoluteGeometry = this._view.getCellAbsoluteGeometry(firstCell)
        const screenPoint = this._view.graphToScreen(
          absoluteGeometry.x,
          absoluteGeometry.y
        )
        this._dragOffset = {
          x: startPoint.x - screenPoint.x,
          y: startPoint.y - screenPoint.y
        }
      }
    }

    // Create drag preview
    this.createDragPreview()

    this.emit('drag:start', {
      cells: this._dragCells,
      point: startPoint
    })
  }

  /**
   * Drag to the given point
   */
  dragTo(point: Point): void {
    if (!this._isEnabled || !this._isDragging) return

    // Apply offset to get the actual position
    const adjustedPoint = {
      x: point.x - this._dragOffset.x,
      y: point.y - this._dragOffset.y
    }

    // Convert to graph coordinates
    const graphPoint = this._view.screenToGraph(adjustedPoint.x, adjustedPoint.y)

    // Apply grid snapping if enabled
    const snappedPoint = this._gridEnabled
      ? this._view.snapToGrid(graphPoint)
      : graphPoint

    // Calculate delta from start position
    const deltaX = snappedPoint.x - this._startPoint.x
    const deltaY = snappedPoint.y - this._startPoint.y

    // Update drag preview
    this.updateDragPreview(deltaX, deltaY)

    this.emit('drag:move', {
      cells: this._dragCells,
      point,
      delta: { x: deltaX, y: deltaY }
    })
  }

  /**
   * Stop dragging and optionally apply changes
   */
  stopDrag(apply = true): void {
    if (!this._isDragging) return

    this._isDragging = false

    // Calculate final delta
    const deltaX = this._dragOffset.x
    const deltaY = this._dragOffset.y

    // Remove drag preview
    this.removeDragPreview()

    // Apply changes if requested
    if (apply && this._dragCells.length > 0) {
      const finalGeometries = new Map<Cell, Geometry>()

      this._dragCells.forEach(cell => {
        const originalGeometry = this._dragGeometries.get(cell)
        if (originalGeometry) {
          const newGeometry = {
            ...originalGeometry,
            x: originalGeometry.x + deltaX,
            y: originalGeometry.y + deltaY
          }

          // Apply bounds constraints
          if (this._dragBounds.minX !== undefined) {
            newGeometry.x = Math.max(this._dragBounds.minX, newGeometry.x)
          }
          if (this._dragBounds.minY !== undefined) {
            newGeometry.y = Math.max(this._dragBounds.minY, newGeometry.y)
          }
          if (this._dragBounds.maxX !== undefined) {
            newGeometry.x = Math.min(this._dragBounds.maxX - newGeometry.width, newGeometry.x)
          }
          if (this._dragBounds.maxY !== undefined) {
            newGeometry.y = Math.min(this._dragBounds.maxY - newGeometry.height, newGeometry.y)
          }

          finalGeometries.set(cell, newGeometry)
        }
      })

      this.emit('drag:end', {
        cells: this._dragCells,
        geometries: finalGeometries,
        applied: true
      })
    } else {
      this.emit('drag:end', {
        cells: this._dragCells,
        geometries: new Map(),
        applied: false
      })
    }

    // Clean up
    this._dragCells = []
    this._dragGeometries.clear()
    this._startPoint = { x: 0, y: 0 }
    this._dragOffset = { x: 0, y: 0 }
  }

  /**
   * Check if a cell can be dragged
   */
  isCellDraggable(cell: Cell): boolean {
    // Cannot drag edges in this simple implementation
    if (cell.isEdge()) return false

    // Cannot drag locked or invisible cells
    if (!cell.visible || !cell.connectable) return false

    // Cannot drag root cell
    if (!cell.parent || cell.parent.id === '0') return false

    return true
  }

  /**
   * Create drag preview element
   */
  private createDragPreview(): void {
    if (!this._container || this._dragCells.length === 0) return

    this._dragPreview = document.createElement('div')
    this._dragPreview.style.position = 'absolute'
    this._dragPreview.style.pointerEvents = 'none'
    this._dragPreview.style.zIndex = '1001'
    this._dragPreview.style.opacity = '0.7'
    this._dragPreview.style.border = '1px solid #007bff'

    // Set initial size and position
    const bounds = this.getDragBounds()
    this._dragPreview.style.left = `${bounds.x}px`
    this._dragPreview.style.top = `${bounds.y}px`
    this._dragPreview.style.width = `${bounds.width}px`
    this._dragPreview.style.height = `${bounds.height}px`

    this._container.appendChild(this._dragPreview)
  }

  /**
   * Update drag preview position
   */
  private updateDragPreview(deltaX: number, deltaY: number): void {
    if (!this._dragPreview) return

    const bounds = this.getDragBounds()
    const deltaXScreen = deltaX * this._view.viewState.scale
    const deltaYScreen = deltaY * this._view.viewState.scale

    this._dragPreview.style.left = `${bounds.x + deltaXScreen}px`
    this._dragPreview.style.top = `${bounds.y + deltaYScreen}px`
  }

  /**
   * Remove drag preview element
   */
  private removeDragPreview(): void {
    if (this._dragPreview && this._dragPreview.parentNode) {
      this._dragPreview.parentNode.removeChild(this._dragPreview)
    }
    this._dragPreview = null
  }

  /**
   * Get combined bounds of all drag cells
   */
  private getDragBounds(): { x: number; y: number; width: number; height: number } {
    let minX = Infinity, minY = Infinity
    let maxX = -Infinity, maxY = -Infinity

    this._dragCells.forEach(cell => {
      const screenBounds = this._view.getCellScreenBounds(cell)
      if (screenBounds) {
        minX = Math.min(minX, screenBounds.x)
        minY = Math.min(minY, screenBounds.y)
        maxX = Math.max(maxX, screenBounds.x + screenBounds.width)
        maxY = Math.max(maxY, screenBounds.y + screenBounds.height)
      }
    })

    return {
      x: minX === Infinity ? 0 : minX,
      y: minY === Infinity ? 0 : minY,
      width: maxX === -Infinity ? 0 : maxX - minX,
      height: maxY === -Infinity ? 0 : maxY - minY
    }
  }

  /**
   * Dispose the handler
   */
  dispose(): void {
    this.stopDrag(false)
    this.removeAllListeners()
    this._container = null
    this._isEnabled = false
  }
}