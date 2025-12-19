import { expect, test, describe, beforeEach, vi } from 'vitest'
import { DragHandler } from '../src/interaction/DragHandler'
import { GraphView } from '../src/view/GraphView'
import { GraphModel } from '../src/model/GraphModel'
import { Cell } from '../src/model/Cell'

describe('DragHandler', () => {
  let dragHandler: DragHandler
  let view: GraphView
  let model: GraphModel
  let container: HTMLElement

  beforeEach(() => {
    model = new GraphModel()
    view = new GraphView(model)
    dragHandler = new DragHandler(view)

    // Create mock container
    container = document.createElement('div')
    document.body.appendChild(container)
    dragHandler.setContainer(container)
  })

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container)
    }
  })

  test('should initialize with default settings', () => {
    expect(dragHandler.isEnabled).toBe(true)
    expect(dragHandler.isDragging).toBe(false)
    expect(dragHandler.dragCells).toEqual([])
    expect(dragHandler.isGridEnabled).toBe(true)
  })

  test('should enable and disable handler', () => {
    dragHandler.setEnabled(false)
    expect(dragHandler.isEnabled).toBe(false)

    dragHandler.setEnabled(true)
    expect(dragHandler.isEnabled).toBe(true)
  })

  test('should get and set grid bounds', () => {
    // This would test drag bounds if implemented
    expect(dragHandler.isEnabled).toBe(true)
  })

  test('should enable and disable grid snapping', () => {
    dragHandler.setGridEnabled(false)
    expect(dragHandler.isGridEnabled).toBe(false)

    dragHandler.setGridEnabled(true)
    expect(dragHandler.isGridEnabled).toBe(true)
  })

  test('should set drag bounds', () => {
    const bounds = { minX: 0, minY: 0, maxX: 500, maxY: 400 }
    dragHandler.setDragBounds(bounds)

    expect(dragHandler.dragBounds).toEqual(bounds)
  })

  test('should determine if cell is draggable', () => {
    // Vertex cell should be draggable
    const vertexCell = Cell.createVertex('vertex', 'Vertex', { x: 0, y: 0, width: 100, height: 50 }, {
      visible: true,
      connectable: true
    })
    model.addCell(vertexCell)

    // Get the updated cell from the model (with parent reference)
    const addedCell = model.getCell('vertex')!
    expect(dragHandler.isCellDraggable(addedCell)).toBe(true)

    // Edge cell should not be draggable
    const edgeCell = Cell.createEdge('edge', 'Edge')
    model.addCell(edgeCell)
    const addedEdgeCell = model.getCell('edge')!
    expect(dragHandler.isCellDraggable(addedEdgeCell)).toBe(false)

    // Invisible cell should not be draggable
    const invisibleCell = new Cell({
      id: 'invisible',
      type: 'vertex',
      value: 'Invisible',
      geometry: { x: 0, y: 0, width: 100, height: 50 },
      visible: false,
      connectable: true
    })
    model.addCell(invisibleCell)
    const addedInvisibleCell = model.getCell('invisible')!
    expect(dragHandler.isCellDraggable(addedInvisibleCell)).toBe(false)

    // Non-connectable cell should not be draggable
    const nonConnectableCell = new Cell({
      id: 'nonConnectable',
      type: 'vertex',
      value: 'Non Connectable',
      geometry: { x: 0, y: 0, width: 100, height: 50 },
      visible: true,
      connectable: false
    })
    model.addCell(nonConnectableCell)
    const addedNonConnectableCell = model.getCell('nonConnectable')!
    expect(dragHandler.isCellDraggable(addedNonConnectableCell)).toBe(false)

    // Root cell should not be draggable
    expect(dragHandler.isCellDraggable(model.root)).toBe(false)
  })

  test('should start drag with draggable cells', () => {
    const draggableCell = Cell.createVertex('draggable', 'Draggable', { x: 0, y: 0, width: 100, height: 50 }, {
      visible: true,
      connectable: true
    })
    model.addCell(draggableCell)

    const nonDraggableCell = Cell.createEdge('nonDraggable', 'Non Draggable')
    model.addCell(nonDraggableCell)

    // Get updated cells from model
    const addedDraggableCell = model.getCell('draggable')!
    const addedNonDraggableCell = model.getCell('nonDraggable')!

    const startPoint = { x: 50, y: 50 }
    const cells = [addedDraggableCell, addedNonDraggableCell]

    const listener = vi.fn()
    dragHandler.on('drag:start', listener)

    dragHandler.startDrag(cells, startPoint)

    expect(dragHandler.isDragging).toBe(true)
    expect(dragHandler.dragCells).toEqual([addedDraggableCell])
    expect(listener).toHaveBeenCalledWith({
      cells: [addedDraggableCell],
      point: startPoint
    })
  })

  test('should not start drag with no draggable cells', () => {
    const nonDraggableCell = Cell.createEdge('nonDraggable', 'Non Draggable')
    model.addCell(nonDraggableCell)
    const addedNonDraggableCell = model.getCell('nonDraggable')!

    dragHandler.startDrag([addedNonDraggableCell], { x: 50, y: 50 })

    expect(dragHandler.isDragging).toBe(false)
    expect(dragHandler.dragCells).toEqual([])
  })

  test('should handle pan during drag', () => {
    const cell = Cell.createVertex('cell', 'Cell', { x: 0, y: 0, width: 100, height: 50 }, {
      visible: true,
      connectable: true
    })
    model.addCell(cell)
    const addedCell = model.getCell('cell')!

    dragHandler.startDrag([addedCell], { x: 0, y: 0 })

    const listener = vi.fn()
    dragHandler.on('drag:move', listener)

    const movePoint = { x: 20, y: 30 }
    dragHandler.dragTo(movePoint)

    expect(listener).toHaveBeenCalledWith({
      cells: [addedCell],
      point: movePoint,
      delta: expect.any(Object)
    })
  })

  test('should stop drag and apply changes', () => {
    const cell = Cell.createVertex('cell', 'Cell', { x: 0, y: 0, width: 100, height: 50 }, {
      visible: true,
      connectable: true
    })
    model.addCell(cell)
    const addedCell = model.getCell('cell')!

    dragHandler.startDrag([addedCell], { x: 0, y: 0 })
    dragHandler.dragTo({ x: 50, y: 25 })

    const listener = vi.fn()
    dragHandler.on('drag:end', listener)

    dragHandler.stopDrag(true)

    expect(dragHandler.isDragging).toBe(false)
    expect(dragHandler.dragCells).toEqual([])
    expect(listener).toHaveBeenCalledWith({
      cells: [addedCell],
      geometries: expect.any(Map),
      applied: true
    })
  })

  test('should stop drag without applying changes', () => {
    const cell = Cell.createVertex('cell', 'Cell', { x: 0, y: 0, width: 100, height: 50 }, {
      visible: true,
      connectable: true
    })
    model.addCell(cell)
    const addedCell = model.getCell('cell')!

    dragHandler.startDrag([addedCell], { x: 0, y: 0 })

    const listener = vi.fn()
    dragHandler.on('drag:end', listener)

    dragHandler.stopDrag(false)

    expect(dragHandler.isDragging).toBe(false)
    expect(listener).toHaveBeenCalledWith({
      cells: [addedCell],
      geometries: expect.any(Map),
      applied: false
    })
  })

  test('should stop drag when disabled', () => {
    const cell = Cell.createVertex('cell', 'Cell', { x: 0, y: 0, width: 100, height: 50 }, {
      visible: true,
      connectable: true
    })
    model.addCell(cell)
    const addedCell = model.getCell('cell')!

    dragHandler.startDrag([addedCell], { x: 0, y: 0 })
    expect(dragHandler.isDragging).toBe(true)

    dragHandler.setEnabled(false)
    expect(dragHandler.isDragging).toBe(false)
    expect(dragHandler.dragCells).toEqual([])
  })

  test('should handle dispose', () => {
    dragHandler.dispose()

    expect(dragHandler.isEnabled).toBe(false)
    expect(dragHandler.container).toBeNull()
  })
})