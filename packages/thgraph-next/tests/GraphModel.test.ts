import { describe, it, expect } from 'vitest'
import { GraphModel } from '../src/model/GraphModel'
import { Cell } from '../src/model/Cell'
import { Geometry } from '../src/model/Geometry'

describe('GraphModel', () => {
  describe('initialization', () => {
    it('should create a model with default root', () => {
      const model = new GraphModel()

      expect(model.root).toBeDefined()
      expect(model.root.id).toBe('root')
      expect(model.cells.size).toBe(1)
      expect(model.getCell('root')).toBe(model.root)
    })

    it('should create a model with custom root', () => {
      const customRoot = Cell.vertex({ id: 'custom-root' })
      const model = new GraphModel(customRoot)

      expect(model.root).toBe(customRoot)
      expect(model.cells.size).toBe(1)
    })
  })

  describe('cell management', () => {
    it('should add a cell to the model', () => {
      const model = new GraphModel()
      const cell = Cell.vertex({ id: 'test-cell' })

      model.addCell(cell)

      expect(model.cells.size).toBe(2)
      const retrievedCell = model.getCell('test-cell')!
      expect(retrievedCell.id).toBe(cell.id)
      expect(model.root.children).toContain(retrievedCell)
      expect(retrievedCell.parent).toBe(model.root)
    })

    it('should add a cell to a specific parent', () => {
      const model = new GraphModel()
      const parent = Cell.vertex({ id: 'parent' })
      const child = Cell.vertex({ id: 'child' })

      model.addCell(parent)
      model.addCell(child, parent)

      const updatedParent = model.getCell('parent')!
      const updatedChild = model.getCell('child')!
      expect(updatedParent.children).toContain(updatedChild)
      expect(updatedChild.parent).toBe(updatedParent)
    })

    it('should throw error when adding duplicate cell', () => {
      const model = new GraphModel()
      const cell = Cell.vertex({ id: 'duplicate' })

      model.addCell(cell)

      expect(() => model.addCell(cell)).toThrow(
        "Cell with id 'duplicate' already exists"
      )
    })

    it('should remove a cell from the model', () => {
      const model = new GraphModel()
      const cell = Cell.vertex({ id: 'to-remove' })

      model.addCell(cell)
      expect(model.cells.size).toBe(2)

      model.removeCell(cell)
      expect(model.cells.size).toBe(1)
      expect(model.getCell('to-remove')).toBeUndefined()
    })

    it('should remove all descendants when removing a parent', () => {
      const model = new GraphModel()
      const parent = Cell.vertex({ id: 'parent' })
      const child = Cell.vertex({ id: 'child', parent })
      const grandchild = Cell.vertex({ id: 'grandchild', parent: child })

      model.addCell(parent)
      model.addCell(child, parent)
      model.addCell(grandchild, child)

      expect(model.cells.size).toBe(4)

      model.removeCell(parent)

      expect(model.cells.size).toBe(1) // Only root remains
      expect(model.getCell('parent')).toBeUndefined()
      expect(model.getCell('child')).toBeUndefined()
      expect(model.getCell('grandchild')).toBeUndefined()
    })

    it('should throw error when trying to remove root', () => {
      const model = new GraphModel()

      expect(() => model.removeCell(model.root)).toThrow(
        'Cannot remove root cell'
      )
    })
  })

  describe('cell updates', () => {
    it('should set cell geometry', () => {
      const model = new GraphModel()
      const cell = Cell.vertex({ id: 'test' })
      const newGeometry = Geometry.fromRectangle(10, 20, 100, 50)

      model.addCell(cell)
      model.setGeometry(cell, newGeometry)

      const updatedCell = model.getCell('test')!
      expect(updatedCell.geometry).toBe(newGeometry)
    })

    it('should set cell style', () => {
      const model = new GraphModel()
      const cell = Cell.vertex({ id: 'test' })
      const newStyle = { fillColor: 'red', strokeColor: 'black' }

      model.addCell(cell)
      model.setStyle(cell, newStyle)

      const updatedCell = model.getCell('test')!
      expect(updatedCell.style).toEqual(newStyle)
    })

    it('should set cell value', () => {
      const model = new GraphModel()
      const cell = Cell.vertex({ id: 'test' })

      model.addCell(cell)
      model.setValue(cell, 'New Value')

      const updatedCell = model.getCell('test')!
      expect(updatedCell.value).toBe('New Value')
    })

    it('should throw error when updating non-existent cell', () => {
      const model = new GraphModel()
      const nonExistentCell = Cell.vertex({ id: 'non-existent' })
      const geometry = Geometry.fromRectangle(0, 0, 10, 10)

      expect(() => model.setGeometry(nonExistentCell, geometry)).toThrow(
        "Cell with id 'non-existent' does not exist"
      )
    })
  })

  describe('transactions', () => {
    it('should batch updates in a transaction', () => {
      const model = new GraphModel()
      const cell1 = Cell.vertex({ id: 'cell1' })
      const cell2 = Cell.vertex({ id: 'cell2' })

      model.beginUpdate()
      model.addCell(cell1)
      model.addCell(cell2)
      model.endUpdate()

      expect(model.cells.size).toBe(3)
      expect(model.getCell('cell1')).toBeDefined()
      expect(model.getCell('cell2')).toBeDefined()
    })

    it('should handle nested transactions', () => {
      const model = new GraphModel()
      const cell = Cell.vertex({ id: 'test' })

      model.beginUpdate()
      model.beginUpdate()
      model.addCell(cell)
      model.endUpdate()
      model.endUpdate()

      expect(model.cells.size).toBe(2)
    })

    it('should throw error on unbalanced endUpdate', () => {
      const model = new GraphModel()

      expect(() => model.endUpdate()).toThrow(
        'endUpdate called without matching beginUpdate'
      )
    })

    it('should execute transaction method correctly', () => {
      const model = new GraphModel()
      const cell = Cell.vertex({ id: 'test' })

      const result = model.transaction(() => {
        model.addCell(cell)
        return 'success'
      })

      expect(result).toBe('success')
      expect(model.cells.size).toBe(2)
    })
  })

  describe('utility methods', () => {
    it('should create a new cell with unique ID', () => {
      const model = new GraphModel()

      const cell1 = model.createCell({ value: 'Test 1' })
      const cell2 = model.createCell({ value: 'Test 2' })

      expect(cell1.id).not.toBe(cell2.id)
      expect(model.getCell(cell1.id)).toBeUndefined()
      expect(model.getCell(cell2.id)).toBeUndefined()
    })

    it('should get cells by type', () => {
      const model = new GraphModel()
      const vertex = Cell.vertex({ id: 'vertex' })
      const edge = Cell.edge({ id: 'edge' })

      model.addCell(vertex)
      model.addCell(edge)

      const vertices = model.getCellsByType('vertex')
      const edges = model.getCellsByType('edge')

      expect(vertices).toHaveLength(3) // Includes root and parent
      expect(vertices.some(v => v.id === model.root.id)).toBe(true)
      expect(vertices.some(v => v.id === vertex.id)).toBe(true)
      expect(edges).toHaveLength(1)
      expect(edges).toContain(edge)
    })

    it('should get descendants', () => {
      const model = new GraphModel()
      const parent = Cell.vertex({ id: 'parent' })
      const child1 = Cell.vertex({ id: 'child1', parent })
      const child2 = Cell.vertex({ id: 'child2', parent })
      const grandchild = Cell.vertex({ id: 'grandchild', parent: child1 })

      model.addCell(parent)
      model.addCell(child1, parent)
      model.addCell(child2, parent)
      model.addCell(grandchild, child1)

      const descendants = model.getDescendants(parent)

      expect(descendants).toHaveLength(3)
      expect(descendants).toContain(child1)
      expect(descendants).toContain(child2)
      expect(descendants).toContain(grandchild)
    })

    it('should get model bounds', () => {
      const model = new GraphModel()
      const cell1 = Cell.vertex({
        id: 'cell1',
        geometry: Geometry.fromRectangle(10, 20, 100, 50),
      })
      const cell2 = Cell.vertex({
        id: 'cell2',
        geometry: Geometry.fromRectangle(150, 75, 50, 100),
      })

      model.addCell(cell1)
      model.addCell(cell2)

      const bounds = model.getModelBounds()

      expect(bounds).toEqual({
        x: 0, // Root at 0,0
        y: 0,
        width: 200, // 150 + 50
        height: 175, // 75 + 100
      })
    })

    it('should return null for model bounds when no geometry', () => {
      const model = new GraphModel()

      const bounds = model.getModelBounds()

      expect(bounds).toBeNull()
    })
  })

  describe('clone', () => {
    it('should create a deep clone of the model', () => {
      const model = new GraphModel()
      const parent = Cell.vertex({ id: 'parent' })
      const child = Cell.vertex({
        id: 'child',
        value: 'Test',
        geometry: Geometry.fromRectangle(10, 10, 50, 50),
        style: { fillColor: 'red' },
        parent,
      })

      model.addCell(parent)
      model.addCell(child, parent)

      const clonedModel = model.clone()

      expect(clonedModel).not.toBe(model)
      expect(clonedModel.cells.size).toBe(model.cells.size)
      expect(clonedModel.root.id).toBe(model.root.id)
      expect(clonedModel.root).not.toBe(model.root)

      const clonedParent = clonedModel.getCell('parent')!
      const clonedChild = clonedModel.getCell('child')!

      expect(clonedParent).not.toBe(parent)
      expect(clonedChild).not.toBe(child)
      expect(clonedChild.parent).toBe(clonedParent)
      expect(clonedParent.children).toContain(clonedChild)
      expect(clonedChild.value).toBe('Test')
      expect(clonedChild.style).toEqual({ fillColor: 'red' })
    })
  })
})