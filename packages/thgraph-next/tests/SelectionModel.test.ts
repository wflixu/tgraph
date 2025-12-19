import { expect, test, describe, beforeEach } from 'vitest'
import { SelectionModel } from '../src/interaction/SelectionModel'
import { Cell } from '../src/model/Cell'
import { Geometry } from '../src/model/Geometry'

describe('SelectionModel', () => {
  let selectionModel: SelectionModel
  let mockCell1: Cell
  let mockCell2: Cell
  let mockCell3: Cell

  beforeEach(() => {
    selectionModel = new SelectionModel()

    // Create mock cells for testing
    mockCell1 = Cell.createVertex('cell1', 'Cell 1', { x: 0, y: 0, width: 100, height: 50 }, {
      shape: 'rectangle',
      visible: true,
      connectable: true
    })

    mockCell2 = Cell.createVertex('cell2', 'Cell 2', { x: 100, y: 0, width: 100, height: 50 }, {
      shape: 'rectangle',
      visible: true,
      connectable: true
    })

    mockCell3 = Cell.createVertex('cell3', 'Cell 3', { x: 200, y: 0, width: 100, height: 50 }, {
      shape: 'rectangle',
      visible: true,
      connectable: true
    })
  })

  test('should start with empty selection', () => {
    expect(selectionModel.isEmpty()).toBe(true)
    expect(selectionModel.selection).toEqual([])
    expect(selectionModel.size()).toBe(0)
  })

  test('should select single cell', () => {
    const listener = vi.fn()
    selectionModel.on('selection:changed', listener)

    selectionModel.selectCell(mockCell1, false)

    expect(selectionModel.isSelected(mockCell1)).toBe(true)
    expect(selectionModel.selection).toEqual([mockCell1])
    expect(selectionModel.size()).toBe(1)
    expect(listener).toHaveBeenCalledWith({
      added: [mockCell1],
      removed: [],
      selection: [mockCell1]
    })
  })

  test('should replace selection when selecting without add flag', () => {
    selectionModel.selectCell(mockCell1, false)
    selectionModel.selectCell(mockCell2, false)

    expect(selectionModel.isSelected(mockCell1)).toBe(false)
    expect(selectionModel.isSelected(mockCell2)).toBe(true)
    expect(selectionModel.selection).toEqual([mockCell2])
  })

  test('should add to selection when selecting with add flag', () => {
    selectionModel.selectCell(mockCell1, false)
    selectionModel.selectCell(mockCell2, true)

    expect(selectionModel.isSelected(mockCell1)).toBe(true)
    expect(selectionModel.isSelected(mockCell2)).toBe(true)
    expect(selectionModel.selection).toHaveLength(2)
  })

  test('should toggle cell selection', () => {
    selectionModel.toggleCell(mockCell1)
    expect(selectionModel.isSelected(mockCell1)).toBe(true)

    selectionModel.toggleCell(mockCell1)
    expect(selectionModel.isSelected(mockCell1)).toBe(false)
  })

  test('should deselect cell', () => {
    selectionModel.selectCell(mockCell1, false)
    selectionModel.selectCell(mockCell2, true)

    selectionModel.deselectCell(mockCell1)

    expect(selectionModel.isSelected(mockCell1)).toBe(false)
    expect(selectionModel.isSelected(mockCell2)).toBe(true)
  })

  test('should clear all selection', () => {
    selectionModel.selectCell(mockCell1, false)
    selectionModel.selectCell(mockCell2, true)

    selectionModel.clearSelection()

    expect(selectionModel.isEmpty()).toBe(true)
    expect(selectionModel.selection).toEqual([])
  })

  test('should select multiple cells at once', () => {
    const listener = vi.fn()
    selectionModel.on('selection:changed', listener)

    selectionModel.selectCells([mockCell1, mockCell2, mockCell3])

    expect(selectionModel.selection).toHaveLength(3)
    expect(selectionModel.isSelected(mockCell1)).toBe(true)
    expect(selectionModel.isSelected(mockCell2)).toBe(true)
    expect(selectionModel.isSelected(mockCell3)).toBe(true)
  })

  test('should deselect multiple cells at once', () => {
    selectionModel.selectCells([mockCell1, mockCell2, mockCell3])
    selectionModel.deselectCells([mockCell1, mockCell3])

    expect(selectionModel.selection).toEqual([mockCell2])
    expect(selectionModel.isSelected(mockCell1)).toBe(false)
    expect(selectionModel.isSelected(mockCell2)).toBe(true)
    expect(selectionModel.isSelected(mockCell3)).toBe(false)
  })

  test('should get selected cell', () => {
    expect(selectionModel.getCell()).toBeUndefined()

    selectionModel.selectCell(mockCell1, false)
    expect(selectionModel.getCell()).toBe(mockCell1)

    selectionModel.selectCell(mockCell2, true)
    expect(selectionModel.getCell()).toBe(mockCell1) // First cell remains primary selection
  })

  test('should work with single selection mode', () => {
    const singleSelectionModel = new SelectionModel(true)

    singleSelectionModel.selectCell(mockCell1, false)
    expect(singleSelectionModel.selection).toEqual([mockCell1])

    singleSelectionModel.selectCell(mockCell2, false)
    expect(singleSelectionModel.selection).toEqual([mockCell2])

    // Add flag should be ignored in single selection mode
    singleSelectionModel.selectCell(mockCell3, true)
    expect(singleSelectionModel.selection).toEqual([mockCell3])
  })

  test('should select all cells from iterable', () => {
    const cells = [mockCell1, mockCell2, mockCell3]
    selectionModel.selectAll(cells)

    expect(selectionModel.selection).toEqual(cells)
    expect(selectionModel.size()).toBe(3)
  })

  test('should determine if cell is selectable', () => {
    const visibleCell = Cell.createVertex('visible', 'Visible', { x: 0, y: 0, width: 100, height: 50 }, {
      visible: true,
      connectable: true
    })

    const invisibleCell = Cell.createVertex('invisible', 'Invisible', { x: 0, y: 0, width: 100, height: 50 }, {
      visible: false,
      connectable: true
    })

    const nonConnectableCell = Cell.createVertex('nonConnectable', 'Non Connectable', { x: 0, y: 0, width: 100, height: 50 }, {
      visible: true,
      connectable: false
    })

    expect(selectionModel.isSelectable(visibleCell)).toBe(true)
    expect(selectionModel.isSelectable(invisibleCell)).toBe(false)
    expect(selectionModel.isSelectable(nonConnectableCell)).toBe(false)
  })

  test('should get cells in area', () => {
    const cellOutside = Cell.createVertex('outside', 'Outside', { x: 200, y: 200, width: 50, height: 50 }, {
      visible: true,
      connectable: true
    })

    const cells = [mockCell1, mockCell2, mockCell3, cellOutside]
    const cellsInArea = selectionModel.getCellsInArea(cells, 0, 0, 300, 100)

    expect(cellsInArea).toHaveLength(3)
    expect(cellsInArea).toContain(mockCell1)
    expect(cellsInArea).toContain(mockCell2)
    expect(cellsInArea).toContain(mockCell3)
    expect(cellsInArea).not.toContain(cellOutside)
  })
})