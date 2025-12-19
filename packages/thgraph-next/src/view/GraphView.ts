import type { Cell, Geometry, Point, Rectangle } from '../types'
import type { GraphModel } from '../model/GraphModel'

/**
 * View state interface for tracking viewport and transformations
 */
export interface ViewState {
  /**
   * Current translation (pan)
   */
  translate: Point

  /**
   * Current scale (zoom)
   */
  scale: number

  /**
   * Viewport bounds
   */
  viewport: Rectangle

  /**
   * Whether to show the grid
   */
  gridEnabled: boolean

  /**
   * Grid size
   */
  gridSize: number
}

/**
 * GraphView manages coordinate transformations and viewport state
 */
export class GraphView {
  private _viewState: ViewState
  private _model: GraphModel

  constructor(model: GraphModel) {
    this._model = model
    this._viewState = {
      translate: { x: 0, y: 0 },
      scale: 1,
      viewport: { x: 0, y: 0, width: 1000, height: 1000 },
      gridEnabled: false,
      gridSize: 10
    }
  }

  /**
   * Get current view state
   */
  get viewState(): Readonly<ViewState> {
    return this._viewState
  }

  /**
   * Get the graph model
   */
  get model(): GraphModel {
    return this._model
  }

  /**
   * Convert screen coordinates to graph coordinates
   */
  screenToGraph(screenX: number, screenY: number): Point {
    return {
      x: (screenX - this._viewState.translate.x) / this._viewState.scale,
      y: (screenY - this._viewState.translate.y) / this._viewState.scale
    }
  }

  /**
   * Convert graph coordinates to screen coordinates
   */
  graphToScreen(graphX: number, graphY: number): Point {
    return {
      x: graphX * this._viewState.scale + this._viewState.translate.x,
      y: graphY * this._viewState.scale + this._viewState.translate.y
    }
  }

  /**
   * Convert screen rectangle to graph rectangle
   */
  screenToGraphRectangle(rect: Rectangle): Rectangle {
    const topLeft = this.screenToGraph(rect.x, rect.y)
    const bottomRight = this.screenToGraph(rect.x + rect.width, rect.y + rect.height)

    return {
      x: Math.min(topLeft.x, bottomRight.x),
      y: Math.min(topLeft.y, bottomRight.y),
      width: Math.abs(bottomRight.x - topLeft.x),
      height: Math.abs(bottomRight.y - topLeft.y)
    }
  }

  /**
   * Convert graph rectangle to screen rectangle
   */
  graphToScreenRectangle(rect: Rectangle): Rectangle {
    const topLeft = this.graphToScreen(rect.x, rect.y)
    const bottomRight = this.graphToScreen(rect.x + rect.width, rect.y + rect.height)

    return {
      x: Math.min(topLeft.x, bottomRight.x),
      y: Math.min(topLeft.y, bottomRight.y),
      width: Math.abs(bottomRight.x - topLeft.x),
      height: Math.abs(bottomRight.y - topLeft.y)
    }
  }

  /**
   * Get the absolute (screen) geometry of a cell
   */
  getCellAbsoluteGeometry(cell: Cell): Geometry {
    const geometry = cell.geometry
    if (!geometry) {
      return { x: 0, y: 0, width: 0, height: 0 }
    }

    // Calculate absolute position considering parent hierarchy
    let absoluteX = geometry.x
    let absoluteY = geometry.y
    let currentCell = cell

    while (currentCell.parent && currentCell.parent.id !== 'root') {
      const parentGeometry = currentCell.parent.geometry
      if (parentGeometry) {
        absoluteX += parentGeometry.x
        absoluteY += parentGeometry.y
      }
      currentCell = currentCell.parent
    }

    return {
      x: absoluteX,
      y: absoluteY,
      width: geometry.width,
      height: geometry.height
    }
  }

  /**
   * Get the screen bounds of a cell
   */
  getCellScreenBounds(cell: Cell): Rectangle {
    const absoluteGeometry = this.getCellAbsoluteGeometry(cell)
    return this.graphToScreenRectangle(absoluteGeometry)
  }

  /**
   * Get all cells that intersect with the given rectangle
   */
  getCellsInRectangle(rect: Rectangle): Cell[] {
    const cells: Cell[] = []
    const graphRect = this.screenToGraphRectangle(rect)

    this._model.forEachCell((cell) => {
      const cellGeometry = this.getCellAbsoluteGeometry(cell)
      if (this.rectanglesIntersect(graphRect, cellGeometry)) {
        cells.push(cell)
      }
    })

    return cells
  }

  /**
   * Check if a point is inside a cell
   */
  isPointInCell(cell: Cell, x: number, y: number): boolean {
    const cellGeometry = this.getCellAbsoluteGeometry(cell)
    const graphPoint = this.screenToGraph(x, y)

    return (
      graphPoint.x >= cellGeometry.x &&
      graphPoint.x <= cellGeometry.x + cellGeometry.width &&
      graphPoint.y >= cellGeometry.y &&
      graphPoint.y <= cellGeometry.y + cellGeometry.height
    )
  }

