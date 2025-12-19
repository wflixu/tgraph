import { SvgFactory } from './SvgFactory'
import { initializeDefaultShapes, ShapeRegistry } from './shapes'
import type { GraphView } from '../view/GraphView'
import type { Cell, Geometry, Style, Point } from '../types'

/**
 * SVG Renderer configuration
 */
export interface RendererConfig {
  /**
   * Whether to render the grid
   */
  renderGrid: boolean

  /**
   * Grid color
   */
  gridColor: string

  /**
   * Grid size
   */
  gridSize: number

  /**
   * Whether to render connections
   */
  renderConnections: boolean

  /**
   * Default style for unstyled cells
   */
  defaultStyle: Style
}

/**
 * SVG Renderer handles the actual rendering of cells to SVG DOM
 */
export class SvgRenderer {
  private _view: GraphView
  private _config: RendererConfig
  private _svgElement: SVGSVGElement | null = null
  private _contentGroup: SVGGElement | null = null
  private _gridGroup: SVGGElement | null = null
  private _cellElements = new Map<string, SVGElement>()

  constructor(view: GraphView, config: Partial<RendererConfig> = {}) {
    this._view = view
    this._config = {
      renderGrid: true,
      gridColor: '#e0e0e0',
      gridSize: 10,
      renderConnections: true,
      defaultStyle: {
        fillColor: 'white',
        strokeColor: 'black',
        strokeWidth: 1,
        fontSize: 14,
        fontFamily: 'Arial, sans-serif',
        fontColor: 'black'
      },
      ...config
    }

    // Initialize default shapes
    initializeDefaultShapes()
  }

  /**
   * Get the renderer configuration
   */
  get config(): Readonly<RendererConfig> {
    return this._config
  }

  /**
   * Initialize the renderer with an SVG element
   */
  initialize(svgElement: SVGSVGElement): void {
    this._svgElement = svgElement
    this._contentGroup = SvgFactory.createGroup({ class: 'graph-content' }, svgElement)
    this._gridGroup = SvgFactory.createGroup({ class: 'graph-grid' }, svgElement)

    this.updateViewportSize()
    this.render()
  }

  /**
   * Get the current SVG element
   */
  getSvgElement(): SVGSVGElement | null {
    return this._svgElement
  }

  /**
   * Update viewport size based on SVG element
   */
  private updateViewportSize(): void {
    if (this._svgElement) {
      const rect = this._svgElement.getBoundingClientRect()
      this._view.setViewportSize(rect.width, rect.height)
    }
  }

  /**
   * Render the entire graph
   */
  render(): void {
    if (!this._svgElement || !this._contentGroup) return

    // Clear existing content
    SvgFactory.clearChildren(this._contentGroup)

    // Update SVG view transform
    this.updateSvgTransform()

    // Render grid if enabled
    if (this._config.renderGrid) {
      this.renderGrid()
    }

    // Render all cells
    const cells = Array.from(this._view.model.cells)
    cells.forEach(cell => {
      if (!cell.parent || cell.parent.id === '0') {
        this.renderCellRecursive(cell, this._contentGroup!)
      }
    })
  }

  /**
   * Update the SVG transform based on view state
   */
  private updateSvgTransform(): void {
    if (this._contentGroup) {
      const { translate, scale } = this._view.viewState
      const transform = `translate(${translate.x}, ${translate.y}) scale(${scale})`
      this._contentGroup.setAttribute('transform', transform)
    }
  }

  /**
   * Render grid
   */
  private renderGrid(): void {
    if (!this._gridGroup) return

    SvgFactory.clearChildren(this._gridGroup)

    const { viewport, gridSize, gridEnabled } = this._view.viewState
    if (!gridEnabled) return

    const visibleBounds = this._view.getVisibleGraphBounds()
    const startX = Math.floor(visibleBounds.x / gridSize) * gridSize
    const startY = Math.floor(visibleBounds.y / gridSize) * gridSize
    const endX = Math.ceil((visibleBounds.x + visibleBounds.width) / gridSize) * gridSize
    const endY = Math.ceil((visibleBounds.y + visibleBounds.height) / gridSize) * gridSize

    // Render vertical lines
    for (let x = startX; x <= endX; x += gridSize) {
      SvgFactory.createLine(
        x, startY,
        x, endY,
        {
          stroke: this._config.gridColor,
          'stroke-width': 0.5,
          opacity: 0.5
        },
        this._gridGroup
      )
    }

    // Render horizontal lines
    for (let y = startY; y <= endY; y += gridSize) {
      SvgFactory.createLine(
        startX, y,
        endX, y,
        {
          stroke: this._config.gridColor,
          'stroke-width': 0.5,
          opacity: 0.5
        },
        this._gridGroup
      )
    }
  }

