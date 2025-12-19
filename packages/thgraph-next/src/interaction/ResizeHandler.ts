import { EventEmitter } from './EventEmitter'
import type { GraphView } from '../view/GraphView'
import type { Cell, Geometry, Point, Rectangle } from '../types'

/**
 * Resize handle positions
 */
export enum ResizeHandle {
  TOP_LEFT = 'top-left',
  TOP = 'top',
  TOP_RIGHT = 'top-right',
  RIGHT = 'right',
  BOTTOM_RIGHT = 'bottom-right',
  BOTTOM = 'bottom',
  BOTTOM_LEFT = 'bottom-left',
  LEFT = 'left'
}

/**
 * Resize handler for cells with control points
 */
export class ResizeHandler extends EventEmitter {
  private _view: GraphView
  private _container: HTMLElement | null = null
  private _isEnabled = true

  // Resize state
  private _isResizing = false
  private _resizeCell: Cell | null = null
  private _resizeHandle: ResizeHandle | null = null
  private _originalGeometry: Geometry | null = null
  private _startPoint: Point = { x: 0, y: 0 }
  private _minSize = { width: 20, height: 20 }
  private _gridEnabled = true

  // Handle elements
  private _handlesContainer: HTMLDivElement | null = null
  private _handles: Map<ResizeHandle, HTMLDivElement> = new Map()
  private _handleSize = 8

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
      this.stopResize()
      this.hideHandles()
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
    this.createHandlesContainer()
  }

  /**
   * Get handle size in pixels
   */
  get handleSize(): number {
    return this._handleSize
  }

  /**
   * Set handle size in pixels
   */
  setHandleSize(size: number): void {
    this._handleSize = Math.max(4, size)
  }

  /**
   * Get minimum size for resizing
   */
  get minSize(): { width: number; height: number } {
    return { ...this._minSize }
  }

  /**
   * Set minimum size for resizing
   */
  setMinSize(width: number, height: number): void {
    this._minSize = {
      width: Math.max(1, width),
      height: Math.max(1, height)
    }
  }

  /**
   * Check if grid snapping is enabled for resizing
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
   * Check if currently resizing
   */
  get isResizing(): boolean {
    return this._isResizing
  }

  /**
   * Get the cell being resized
   */
  get resizeCell(): Cell | null {
    return this._resizeCell
  }

  /**
   * Get the active resize handle
   */
  get activeHandle(): ResizeHandle | null {
    return this._resizeHandle
  }

  /**
   * Show resize handles for a cell
   */
  showHandles(cell: Cell): void {
    if (!this._isEnabled || !this._container) return

    // Only show handles for vertices
    if (!cell.isVertex()) return

    this.hideHandles()
    this._resizeCell = cell

    const screenBounds = this._view.getCellScreenBounds(cell)
    if (!screenBounds) return

    this.createHandles()
    this.updateHandlesPosition(screenBounds)
    this._handlesContainer!.style.display = 'block'

    this.emit('handles:show', { cell })
  }

  /**
   * Hide resize handles
   */
  hideHandles(): void {
    if (this._handlesContainer) {
      this._handlesContainer.style.display = 'none'
    }

    this._resizeCell = null
    this.emit('handles:hide', {})
  }

  /**
   * Check if handles are visible
   */
  get isHandlesVisible(): boolean {
    return this._resizeCell !== null
  }

  /**
   * Get resize handle at the given point
   */
  getHandleAt(point: Point): ResizeHandle | null {
    if (!this._handlesContainer) return null

    for (const [handle, element] of this._handles) {
      const rect = element.getBoundingClientRect()
      const containerRect = this._container!.getBoundingClientRect()

      const handleBounds = {
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top,
        width: rect.width,
        height: rect.height
      }

      if (
        point.x >= handleBounds.x &&
        point.x <= handleBounds.x + handleBounds.width &&
        point.y >= handleBounds.y &&
        point.y <= handleBounds.y + handleBounds.height
      ) {
        return handle
      }
    }

    return null
  }

  /**
   * Start resizing a cell with the given handle
   */
  startResize(cell: Cell, handle: ResizeHandle, startPoint: Point): void {
    if (!this._isEnabled || this._isResizing) return

    const geometry = cell.geometry
    if (!geometry) return

    this._isResizing = true
    this._resizeCell = cell
    this._resizeHandle = handle
    this._originalGeometry = geometry
    this._startPoint = { ...startPoint }

    this.emit('resize:start', {
      cell,
      handle,
      point: startPoint,
      geometry
    })
  }

  /**
   * Resize to the given point
   */
  resizeTo(point: Point): void {
    if (!this._isEnabled || !this._isResizing || !this._resizeCell || !this._originalGeometry) return

    // Convert to graph coordinates
    const graphPoint = this._view.screenToGraph(point.x, point.y)

    // Apply grid snapping if enabled
    const snappedPoint = this._gridEnabled
      ? this._view.snapToGrid(graphPoint)
      : graphPoint

    // Calculate new geometry based on handle
    const newGeometry = this.calculateNewGeometry(
      this._originalGeometry,
      this._resizeHandle!,
      snappedPoint
    )

    // Update handles position
    const screenBounds = this._view.getCellScreenBounds(this._resizeCell)
    if (screenBounds) {
      this.updateHandlesPosition(screenBounds)
    }

    this.emit('resize:move', {
      cell: this._resizeCell,
      handle: this._resizeHandle,
      point,
      oldGeometry: this._originalGeometry,
      newGeometry
    })
  }

  /**
   * Stop resizing and optionally apply changes
   */
  stopResize(apply = true): void {
    if (!this._isResizing || !this._resizeCell || !this._originalGeometry) return

    const cell = this._resizeCell
    const handle = this._resizeHandle
    const finalGeometry = apply
      ? this.calculateNewGeometry(
          this._originalGeometry,
          handle,
          this._startPoint
        )
      : this._originalGeometry

    this._isResizing = false
    this._resizeCell = null
    this._resizeHandle = null
    this._originalGeometry = null

    this.emit('resize:end', {
      cell,
      handle,
      oldGeometry: this._originalGeometry,
      newGeometry: finalGeometry,
      applied: apply
    })
  }

  /**
   * Check if a cell can be resized
   */
  isCellResizable(cell: Cell): boolean {
    // Only vertices can be resized
    if (!cell.isVertex()) return false

    // Cannot resize locked or invisible cells
    if (!cell.visible || !cell.connectable) return false

    const geometry = cell.geometry
    if (!geometry) return false

    // Cannot resize if width or height is 0
    if (geometry.width <= 0 || geometry.height <= 0) return false

    return true
  }

  /**
   * Create handles container
   */
  private createHandlesContainer(): void {
    if (!this._container) return

    this._handlesContainer = document.createElement('div')
    this._handlesContainer.style.position = 'absolute'
    this._handlesContainer.style.pointerEvents = 'none'
    this._handlesContainer.style.zIndex = '1002'
    this._handlesContainer.style.display = 'none'

    this._container.appendChild(this._handlesContainer)
  }

  /**
   * Create all handle elements
   */
  private createHandles(): void {
    if (!this._handlesContainer) return

    // Clear existing handles
    this._handles.clear()
    this._handlesContainer.innerHTML = ''

    // Create handles for each position
    Object.values(ResizeHandle).forEach(handle => {
      const element = document.createElement('div')
      element.style.position = 'absolute'
      element.style.width = `${this._handleSize}px`
      element.style.height = `${this._handleSize}px`
      element.style.backgroundColor = '#fff'
      element.style.border = '1px solid #007bff'
      element.style.pointerEvents = 'auto'
      element.style.cursor = this.getCursorForHandle(handle)
      element.dataset.handle = handle

      this._handlesContainer!.appendChild(element)
      this._handles.set(handle, element)
    })
  }

  /**
   * Update handles position based on cell bounds
   */
  private updateHandlesPosition(bounds: Rectangle): void {
    this._handles.forEach((element, handle) => {
      const position = this.getHandlePosition(handle, bounds)
      element.style.left = `${position.x - this._handleSize / 2}px`
      element.style.top = `${position.y - this._handleSize / 2}px`
    })
  }

  /**
   * Get position for a specific handle
   */
  private getHandlePosition(handle: ResizeHandle, bounds: Rectangle): Point {
    const halfHandle = this._handleSize / 2

    switch (handle) {
      case ResizeHandle.TOP_LEFT:
        return { x: bounds.x, y: bounds.y }
      case ResizeHandle.TOP:
        return { x: bounds.x + bounds.width / 2, y: bounds.y }
      case ResizeHandle.TOP_RIGHT:
        return { x: bounds.x + bounds.width, y: bounds.y }
      case ResizeHandle.RIGHT:
        return { x: bounds.x + bounds.width, y: bounds.y + bounds.height / 2 }
      case ResizeHandle.BOTTOM_RIGHT:
        return { x: bounds.x + bounds.width, y: bounds.y + bounds.height }
      case ResizeHandle.BOTTOM:
        return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height }
      case ResizeHandle.BOTTOM_LEFT:
        return { x: bounds.x, y: bounds.y + bounds.height }
      case ResizeHandle.LEFT:
        return { x: bounds.x, y: bounds.y + bounds.height / 2 }
      default:
        return { x: bounds.x, y: bounds.y }
    }
  }

  /**
   * Get cursor for a specific handle
   */
  private getCursorForHandle(handle: ResizeHandle): string {
    switch (handle) {
      case ResizeHandle.TOP_LEFT:
      case ResizeHandle.BOTTOM_RIGHT:
        return 'nw-resize'
      case ResizeHandle.TOP:
      case ResizeHandle.BOTTOM:
        return 'ns-resize'
      case ResizeHandle.TOP_RIGHT:
      case ResizeHandle.BOTTOM_LEFT:
        return 'ne-resize'
      case ResizeHandle.LEFT:
      case ResizeHandle.RIGHT:
        return 'ew-resize'
      default:
        return 'default'
    }
  }

  /**
   * Calculate new geometry based on handle and point
   */
  private calculateNewGeometry(
    original: Geometry,
    handle: ResizeHandle,
    point: Point
  ): Geometry {
    let newX = original.x
    let newY = original.y
    let newWidth = original.width
    let newHeight = original.height

    switch (handle) {
      case ResizeHandle.TOP_LEFT:
        newX = point.x
        newY = point.y
        newWidth = original.x + original.width - point.x
        newHeight = original.y + original.height - point.y
        break

      case ResizeHandle.TOP:
        newY = point.y
        newHeight = original.y + original.height - point.y
        break

      case ResizeHandle.TOP_RIGHT:
        newY = point.y
        newWidth = point.x - original.x
        newHeight = original.y + original.height - point.y
        break

      case ResizeHandle.RIGHT:
        newWidth = point.x - original.x
        break

      case ResizeHandle.BOTTOM_RIGHT:
        newWidth = point.x - original.x
        newHeight = point.y - original.y
        break

      case ResizeHandle.BOTTOM:
        newHeight = point.y - original.y
        break

      case ResizeHandle.BOTTOM_LEFT:
        newX = point.x
        newWidth = original.x + original.width - point.x
        newHeight = point.y - original.y
        break

      case ResizeHandle.LEFT:
        newX = point.x
        newWidth = original.x + original.width - point.x
        break
    }

    // Apply minimum size constraints
    if (newWidth < this._minSize.width) {
      newWidth = this._minSize.width
      if (handle === ResizeHandle.TOP_LEFT || handle === ResizeHandle.BOTTOM_LEFT || handle === ResizeHandle.LEFT) {
        newX = original.x + original.width - newWidth
      }
    }

    if (newHeight < this._minSize.height) {
      newHeight = this._minSize.height
      if (handle === ResizeHandle.TOP_LEFT || handle === ResizeHandle.TOP || handle === ResizeHandle.TOP_RIGHT) {
        newY = original.y + original.height - newHeight
      }
    }

    return {
      ...original,
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight
    }
  }

  /**
   * Dispose the handler
   */
  dispose(): void {
    this.stopResize(false)
    this.hideHandles()

    if (this._handlesContainer && this._handlesContainer.parentNode) {
      this._handlesContainer.parentNode.removeChild(this._handlesContainer)
    }

    this._handles.clear()
    this._handlesContainer = null
    this.removeAllListeners()
    this._container = null
    this._isEnabled = false
  }
}