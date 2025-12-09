import { expect, test, describe, beforeEach, vi } from 'vitest'
import { ConnectionHandler, ConnectionConstraint } from '../src/edge/ConnectionHandler'
import { GraphModel } from '../src/model/GraphModel'
import { Cell } from '../src/model/Cell'

describe('ConnectionHandler', () => {
  let connectionHandler: ConnectionHandler
  let model: GraphModel
  let sourceCell: Cell
  let targetCell: Cell

  beforeEach(() => {
    model = new GraphModel()
    connectionHandler = new ConnectionHandler(model)

    sourceCell = Cell.createVertex('source', 'Source', { x: 0, y: 0, width: 100, height: 50 })
    targetCell = Cell.createVertex('target', 'Target', { x: 200, y: 100, width: 100, height: 50 })

    model.addCell(sourceCell)
    model.addCell(targetCell)
  })

  test('should initialize with default settings', () => {
    expect(connectionHandler.isEnabled).toBe(true)
    expect(connectionHandler.snapToPorts).toBe(true)
    expect(connectionHandler.snapToGeometry).toBe(true)
    expect(connectionHandler.snapTolerance).toBe(8)
    expect(connectionHandler.allowSelfLoops).toBe(false)
    expect(connectionHandler.allowMultipleEdges).toBe(false)
    expect(connectionHandler.isCreatingConnection).toBe(false)
  })

  test('should configure settings', () => {
    connectionHandler.setSnapToPorts(false)
    connectionHandler.setSnapToGeometry(false)
    connectionHandler.setSnapTolerance(15)
    connectionHandler.setAllowSelfLoops(true)
    connectionHandler.setAllowMultipleEdges(true)

    expect(connectionHandler.snapToPorts).toBe(false)
    expect(connectionHandler.snapToGeometry).toBe(false)
    expect(connectionHandler.snapTolerance).toBe(15)
    expect(connectionHandler.allowSelfLoops).toBe(true)
    expect(connectionHandler.allowMultipleEdges).toBe(true)
  })

  test('should start and cancel connection', () => {
    const startPoint = { x: 50, y: 25 }

    expect(connectionHandler.isCreatingConnection).toBe(false)

    connectionHandler.startConnection(sourceCell, startPoint)

    expect(connectionHandler.isCreatingConnection).toBe(true)
    expect(connectionHandler.currentConnection?.source).toBe(sourceCell)
    expect(connectionHandler.currentConnection?.waypoints).toContain(startPoint)

    connectionHandler.cancelConnection()

    expect(connectionHandler.isCreatingConnection).toBe(false)
    expect(connectionHandler.currentConnection).toBeNull()
  })

  test('should not start connection from edge cell', () => {
    const edgeCell = Cell.createEdge('edge', 'Edge')
    model.addCell(edgeCell)

    connectionHandler.startConnection(edgeCell, { x: 0, y: 0 })

    expect(connectionHandler.isCreatingConnection).toBe(false)
  })

  test('should emit events on connection start', () => {
    const listener = vi.fn()
    connectionHandler.on('connection:start', listener)

    const startPoint = { x: 50, y: 25 }
    connectionHandler.startConnection(sourceCell, startPoint)

    expect(listener).toHaveBeenCalledWith({
      source: sourceCell,
      point: startPoint,
      port: undefined,
      connection: expect.objectContaining({
        source: sourceCell,
        waypoints: [startPoint],
        isValid: true
      })
    })
  })

  test('should update connection with new points', () => {
    connectionHandler.startConnection(sourceCell, { x: 50, y: 25 })

    const midPoint = { x: 125, y: 75 }
    connectionHandler.updateConnection(midPoint)

    expect(connectionHandler.currentConnection?.waypoints).toContain(midPoint)
  })

  test('should find nearest connection target', () => {
    const point = { x: 250, y: 125 } // Near target cell

    const target = connectionHandler.findNearestConnectionTarget(point)

    expect(target).toBeDefined()
    expect(target?.cell.id).toBe(targetCell.id)
  })

  test('should respect snap tolerance when finding targets', () => {
    connectionHandler.setSnapTolerance(10)

    // Point far from any cell
    const point = { x: 500, y: 500 }
    const target = connectionHandler.findNearestConnectionTarget(point)

    expect(target).toBeNull()
  })

  test('should complete valid connection', () => {
    connectionHandler.startConnection(sourceCell, { x: 50, y: 25 })
    connectionHandler.updateConnection({ x: 250, y: 125 })

    const edge = connectionHandler.completeConnection()

    expect(edge).toBeDefined()
    expect(edge?.edge).toBe(true)
    expect(edge?.source?.id).toBe(sourceCell.id)
    expect(edge?.target?.id).toBe(targetCell.id)
  })

  test('should not complete invalid connection', () => {
    connectionHandler.setAllowSelfLoops(false)
    connectionHandler.startConnection(sourceCell, { x: 50, y: 25 })

    // Try to connect to itself
    connectionHandler.updateConnection({ x: 50, y: 25 })
    const edge = connectionHandler.completeConnection()

    expect(edge).toBeNull()
  })

  test('should validate connection constraints', () => {
    // Add source cell with no outgoing connections allowed
    sourceCell.style.constraints = { outgoing: false } as ConnectionConstraint

    connectionHandler.startConnection(sourceCell, { x: 50, y: 25 })
    connectionHandler.updateConnection({ x: 250, y: 125 })

    const validation = connectionHandler.validateConnection(sourceCell, targetCell)
    expect(validation.valid).toBe(false)
    expect(validation.error).toBe('Source does not allow outgoing connections')
  })

  test('should respect maximum connection limits', () => {
    // Add source cell with max 1 outgoing connection
    sourceCell.style.constraints = { maxConnections: 1 } as ConnectionConstraint

    // Create first edge
    const edge1 = model.createEdge('edge1', 'Edge 1')
    model.addEdge(edge1, sourceCell, targetCell)

    // Try to create second edge
    connectionHandler.startConnection(sourceCell, { x: 50, y: 25 })
    connectionHandler.updateConnection({ x: 250, y: 125 })

    const validation = connectionHandler.validateConnection(sourceCell, targetCell)
    expect(validation.valid).toBe(false)
    expect(validation.error).toBe('Source has reached maximum connection limit')
  })

  test('should prevent multiple edges when disabled', () => {
    connectionHandler.setAllowMultipleEdges(false)

    // Create first edge
    const edge1 = model.createEdge('edge1', 'Edge 1')
    model.addEdge(edge1, sourceCell, targetCell)

    // Try to create second edge
    connectionHandler.startConnection(sourceCell, { x: 50, y: 25 })
    connectionHandler.updateConnection({ x: 250, y: 125 })

    const validation = connectionHandler.validateConnection(sourceCell, targetCell)
    expect(validation.valid).toBe(false)
    expect(validation.error).toBe('Multiple connections between same cells are not allowed')
  })

  test('should allow custom validation', () => {
    const customValidator = vi.fn().mockReturnValue(false)
    sourceCell.style.constraints = {
      validate: customValidator
    } as ConnectionConstraint

    connectionHandler.startConnection(sourceCell, { x: 50, y: 25 })
    connectionHandler.updateConnection({ x: 250, y: 125 })

    const validation = connectionHandler.validateConnection(sourceCell, targetCell)
    expect(validation.valid).toBe(false)
    expect(customValidator).toHaveBeenCalledWith(sourceCell, targetCell)
  })

  test('should cancel connection when disabled', () => {
    connectionHandler.startConnection(sourceCell, { x: 50, y: 25 })
    expect(connectionHandler.isCreatingConnection).toBe(true)

    connectionHandler.setEnabled(false)

    expect(connectionHandler.isCreatingConnection).toBe(false)
    expect(connectionHandler.currentConnection).toBeNull()
  })

  test('should handle dispose correctly', () => {
    connectionHandler.startConnection(sourceCell, { x: 50, y: 25 })

    const listener = vi.fn()
    connectionHandler.on('test', listener)

    connectionHandler.dispose()

    expect(connectionHandler.isEnabled).toBe(false)
    expect(connectionHandler.isCreatingConnection).toBe(false)
  })

  test('should emit error events for failed connections', () => {
    const errorListener = vi.fn()
    connectionHandler.on('connection:error', errorListener)

    connectionHandler.setAllowSelfLoops(false)
    connectionHandler.startConnection(sourceCell, { x: 50, y: 25 })
    connectionHandler.updateConnection({ x: 50, y: 25 }) // Same point = self-loop

    connectionHandler.completeConnection()

    expect(errorListener).toHaveBeenCalledWith({
      source: sourceCell,
      target: sourceCell,
      error: 'Self-loops are not allowed',
      connection: expect.any(Object)
    })
  })

  test('should create geometry with port positions', () => {
    const port = {
      id: 'north',
      name: 'North',
      position: { x: 100, y: 0 }
    }

    connectionHandler.startConnection(sourceCell, { x: 50, y: 25 }, port)
    connectionHandler.updateConnection({ x: 250, y: 125 })

    const edge = connectionHandler.completeConnection()

    expect(edge).toBeDefined()
    expect(edge?.geometry?.points).toBeDefined()
    if (edge?.geometry?.points) {
      expect(edge.geometry.points[0]).toEqual(port.position)
    }
  })
})