  /**
   * Recursively render a cell and its children
   */
  private renderCellRecursive(cell: Cell, parentGroup: SVGElement): void {
    const cellGroup = SvgFactory.createGroup({
      'data-cell-id': cell.id,
      class: `cell ${cell.isEdge() ? 'edge' : 'vertex'} ${cell.style.shape || 'rectangle'}`
    }, parentGroup)

    this._cellElements.set(cell.id, cellGroup)

    // Apply absolute position transformation
    const absoluteGeometry = this._view.getCellAbsoluteGeometry(cell)
    cellGroup.setAttribute('transform', `translate(${absoluteGeometry.x}, ${absoluteGeometry.y})`)

    // Render the cell
    this.renderCell(cell, cellGroup)

    // Render children
    cell.children.forEach(child => {
      this.renderCellRecursive(child, cellGroup)
    })
  }

  /**
   * Render a single cell
   */
  private renderCell(cell: Cell, container: SVGElement): void {
    const geometry = this._view.model.getGeometry(cell)
    if (!geometry) return

    // Merge cell style with default style
    const style = { ...this._config.defaultStyle, ...cell.style }
    const shapeType = style.shape || (cell.isEdge() ? 'line' : 'rectangle')

    // Get shape renderer
    const shape = ShapeRegistry.getRenderer(shapeType)
    if (!shape) {
      console.warn(`No renderer found for shape type: ${shapeType}`)
      return
    }

    // Render the shape
    shape.render(cell, geometry, style, container)
  }

  /**
   * Add a new cell to the render
   */
  addCell(cell: Cell): void {
    if (!this._contentGroup || this._cellElements.has(cell.id)) return

    if (!cell.parent || cell.parent.id === '0') {
      this.renderCellRecursive(cell, this._contentGroup)
    }
  }

  /**
   * Remove a cell from the render
   */
  removeCell(cellId: string): void {
    const element = this._cellElements.get(cellId)
    if (element && element.parentNode) {
      element.parentNode.removeChild(element)
      this._cellElements.delete(cellId)
    }
  }

  /**
   * Update a cell's rendering
   */
  updateCell(cell: Cell): void {
    const element = this._cellElements.get(cell.id)
    if (!element) return

    // Clear and re-render the cell
    SvgFactory.clearChildren(element)
    this.renderCell(cell, element)

    // Update position if geometry changed
    const absoluteGeometry = this._view.getCellAbsoluteGeometry(cell)
    element.setAttribute('transform', `translate(${absoluteGeometry.x}, ${absoluteGeometry.y})`)
  }

  /**
   * Highlight a cell
   */
  highlightCell(cellId: string, highlightStyle: Record<string, string | number> = {}): void {
    const element = this._cellElements.get(cellId)
    if (element) {
      Object.entries(highlightStyle).forEach(([property, value]) => {
        if (property === 'filter') {
          element.style.filter = String(value)
        } else {
          element.setAttribute(property, String(value))
        }
      })
    }
  }

  /**
   * Remove highlighting from a cell
   */
  unhighlightCell(cellId: string): void {
    const element = this._cellElements.get(cellId)
    if (element) {
      element.style.filter = ''
      element.removeAttribute('opacity')
    }
  }

  /**
   * Get the SVG element for a cell
   */
  getCellElement(cellId: string): SVGElement | undefined {
    return this._cellElements.get(cellId)
  }

  /**
   * Convert screen coordinates to graph coordinates
   */
  screenToGraph(screenX: number, screenY: number): Point {
    return this._view.screenToGraph(screenX, screenY)
  }

  /**
   * Convert graph coordinates to screen coordinates
   */
  graphToScreen(graphX: number, graphY: number): Point {
    return this._view.graphToScreen(graphX, graphY)
  }

  /**
   * Get cell at screen coordinates
   */
  getCellAt(x: number, y: number): Cell | undefined {
    return this._view.getCellAt(x, y)
  }

  /**
   * Update the renderer configuration
   */
  updateConfig(config: Partial<RendererConfig>): void {
    this._config = { ...this._config, ...config }

    if (config.gridColor !== undefined || config.gridSize !== undefined) {
      this.renderGrid()
    }

    if (config.renderGrid !== undefined) {
      if (config.renderGrid) {
        this.renderGrid()
      } else if (this._gridGroup) {
        SvgFactory.clearChildren(this._gridGroup)
      }
    }
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this._cellElements.clear()
    this._svgElement = null
    this._contentGroup = null
    this._gridGroup = null
  }
}