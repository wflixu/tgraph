import { expect, test, describe, beforeEach, afterEach, vi } from 'vitest'

// Setup fake timers for double click detection tests
vi.useFakeTimers()
import { MouseHandler } from '../src/interaction/MouseHandler'
import { GraphView } from '../src/view/GraphView'
import { GraphModel } from '../src/model/GraphModel'
import { Cell } from '../src/model/Cell'

describe('MouseHandler', () => {
  let mouseHandler: MouseHandler
  let view: GraphView
  let model: GraphModel
  let container: HTMLElement

  beforeEach(() => {
    model = new GraphModel()
    view = new GraphView(model)
    mouseHandler = new MouseHandler(view)

    // Create mock container
    container = document.createElement('div')
    container.style.width = '800px'
    container.style.height = '600px'
    document.body.appendChild(container)
    mouseHandler.setContainer(container)
  })

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container)
    }
    mouseHandler.dispose()
  })

  test('should initialize with default settings', () => {
    expect(mouseHandler.isEnabled).toBe(true)
    expect(mouseHandler.clickTolerance).toBe(4)
    expect(mouseHandler.doubleClickDelay).toBe(300)
    expect(mouseHandler.isRubberBanding).toBe(false)
  })

  test('should enable and disable handler', () => {
    mouseHandler.setEnabled(false)
    expect(mouseHandler.isEnabled).toBe(false)

    mouseHandler.setEnabled(true)
    expect(mouseHandler.isEnabled).toBe(true)
  })

  test('should configure click tolerance', () => {
    mouseHandler.setClickTolerance(8)
    expect(mouseHandler.clickTolerance).toBe(8)

    // Should enforce minimum
    mouseHandler.setClickTolerance(0)
    expect(mouseHandler.clickTolerance).toBe(1)
  })

  test('should configure double click delay', () => {
    mouseHandler.setDoubleClickDelay(500)
    expect(mouseHandler.doubleClickDelay).toBe(500)

    // Should enforce minimum
    mouseHandler.setDoubleClickDelay(50)
    expect(mouseHandler.doubleClickDelay).toBe(100)
  })

  test('should get cell at point', () => {
    const cell = Cell.createVertex('test', 'Test', { x: 100, y: 100, width: 50, height: 30 })
    model.addCell(cell)

    // Mock view.getCellAt
    vi.spyOn(view, 'getCellAt').mockReturnValue(cell)

    const foundCell = mouseHandler.getCellAt(125, 115)
    expect(foundCell).toBe(cell)
  })

  test('should calculate relative point correctly', () => {
    // Mock container position
    Object.defineProperty(container, 'getBoundingClientRect', {
      value: () => ({ left: 100, top: 50, right: 900, bottom: 650 })
    })

    const point = mouseHandler.getRelativePoint(150, 125)
    expect(point).toEqual({ x: 50, y: 75 })
  })

  test('should return absolute point when no container', () => {
    mouseHandler.setContainer(null as any)
    const point = mouseHandler.getRelativePoint(100, 200)
    expect(point).toEqual({ x: 100, y: 200 })
  })

  test('should start and stop rubber banding', () => {
    expect(mouseHandler.isRubberBanding).toBe(false)

    const startPoint = { x: 100, y: 100 }
    mouseHandler.startRubberBanding(startPoint)

    expect(mouseHandler.isRubberBanding).toBe(true)

    mouseHandler.stopRubberBanding()
    expect(mouseHandler.isRubberBanding).toBe(false)
  })

  test('should not start rubber banding when disabled', () => {
    mouseHandler.setEnabled(false)
    mouseHandler.startRubberBanding({ x: 100, y: 100 })
    expect(mouseHandler.isRubberBanding).toBe(false)
  })

  test('should update rubber band selection', () => {
    mouseHandler.startRubberBanding({ x: 100, y: 100 })
    mouseHandler.updateRubberBanding({ x: 200, y: 150 })

    const bounds = mouseHandler.getCellsInRubberBand()
    expect(bounds.x).toBe(100)
    expect(bounds.y).toBe(100)
    expect(bounds.width).toBe(100)
    expect(bounds.height).toBe(50)
  })

  test('should emit events on mouse operations', () => {
    const cell = Cell.createVertex('test', 'Test', { x: 100, y: 100, width: 50, height: 30 })
    model.addCell(cell)

    const clickListener = vi.fn()
    const backgroundListener = vi.fn()
    const rubberbandListener = vi.fn()

    mouseHandler.on('cell:click', clickListener)
    mouseHandler.on('background:click', backgroundListener)
    mouseHandler.on('rubberband:start', rubberbandListener)

    // Mock view.getCellAt to return cell for specific coordinates
    vi.spyOn(view, 'getCellAt').mockImplementation((x, y) => {
      return (x >= 100 && x <= 150 && y >= 100 && y <= 130) ? cell : undefined
    })

    // Simulate click on cell
    const cellEvent = new MouseEvent('mousedown', { clientX: 125, clientY: 115, button: 0 })
    const cellUpEvent = new MouseEvent('mouseup', { clientX: 125, clientY: 115, button: 0 })
    Object.defineProperty(container, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, right: 800, bottom: 600 })
    })
    container.dispatchEvent(cellEvent)
    container.dispatchEvent(cellUpEvent)

    // Simulate click on background
    const bgEvent = new MouseEvent('mousedown', { clientX: 50, clientY: 50, button: 0 })
    const bgUpEvent = new MouseEvent('mouseup', { clientX: 50, clientY: 50, button: 0 })
    container.dispatchEvent(bgEvent)
    container.dispatchEvent(bgUpEvent)

    // Simulate rubber band start
    const rubberEvent = new MouseEvent('mousedown', {
      clientX: 300,
      clientY: 200,
      button: 0,
      shiftKey: true
    })
    container.dispatchEvent(rubberEvent)

    expect(clickListener).toHaveBeenCalled()
    expect(backgroundListener).toHaveBeenCalled()
    expect(rubberbandListener).toHaveBeenCalled()
  })

  test('should handle double click detection', () => {
    const cell = Cell.createVertex('test', 'Test', { x: 100, y: 100, width: 50, height: 30 })
    model.addCell(cell)

    const doubleClickListener = vi.fn()
    mouseHandler.on('cell:double-click', doubleClickListener)

    // Mock view.getCellAt
    vi.spyOn(view, 'getCellAt').mockReturnValue(cell)

    // Mock container position
    Object.defineProperty(container, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, right: 800, bottom: 600 })
    })

    // First click
    const firstClick = new MouseEvent('mousedown', { clientX: 125, clientY: 115, button: 0 })
    container.dispatchEvent(firstClick)

    // Second click within delay
    const secondClick = new MouseEvent('mousedown', { clientX: 125, clientY: 115, button: 0 })
    container.dispatchEvent(secondClick)

    // Wait for double click delay to pass
    vi.advanceTimersByTime(300)

    expect(doubleClickListener).toHaveBeenCalled()
  })

  test('should handle mouse wheel events for panning', () => {
    const wheelListener = vi.fn()
    mouseHandler.on('mouse:wheel', wheelListener)

    const wheelEvent = new WheelEvent('wheel', {
      clientX: 400,
      clientY: 300,
      deltaY: 100,
      ctrlKey: false
    })

    Object.defineProperty(container, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, right: 800, bottom: 600 })
    })

    container.dispatchEvent(wheelEvent)
    expect(wheelListener).toHaveBeenCalled()
  })

  test('should handle touch events', () => {
    const touchListener = vi.fn()
    mouseHandler.on('cell:click', touchListener)

    const cell = Cell.createVertex('test', 'Test', { x: 100, y: 100, width: 50, height: 30 })
    model.addCell(cell)

    vi.spyOn(view, 'getCellAt').mockReturnValue(cell)

    Object.defineProperty(container, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, right: 800, bottom: 600 })
    })

    // Touch start and end to simulate click
    const touchStart = new TouchEvent('touchstart', {
      touches: [{ clientX: 125, clientY: 115 } as any]
    })
    container.dispatchEvent(touchStart)

    const touchEnd = new TouchEvent('touchend', {
      changedTouches: [{ clientX: 125, clientY: 115 } as any]
    })
    container.dispatchEvent(touchEnd)

    expect(touchListener).toHaveBeenCalled()
  })

  test('should stop rubber banding when disabled', () => {
    mouseHandler.startRubberBanding({ x: 100, y: 100 })
    expect(mouseHandler.isRubberBanding).toBe(true)

    mouseHandler.setEnabled(false)
    expect(mouseHandler.isRubberBanding).toBe(false)
  })

  test('should handle dispose correctly', () => {
    mouseHandler.startRubberBanding({ x: 100, y: 100 })

    const listener = vi.fn()
    mouseHandler.on('test', listener)

    mouseHandler.dispose()

    expect(mouseHandler.isEnabled).toBe(false)
    expect(mouseHandler.isRubberBanding).toBe(false)
    expect(mouseHandler.container).toBeNull()
  })

  test('should get cells in rubber band rectangle', () => {
    mouseHandler.startRubberBanding({ x: 50, y: 50 })
    mouseHandler.updateRubberBanding({ x: 150, y: 125 })

    const rect = mouseHandler.getCellsInRubberBand()
    expect(rect.x).toBe(50)
    expect(rect.y).toBe(50)
    expect(rect.width).toBe(100)
    expect(rect.height).toBe(75)
  })

  test('should return empty rectangle when not rubber banding', () => {
    const rect = mouseHandler.getCellsInRubberBand()
    expect(rect).toEqual({ x: 0, y: 0, width: 0, height: 0 })
  })
})