  /**
   * Get cell at the given screen coordinates
   */
  getCellAt(x: number, y: number): Cell | undefined {
    const graphPoint = this.screenToGraph(x, y)
    let hitCell: Cell | undefined

    // Check cells in reverse order (topmost first)
    this._model.forEachCell((cell) => {
      if (!cell.isEdge()) { // For now, only check vertices
        const cellGeometry = this.getCellAbsoluteGeometry(cell)
        if (
          graphPoint.x >= cellGeometry.x &&
          graphPoint.x <= cellGeometry.x + cellGeometry.width &&
          graphPoint.y >= cellGeometry.y &&
          graphPoint.y <= cellGeometry.y + cellGeometry.height
        ) {
          hitCell = cell
        }
      }
    })

    return hitCell
  }

  /**
   * Pan the view by the given delta
   */
  pan(deltaX: number, deltaY: number): void {
    this._viewState.translate.x += deltaX
    this._viewState.translate.y += deltaY
  }

  /**
   * Set the translation (pan position)
   */
  setTranslate(x: number, y: number): void {
    this._viewState.translate = { x, y }
  }

  /**
   * Zoom to the given scale
   */
  zoomTo(scale: number, centerX?: number, centerY?: number): void {
    if (centerX !== undefined && centerY !== undefined) {
      // Zoom about the given center point
      const currentScale = this._viewState.scale
      const scaleDiff = scale - currentScale

      this._viewState.translate.x -= centerX * scaleDiff
      this._viewState.translate.y -= centerY * scaleDiff
    }

    this._viewState.scale = Math.max(0.1, Math.min(10, scale)) // Clamp scale
  }

  /**
   * Zoom by the given factor
   */
  zoomBy(factor: number, centerX?: number, centerY?: number): void {
    this.zoomTo(this._viewState.scale * factor, centerX, centerY)
  }

  /**
   * Set the viewport size
   */
  setViewportSize(width: number, height: number): void {
    this._viewState.viewport.width = width
    this._viewState.viewport.height = height
  }

  /**
   * Enable or disable the grid
   */
  setGridEnabled(enabled: boolean): void {
    this._viewState.gridEnabled = enabled
  }

  /**
   * Set the grid size
   */
  setGridSize(size: number): void {
    this._viewState.gridSize = Math.max(1, size)
  }

  /**
   * Snap point to grid if grid is enabled
   */
  snapToGrid(point: Point): Point {
    if (this._viewState.gridEnabled) {
      const gridSize = this._viewState.gridSize
      return {
        x: Math.round(point.x / gridSize) * gridSize,
        y: Math.round(point.y / gridSize) * gridSize
      }
    }
    return point
  }

  /**
   * Get the visible graph bounds
   */
  getVisibleGraphBounds(): Rectangle {
    return this.screenToGraphRectangle(this._viewState.viewport)
  }

  /**
   * Fit the graph content into the viewport
   */
  fitContent(padding: number = 20): void {
    const cells = Array.from(this._model.cells)
    if (cells.length === 0) return

    let minX = Infinity, minY = Infinity
    let maxX = -Infinity, maxY = -Infinity

    cells.forEach(cell => {
      const geometry = this.getCellAbsoluteGeometry(cell)
      minX = Math.min(minX, geometry.x)
      minY = Math.min(minY, geometry.y)
      maxX = Math.max(maxX, geometry.x + geometry.width)
      maxY = Math.max(maxY, geometry.y + geometry.height)
    })

    const contentWidth = maxX - minX + 2 * padding
    const contentHeight = maxY - minY + 2 * padding
    const scaleX = this._viewState.viewport.width / contentWidth
    const scaleY = this._viewState.viewport.height / contentHeight
    const scale = Math.min(scaleX, scaleY, 1) // Don't zoom in beyond 100%

    this._viewState.scale = Math.max(0.1, scale)
    this._viewState.translate = {
      x: (this._viewState.viewport.width - contentWidth * scale) / 2 - minX * scale + padding * scale,
      y: (this._viewState.viewport.height - contentHeight * scale) / 2 - minY * scale + padding * scale
    }
  }

  /**
   * Check if two rectangles intersect
   */
  private rectanglesIntersect(rect1: Rectangle, rect2: Rectangle): boolean {
    return !(
      rect1.x + rect1.width < rect2.x ||
      rect2.x + rect2.width < rect1.x ||
      rect1.y + rect1.height < rect2.y ||
      rect2.y + rect2.height < rect1.y
    )
  }

  /**
   * Reset the view to default state
   */
  reset(): void {
    this._viewState = {
      translate: { x: 0, y: 0 },
      scale: 1,
      viewport: this._viewState.viewport,
      gridEnabled: false,
      gridSize: 10
    }
  }
}