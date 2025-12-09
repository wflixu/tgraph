import { expect, test, describe, beforeEach, vi } from 'vitest'
import { ResizeHandler, ResizeHandle } from '../src/interaction/ResizeHandler'
import { GraphView } from '../src/view/GraphView'
import { GraphModel } from '../src/model/GraphModel'
import { Cell } from '../src/model/Cell'

describe('ResizeHandler', () => {
  let resizeHandler: ResizeHandler
  let view: GraphView
  let model: GraphModel
  let container: HTMLElement

  beforeEach(() => {
    model = new GraphModel()
    view = new GraphView(model)
    resizeHandler = new ResizeHandler(view)

    // Create mock container
    container = document.createElement('div')
    document.body.appendChild(container)
    resizeHandler.setContainer(container)
  })

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container)
    }
  })

  test('should initialize with default settings', () => {
    expect(resizeHandler.isEnabled).toBe(true)
    expect(resizeHandler.handleSize).toBe(8)
    expect(resizeHandler.minSize.width).toBe(20)
    expect(resizeHandler.minSize.height).toBe(20)
    expect(resizeHandler.isGridEnabled).toBe(true)
  })

  test('should enable and disable handler', () => {
    resizeHandler.setEnabled(false)
    expect(resizeHandler.isEnabled).toBe(false)

    resizeHandler.setEnabled(true)
    expect(resizeHandler.isEnabled).toBe(true)
  })

  test('should configure handle size', () => {
    resizeHandler.setHandleSize(10)
    expect(resizeHandler.handleSize).toBe(10)
  })

  test('should configure minimum size', () => {
    resizeHandler.setMinSize(50, 30)

    expect(resizeHandler.minSize.width).toBe(50)
    expect(resizeHandler.minSize.height).toBe(30)
  })

  test('should enable and disable grid snapping', () => {
    resizeHandler.setGridEnabled(false)
    expect(resizeHandler.isGridEnabled).toBe(false)

    resizeHandler.setGridEnabled(true)
    expect(resizeHandler.isGridEnabled).toBe(true)
  })

  test('should determine if cell is resizable', () => {
    // Vertex cell with size should be resizable
    const resizableCell = Cell.createVertex('resizable', 'Resizable', { x: 0, y: 0, width: 100, height: 50 }, {
      visible: true,
      connectable: true
    })
    model.addCell(resizableCell)

    expect(resizeHandler.isCellResizable(resizableCell)).toBe(true)

    // Edge cell should not be resizable
    const edgeCell = Cell.createEdge('edge', 'Edge')
    model.addCell(edgeCell)

    expect(resizeHandler.isCellResizable(edgeCell)).toBe(false)

    // Cell with zero width should not be resizable
    const zeroWidthCell = Cell.createVertex('zeroWidth', 'Zero Width', { x: 0, y: 0, width: 0, height: 50 }, {
      visible: true,
      connectable: true
    })
    model.addCell(zeroWidthCell)

    expect(resizeHandler.isCellResizable(zeroWidthCell)).toBe(false)

    // Invisible cell should not be resizable
    const invisibleCell = Cell.createVertex('invisible', 'Invisible', { x: 0, y: 0, width: 100, height: 50 }, {
      visible: false,
      connectable: true
    })
    model.addCell(invisibleCell)

    expect(resizeHandler.isCellResizable(invisibleCell)).toBe(false)
  })

  test('should show and hide handles', () => {
    const resizableCell = Cell.createVertex('resizable', 'Resizable', { x: 0, y: 0, width: 100, height: 50 }, {
      visible: true,
      connectable: true
    })
    model.addCell(resizableCell)

    expect(resizeHandler.isHandlesVisible).toBe(false)

    resizeHandler.showHandles(resizableCell)

    expect(resizeHandler.isHandlesVisible).toBe(true)
    expect(resizeHandler.resizeCell).toBe(resizableCell)

    resizeHandler.hideHandles()

    expect(resizeHandler.isHandlesVisible).toBe(false)
    expect(resizeHandler.resizeCell).toBe(null)
  })

  test('should not show handles for non-resizable cells', () => {
    const edgeCell = Cell.createEdge('edge', 'Edge')
    model.addCell(edgeCell)

    resizeHandler.showHandles(edgeCell)

    expect(resizeHandler.isHandlesVisible).toBe(false)
    expect(resizeHandler.resizeCell).toBe(null)
  })

  test('should get resize handle at point', () => {
    const cell = Cell.createVertex('cell', 'Cell', { x: 100, y: 100, width: 100, height: 50 }, {
      visible: true,
      connectable: true
    })
    model.addCell(cell)

    resizeHandler.showHandles(cell)

    // Mock handle positions based on screen bounds
    const mockScreenBounds = {
      x: 100,
      y: 100,
      width: 100,
      height: 50
    }
    vi.spyOn(view, 'getCellScreenBounds').mockReturnValue(mockScreenBounds)

    // Test each handle position
    expect(resizeHandler.getHandleAt({ x: 100, y: 100 })).toBe(ResizeHandle.TOP_LEFT)
    expect(resizeHandler.getHandleAt({ x: 150, y: 100 })).toBe(ResizeHandle.TOP)
    expect(resizeHandler.getHandleAt({ x: 200, y: 100 })).toBe(ResizeHandle.TOP_RIGHT)
    expect(resizeHandler.getHandleAt({ x: 200, y: 125 })).toBe(ResizeHandle.RIGHT)
    expect(resizeHandler.getHandleAt({ x: 200, y: 150 })).toBe(ResizeHandle.BOTTOM_RIGHT)
    expect(resizeHandler.getHandleAt({ x: 150, y: 150 })).toBe(ResizeHandle.BOTTOM)
    expect(resizeHandler.getHandleAt({ x: 100, y: 150 })).toBe(ResizeHandle.BOTTOM_LEFT)
    expect(resizeHandler.getHandleAt({ x: 100, y: 125 })).toBe(ResizeHandle.LEFT)
  })

  test('should return null when no handle at point', () => {
    const point = { x: 50, y: 50 }
    expect(resizeHandler.getHandleAt(point)).toBeNull()
  })

  test('should start resize with handle', () => {
    const cell = Cell.createVertex('cell', 'Cell', { x: 0, y: 0, width: 100, height: 50 }, {
      visible: true,
      connectable: true
    })
    model.addCell(cell)

    const startPoint = { x: 50, y: 25 }

    const listener = vi.fn()
    resizeHandler.on('resize:start', listener)

    resizeHandler.startResize(cell, ResizeHandle.RIGHT, startPoint)

    expect(resizeHandler.isResizing).toBe(true)
    expect(resizeHandler.resizeCell).toBe(cell)
    expect(resizeHandler.activeHandle).toBe(ResizeHandle.RIGHT)
    expect(listener).toHaveBeenCalledWith({
      cell,
      handle: ResizeHandle.RIGHT,
      point: startPoint,
      geometry: expect.any(Object)
    })
  })

  test('should handle resize during resizing', () => {
    const cell = Cell.createVertex('cell', 'Cell', { x: 0, y: 0, width: 100, height: 50 }, {
      visible: true,
      connectable: true
    })
    model.addCell(cell)

    resizeHandler.startResize(cell, ResizeHandle.RIGHT, { x: 50, y: 25 })

    const listener = vi.fn()
    resizeHandler.on('resize:move', listener)

    const newPoint = { x: 150, y: 25 }
    resizeHandler.resizeTo(newPoint)

    expect(listener).toHaveBeenCalledWith({
      cell,
      handle: ResizeHandle.RIGHT,
      point: newPoint,
      oldGeometry: expect.any(Object),
      newGeometry: expect.any(Object)
    })
  })

  test('should stop resize and apply changes', () => {
    const cell = Cell.createVertex('cell', 'Cell', { x: 0, y: 0, width: 100, height: 50 }, {
      visible: true,
      connectable: true
    })
    model.addCell(cell)

    resizeHandler.startResize(cell, ResizeHandle.BOTTOM_RIGHT, { x: 0, y: 0 })

    const listener = vi.fn()
    resizeHandler.on('resize:end', listener)

    resizeHandler.stopResize(true)

    expect(resizeHandler.isResizing).toBe(false)
    expect(resizeHandler.resizeCell).toBe(null)
    expect(resizeHandler.activeHandle).toBeNull()
    expect(listener).toHaveBeenCalledWith({
      cell,
      handle: ResizeHandle.BOTTOM_RIGHT,
      oldGeometry: expect.any(Object),
      newGeometry: expect.any(Object),
      applied: true
    })
  })

  test('should stop resize without applying changes', () => {
    const cell = Cell.createVertex('cell', 'Cell', { x: 0, y: 0, width: 100, height: 50 }, {
      visible: true,
      connectable: true
    })
    model.addCell(cell)

    resizeHandler.startResize(cell, ResizeHandle.RIGHT, { x: 0, y: 0 })

    const listener = vi.fn()
    resizeHandler.on('resize:end', listener)

    resizeHandler.stopResize(false)

    expect(resizeHandler.isResizing).toBe(false)
    expect(listener).toHaveBeenCalledWith({
      cell,
      handle: ResizeHandle.RIGHT,
      oldGeometry: expect.any(Object),
      newGeometry: expect.any(Object),
      applied: false
    })
  })

  test('should stop resize when disabled', () => {
    const cell = Cell.createVertex('cell', 'Cell', { x: 0, y: 0, width: 100, height: 50 }, {
      visible: true,
      connectable: true
    })
    model.addCell(cell)

    resizeHandler.startResize(cell, ResizeHandle.RIGHT, { x: 0, y: 0 })
    expect(resizeHandler.isResizing).toBe(true)

    resizeHandler.setEnabled(false)
    expect(resizeHandler.isResizing).toBe(false)
    expect(resizeHandler.resizeCell).toBe(null)
  })

  test('should handle dispose', () => {
    resizeHandler.dispose()

    expect(resizeHandler.isEnabled).toBe(false)
    expect(resizeHandler.container).toBeNull()
  })

  test('should calculate new geometry correctly for each handle', () => {
    const originalGeometry = { x: 100, y: 100, width: 200, height: 150 }

    // Test TOP_LEFT handle
    let newGeometry = resizeHandler['calculateNewGeometry'](
      originalGeometry,
      ResizeHandle.TOP_LEFT,
      { x: 150, y: 125 }
    )
    expect(newGeometry.x).toBe(150)
    expect(newGeometry.y).toBe(125)
    expect(newGeometry.width).toBe(150)
    expect(newGeometry.height).toBe(125)

    // Test BOTTOM_RIGHT handle
    newGeometry = resizeHandler['calculateNewGeometry'](
      originalGeometry,
      ResizeHandle.BOTTOM_RIGHT,
      { x: 300, y: 250 }
    )
    expect(newGeometry.x).toBe(100)
    expect(newGeometry.y).toBe(100)
    expect(newGeometry.width).toBe(200)
    expect(newGeometry.height).toBe(150)

    // Test LEFT handle
    newGeometry = resizeHandler['calculateNewGeometry'](
      originalGeometry,
      ResizeHandle.LEFT,
      { x: 150, y: 125 }
    )
    expect(newGeometry.x).toBe(150)
    expect(newGeometry.y).toBe(100)
    expect(newGeometry.width).toBe(150)
    expect(newGeometry.height).toBe(150)

    // Test RIGHT handle
    newGeometry = resizeHandler['calculateNewGeometry'](
      originalGeometry,
      ResizeHandle.RIGHT,
      { x: 300, y: 125 }
    )
    expect(newGeometry.x).toBe(100)
    expect(newGeometry.y).toBe(100)
    expect(newGeometry.width).toBe(200)
    expect(newGeometry.height).toBe(150)
  })

  test('should apply minimum size constraints', () => {
    const originalGeometry = { x: 100, y: 100, width: 50, height: 30 }
    resizeHandler.setMinSize(100, 80)

    // Try to resize below minimum size
    const newGeometry = resizeHandler['calculateNewGeometry'](
      originalGeometry,
      ResizeHandle.TOP_LEFT,
      { x: 200, y: 200 }
    )

    expect(newGeometry.width).toBeGreaterThanOrEqual(100)
    expect(newGeometry.height).toBeGreaterThanOrEqual(80)
  })
})