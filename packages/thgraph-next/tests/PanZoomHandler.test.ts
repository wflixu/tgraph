import { expect, test, describe, beforeEach, vi, afterEach } from 'vitest'
import { PanZoomHandler } from '../src/interaction/PanZoomHandler'
import { GraphView } from '../src/view/GraphView'
import { GraphModel } from '../src/model/GraphModel'
import { Cell } from '../src/model/Cell'

describe('PanZoomHandler', () => {
  let panZoomHandler: PanZoomHandler
  let view: GraphView
  let model: GraphModel
  let container: HTMLElement

  beforeEach(() => {
    model = new GraphModel()
    view = new GraphView(model)
    panZoomHandler = new PanZoomHandler(view)

    // Create mock container
    container = document.createElement('div')
    document.body.appendChild(container)
    panZoomHandler.setContainer(container)
  })

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container)
    }
  })

  test('should initialize with default settings', () => {
    expect(panZoomHandler.isEnabled).toBe(true)
    expect(panZoomHandler.zoomFactor).toBe(1.2)
    expect(panZoomHandler.minScale).toBe(0.1)
    expect(panZoomHandler.maxScale).toBe(10)
    expect(panZoomHandler.isWheelZoomEnabled).toBe(true)
    expect(panZoomHandler.isWheelZoomCenter).toBe(false)
  })

  test('should enable and disable handler', () => {
    panZoomHandler.setEnabled(false)
    expect(panZoomHandler.isEnabled).toBe(false)

    panZoomHandler.setEnabled(true)
    expect(panZoomHandler.isEnabled).toBe(true)
  })

  test('should configure zoom settings', () => {
    panZoomHandler.setZoomFactor(2.0)
    expect(panZoomHandler.zoomFactor).toBe(2.0)

    panZoomHandler.setMinScale(0.5)
    expect(panZoomHandler.minScale).toBe(0.5)

    panZoomHandler.setMaxScale(5.0)
    expect(panZoomHandler.maxScale).toBe(5.0)
  })

  test('should configure wheel zoom', () => {
    panZoomHandler.setWheelZoomEnabled(false)
    expect(panZoomHandler.isWheelZoomEnabled).toBe(false)

    panZoomHandler.setWheelZoomCenter(true)
    expect(panZoomHandler.isWheelZoomCenter).toBe(true)
  })

  test('should get relative point from container', () => {
    // Mock container getBoundingClientRect
    const mockRect = { left: 100, top: 50 }
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(mockRect as any)

    const point = panZoomHandler.getRelativePoint(150, 100)
    expect(point.x).toBe(50)
    expect(point.y).toBe(50)
  })

  test('should start and stop panning', () => {
    const listener = vi.fn()
    panZoomHandler.on('pan:start', listener)

    const startPoint = { x: 100, y: 100 }
    panZoomHandler.startPanning(startPoint)

    expect(panZoomHandler.isPanning).toBe(true)
    expect(listener).toHaveBeenCalledWith({ point: startPoint })

    panZoomHandler.stopPanning()

    expect(panZoomHandler.isPanning).toBe(false)
  })

  test('should handle pan during panning', () => {
    const listener = vi.fn()
    panZoomHandler.on('pan:move', listener)

    const startPoint = { x: 100, y: 100 }
    panZoomHandler.startPanning(startPoint)

    const movePoint = { x: 150, y: 150 }
    panZoomHandler.panTo(movePoint)

    expect(listener).toHaveBeenCalledWith({
      point: movePoint,
      delta: { x: 50, y: 50 }
    })
  })

  test('should zoom in and out', () => {
    const listener = vi.fn()
    panZoomHandler.on('zoom:changed', listener)

    const originalScale = view.viewState.scale

    panZoomHandler.zoomIn()
    expect(listener).toHaveBeenCalledWith({
      oldScale: originalScale,
      newScale: originalScale * panZoomHandler.zoomFactor,
      center: undefined
    })

    listener.mockClear()

    panZoomHandler.zoomOut()
    expect(listener).toHaveBeenCalledWith({
      oldScale: originalScale * panZoomHandler.zoomFactor,
      newScale: originalScale,
      center: undefined
    })
  })

  test('should zoom to specific scale', () => {
    const listener = vi.fn()
    panZoomHandler.on('zoom:changed', listener)

    const newScale = 2.5
    panZoomHandler.zoomTo(newScale)

    expect(listener).toHaveBeenCalledWith({
      oldScale: expect.any(Number),
      newScale,
      center: undefined
    })
  })

  test('should respect zoom bounds', () => {
    const currentScale = view.viewState.scale
    panZoomHandler.setMinScale(currentScale * 2)
    panZoomHandler.setMaxScale(currentScale * 0.5)

    const listener = vi.fn()
    panZoomHandler.on('zoom:changed', listener)

    // Should be clamped to minScale
    panZoomHandler.zoomIn()
    expect(listener).toHaveBeenCalledWith({
      oldScale: currentScale,
      newScale: currentScale * 2, // minScale
      center: undefined
    })

    listener.mockClear()

    // Should be clamped to maxScale
    panZoomHandler.zoomOut()
    expect(listener).toHaveBeenCalledWith({
      oldScale: currentScale * 2,
      newScale: currentScale * 0.5, // maxScale
      center: undefined
    })
  })

  test('should zoom to fit content', () => {
    const listener = vi.fn()
    panZoomHandler.on('zoom:changed', listener)

    // Add a cell to the model
    const cell = Cell.createVertex('test', 'Test', { x: 100, y: 100, width: 100, height: 50 })
    model.addCell(cell)

    panZoomHandler.zoomToFit()

    expect(listener).toHaveBeenCalled()
  })

  test('should reset view', () => {
    const zoomListener = vi.fn()
    const panListener = vi.fn()
    panZoomHandler.on('zoom:changed', zoomListener)
    panZoomHandler.on('pan:end', panListener)

    // Change the view state first
    view.zoomTo(2.0)
    view.setTranslate(50, 50)

    panZoomHandler.resetView()

    expect(zoomListener).toHaveBeenCalledWith({
      oldScale: expect.any(Number),
      newScale: 1,
      center: undefined
    })

    expect(panListener).toHaveBeenCalled()
  })

  test('should handle dispose', () => {
    panZoomHandler.dispose()

    expect(panZoomHandler.isEnabled).toBe(false)
    expect(panZoomHandler.container).toBeNull()
  })
})