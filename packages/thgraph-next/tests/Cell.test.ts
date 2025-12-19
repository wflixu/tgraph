import { describe, it, expect } from 'vitest'
import { Cell } from '../src/model/Cell'
import { Geometry } from '../src/model/Geometry'

describe('Cell', () => {
  describe('vertex creation', () => {
    it('should create a vertex cell with minimal parameters', () => {
      const cell = Cell.vertex({ id: 'test-1' })

      expect(cell.id).toBe('test-1')
      expect(cell.type).toBe('vertex')
      expect(cell.vertex).toBe(true)
      expect(cell.edge).toBe(false)
      expect(cell.value).toBeNull()
      expect(cell.geometry).toBeNull()
      expect(cell.style).toEqual({})
      expect(cell.parent).toBeNull()
      expect(cell.children).toEqual([])
      expect(cell.source).toBeNull()
      expect(cell.target).toBeNull()
    })

    it('should create a vertex cell with all parameters', () => {
      const geometry = Geometry.fromRectangle(10, 20, 100, 50)
      const style = { fillColor: 'red', strokeColor: 'black' }
      const cell = Cell.vertex({
        id: 'test-2',
        value: 'Test Vertex',
        geometry,
        style,
        connectable: false,
        visible: false,
        collapsed: true,
      })

      expect(cell.id).toBe('test-2')
      expect(cell.value).toBe('Test Vertex')
      expect(cell.geometry).toBe(geometry)
      expect(cell.style).toEqual(style)
      expect(cell.connectable).toBe(false)
      expect(cell.visible).toBe(false)
      expect(cell.collapsed).toBe(true)
    })
  })

  describe('edge creation', () => {
    it('should create an edge cell with minimal parameters', () => {
      const edge = Cell.edge({ id: 'edge-1' })

      expect(edge.id).toBe('edge-1')
      expect(edge.type).toBe('edge')
      expect(edge.vertex).toBe(false)
      expect(edge.edge).toBe(true)
      expect(edge.source).toBeNull()
      expect(edge.target).toBeNull()
    })

    it('should create an edge cell with source and target', () => {
      const source = Cell.vertex({ id: 'source' })
      const target = Cell.vertex({ id: 'target' })
      const edge = Cell.edge({
        id: 'edge-2',
        source,
        target,
      })

      expect(edge.source).toBe(source)
      expect(edge.target).toBe(target)
    })
  })

  describe('with method', () => {
    it('should create a new cell with updated properties', () => {
      const cell = Cell.vertex({ id: 'test' })
      const newGeometry = Geometry.fromRectangle(0, 0, 50, 50)
      const newStyle = { fillColor: 'blue' }

      const updatedCell = cell.with({
        geometry: newGeometry,
        style: newStyle,
      })

      expect(updatedCell.id).toBe('test') // ID shouldn't change
      expect(updatedCell.geometry).toBe(newGeometry)
      expect(updatedCell.style).toEqual(newStyle)
    })

    it('should merge styles when updating', () => {
      const cell = Cell.vertex({
        id: 'test',
        style: { fillColor: 'red', strokeColor: 'black' },
      })

      const updatedCell = cell.with({
        style: { fillColor: 'blue' },
      })

      expect(updatedCell.style).toEqual({
        fillColor: 'blue',
        strokeColor: 'black',
      })
    })
  })

  describe('hierarchy methods', () => {
    it('should check if cell is descendant of parent', () => {
      const parent = Cell.vertex({ id: 'parent' })
      const child = Cell.vertex({ id: 'child', parent })
      const grandchild = Cell.vertex({ id: 'grandchild', parent: child })

      expect(child.isDescendant(parent)).toBe(true)
      expect(grandchild.isDescendant(parent)).toBe(true)
      expect(grandchild.isDescendant(child)).toBe(true)
      expect(parent.isDescendant(child)).toBe(false)
    })

    it('should calculate depth correctly', () => {
      const root = Cell.vertex({ id: 'root' })
      const child = Cell.vertex({ id: 'child', parent: root })
      const grandchild = Cell.vertex({ id: 'grandchild', parent: child })

      expect(root.getDepth()).toBe(0)
      expect(child.getDepth()).toBe(1)
      expect(grandchild.getDepth()).toBe(2)
    })

    it('should get path from root', () => {
      const root = Cell.vertex({ id: 'root' })
      const child = Cell.vertex({ id: 'child', parent: root })
      const grandchild = Cell.vertex({ id: 'grandchild', parent: child })

      const path = grandchild.getPath()
      expect(path).toHaveLength(3)
      expect(path[0]).toBe(root)
      expect(path[1]).toBe(child)
      expect(path[2]).toBe(grandchild)
    })
  })

  describe('connection methods', () => {
    it('should check if cells are connected', () => {
      const source = Cell.vertex({ id: 'source' })
      const target = Cell.vertex({ id: 'target' })
      const edge = Cell.edge({
        id: 'edge',
        source,
        target,
      })

      expect(edge.isConnectedTo(source)).toBe(true)
      expect(edge.isConnectedTo(target)).toBe(true)
      expect(source.isConnectedTo(edge)).toBe(false)
    })
  })

  describe('style methods', () => {
    it('should check if cell has style property', () => {
      const cell = Cell.vertex({
        id: 'test',
        style: { fillColor: 'red', strokeColor: 'black' },
      })

      expect(cell.hasStyle('fillColor')).toBe(true)
      expect(cell.hasStyle('fontSize')).toBe(false)
    })

    it('should get style property', () => {
      const cell = Cell.vertex({
        id: 'test',
        style: { fillColor: 'red', fontSize: 12 },
      })

      expect(cell.getStyle('fillColor')).toBe('red')
      expect(cell.getStyle('fontSize')).toBe(12)
    })

    it('should get style property with default', () => {
      const cell = Cell.vertex({ id: 'test', style: { fillColor: 'red' } })

      expect(cell.getStyleOrDefault('fillColor', 'blue')).toBe('red')
      expect(cell.getStyleOrDefault('fontSize', 12)).toBe(12)
    })
  })

  describe('visibility', () => {
    it('should check if cell and parents are visible', () => {
      const parent = Cell.vertex({ id: 'parent', visible: true })
      const child = Cell.vertex({ id: 'child', parent, visible: true })
      const hiddenChild = Cell.vertex({ id: 'hidden', parent, visible: false })
      const childOfHidden = Cell.vertex({ id: 'childOfHidden', parent: hiddenChild, visible: true })

      expect(parent.isVisible()).toBe(true)
      expect(child.isVisible()).toBe(true)
      expect(hiddenChild.isVisible()).toBe(false)
      expect(childOfHidden.isVisible()).toBe(false)
    })
  })

  describe('absolute geometry', () => {
    it('should calculate absolute geometry', () => {
      const parentGeometry = Geometry.fromRectangle(10, 10, 100, 100)
      const childGeometry = Geometry.fromRectangle(20, 20, 50, 50)

      const parent = Cell.vertex({ id: 'parent', geometry: parentGeometry })
      const child = Cell.vertex({ id: 'child', parent, geometry: childGeometry })

      const absoluteGeometry = child.getAbsoluteGeometry()
      expect(absoluteGeometry).not.toBeNull()
      expect(absoluteGeometry?.x).toBe(30)
      expect(absoluteGeometry?.y).toBe(30)
    })
  })
})