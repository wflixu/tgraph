import { EventEmitter } from './EventEmitter'
import type { GraphView } from '../view/GraphView'
import type { Point } from '../types'

/**
 * Pan and zoom interaction handler
 */
export class PanZoomHandler extends EventEmitter {
  private _view: GraphView
  private _container: HTMLElement | null = null
  private _isEnabled = true

  // Panning state
  private _isPanning = false
  private _startPoint: Point = { x: 0, y: 0 }
  private _startTranslate: Point = { x: 0, y: 0 }

  // Zoom state
  private _zoomFactor = 1.2
  private _minScale = 0.1
  private _maxScale = 10

  // Mouse wheel zoom state
  private _isWheelZoomEnabled = true
  private _wheelZoomCenter = false

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
      this.stopPanning()
    }
  }

  /**
   * Get the container element
   */
  get container(): HTMLElement | null {
    return this._container
  }

  /**
   * Set the container element and bind event listeners
   */
  setContainer(container: HTMLElement): void {
    // Remove listeners from old container
    if (this._container) {
      this.removeContainerListeners()
    }

    this._container = container

    // Add listeners to new container
    if (container) {
      this.addContainerListeners()
    }
  }

  /**
   * Get zoom factor
   */
  get zoomFactor(): number {
    return this._zoomFactor
  }

  /**
   * Set zoom factor
   */
  setZoomFactor(factor: number): void {
    this._zoomFactor = Math.max(1.1, factor)
  }

  /**
   * Get min scale
   */
  get minScale(): number {
    return this._minScale
  }

  /**
   * Set min scale
   */
  setMinScale(scale: number): void {
    this._minScale = Math.max(0.01, scale)
  }

  /**
   * Get max scale
   */
  get maxScale(): number {
    return this._maxScale
  }

  /**
   * Set max scale
   */
  setMaxScale(scale: number): void {
    this._maxScale = Math.max(this._minScale, scale)
  }

  /**
   * Check if wheel zoom is enabled
   */
  get isWheelZoomEnabled(): boolean {
    return this._isWheelZoomEnabled
  }

  /**
   * Enable or disable wheel zoom
   */
  setWheelZoomEnabled(enabled: boolean): void {
    this._isWheelZoomEnabled = enabled
  }

  /**
   * Check if wheel zoom centers on mouse
   */
  get isWheelZoomCenter(): boolean {
    return this._wheelZoomCenter
  }

  /**
   * Set wheel zoom to center on mouse position
   */
  setWheelZoomCenter(enabled: boolean): void {
    this._wheelZoomCenter = enabled
  }

  /**
   * Start panning at the given point
   */
  startPanning(point: Point): void {
    if (!this._isEnabled || this._isPanning) return

    this._isPanning = true
    this._startPoint = { ...point }
    const viewState = this._view.viewState
    this._startTranslate = { ...viewState.translate }

    this.emit('pan:start', { point })
  }

  /**
   * Pan to the given point
   */
  panTo(point: Point): void {
    if (!this._isEnabled || !this._isPanning) return

    const dx = point.x - this._startPoint.x
    const dy = point.y - this._startPoint.y

    this._view.setTranslate(
      this._startTranslate.x + dx,
      this._startTranslate.y + dy
    )

    this.emit('pan:move', { point, delta: { x: dx, y: dy } })
  }

  /**
   * Stop panning
   */
  stopPanning(): void {
    if (!this._isPanning) return

    this._isPanning = false
    this.emit('pan:end', {})
  }

  /**
   * Check if currently panning
   */
  get isPanning(): boolean {
    return this._isPanning
  }

  /**
   * Zoom in by the current factor
   */
  zoomIn(center?: Point): void {
    if (!this._isEnabled) return

    const newScale = Math.min(this._view.viewState.scale * this._zoomFactor, this._maxScale)
    this._view.zoomTo(newScale, center?.x, center?.y)

    this.emit('zoom:changed', {
      oldScale: this._view.viewState.scale,
      newScale,
      center
    })
  }

  /**
   * Zoom out by the current factor
   */
  zoomOut(center?: Point): void {
    if (!this._isEnabled) return

    const newScale = Math.max(this._view.viewState.scale / this._zoomFactor, this._minScale)
    this._view.zoomTo(newScale, center?.x, center?.y)

    this.emit('zoom:changed', {
      oldScale: this._view.viewState.scale,
      newScale,
      center
    })
  }

  /**
   * Zoom to a specific scale
   */
  zoomTo(scale: number, center?: Point): void {
    if (!this._isEnabled) return

    const oldScale = this._view.viewState.scale
    const clampedScale = Math.max(this._minScale, Math.min(this._maxScale, scale))

    this._view.zoomTo(clampedScale, center?.x, center?.y)

    this.emit('zoom:changed', {
      oldScale,
      newScale: clampedScale,
      center
    })
  }

  /**
   * Zoom to fit the entire content
   */
  zoomToFit(padding = 20): void {
    if (!this._isEnabled) return

    const oldScale = this._view.viewState.scale
    this._view.fitContent(padding)

    this.emit('zoom:changed', {
      oldScale,
      newScale: this._view.viewState.scale,
      center: undefined
    })
  }

  /**
   * Reset view to default state
   */
  resetView(): void {
    if (!this._isEnabled) return

    const oldScale = this._view.viewState.scale
    this._view.reset()

    this.emit('zoom:changed', {
      oldScale,
      newScale: 1,
      center: undefined
    })

    this.emit('pan:end', {})
  }

  /**
   * Get client point relative to container
   */
  getRelativePoint(clientX: number, clientY: number): Point {
    if (!this._container) {
      return { x: clientX, y: clientY }
    }

    const rect = this._container.getBoundingClientRect()
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }

  /**
   * Add event listeners to container
   */
  private addContainerListeners(): void {
    if (!this._container) return

    // Mouse down for panning
    this._container.addEventListener('mousedown', this.handleMouseDown, { passive: false })

    // Mouse move for panning
    document.addEventListener('mousemove', this.handleMouseMove, { passive: false })

    // Mouse up for panning
    document.addEventListener('mouseup', this.handleMouseUp, { passive: true })

    // Wheel for zooming
    this._container.addEventListener('wheel', this.handleWheel, { passive: false })

    // Touch events for mobile support
    this._container.addEventListener('touchstart', this.handleTouchStart, { passive: false })
    document.addEventListener('touchmove', this.handleTouchMove, { passive: false })
    document.addEventListener('touchend', this.handleTouchEnd, { passive: true })

    // Prevent context menu on container
    this._container.addEventListener('contextmenu', (e) => e.preventDefault())
  }

  /**
   * Remove event listeners from container
   */
  private removeContainerListeners(): void {
    if (!this._container) return

    this._container.removeEventListener('mousedown', this.handleMouseDown)
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
    this._container.removeEventListener('wheel', this.handleWheel)
    this._container.removeEventListener('touchstart', this.handleTouchStart)
    document.removeEventListener('touchmove', this.handleTouchMove)
    document.removeEventListener('touchend', this.handleTouchEnd)
  }

  /**
   * Handle mouse down event
   */
  private handleMouseDown = (event: MouseEvent): void => {
    // Only handle left mouse button without modifiers for panning
    if (event.button === 0 && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
      const point = this.getRelativePoint(event.clientX, event.clientY)

      // Check if clicking on empty space (not on a cell)
      // This will be handled by the mouse handler
      // For now, start panning if middle button or shift+drag

      if (event.button === 1 || event.shiftKey) {
        event.preventDefault()
        this.startPanning(point)
      }
    }
  }

  /**
   * Handle mouse move event
   */
  private handleMouseMove = (event: MouseEvent): void => {
    if (this._isPanning) {
      event.preventDefault()
      const point = this.getRelativePoint(event.clientX, event.clientY)
      this.panTo(point)
    }
  }

  /**
   * Handle mouse up event
   */
  private handleMouseUp = (): void => {
    if (this._isPanning) {
      this.stopPanning()
    }
  }

  /**
   * Handle wheel event for zooming
   */
  private handleWheel = (event: WheelEvent): void => {
    if (!this._isWheelZoomEnabled) return

    event.preventDefault()

    const point = this.getRelativePoint(event.clientX, event.clientY)
    let center: Point | undefined

    if (this._wheelZoomCenter) {
      center = this._view.screenToGraph(point.x, point.y)
    }

    if (event.deltaY < 0) {
      this.zoomIn(center)
    } else {
      this.zoomOut(center)
    }
  }

  /**
   * Handle touch start for mobile support
   */
  private handleTouchStart = (event: TouchEvent): void => {
    if (event.touches.length === 1) {
      const touch = event.touches[0]
      const point = this.getRelativePoint(touch.clientX, touch.clientY)
      this.startPanning(point)
    }
  }

  /**
   * Handle touch move for mobile support
   */
  private handleTouchMove = (event: TouchEvent): void => {
    if (this._isPanning && event.touches.length === 1) {
      event.preventDefault()
      const touch = event.touches[0]
      const point = this.getRelativePoint(touch.clientX, touch.clientY)
      this.panTo(point)
    }
  }

  /**
   * Handle touch end for mobile support
   */
  private handleTouchEnd = (): void => {
    if (this._isPanning) {
      this.stopPanning()
    }
  }

  /**
   * Dispose the handler
   */
  dispose(): void {
    this.removeContainerListeners()
    this.removeAllListeners()
    this._container = null
    this._isEnabled = false
  }
}