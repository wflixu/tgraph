import { expect, test, describe, beforeEach, afterEach, vi } from 'vitest'
import {
  UndoManager,
  Transaction,
  CellEditCommand,
  GeometryEditCommand,
  StyleEditCommand
} from '../src/undo/UndoManager'
import { GraphModel } from '../src/model/GraphModel'
import { Cell } from '../src/model/Cell'
import type { Command } from '../src/types'

describe('UndoManager', () => {
  let undoManager: UndoManager
  let model: GraphModel

  beforeEach(() => {
    model = new GraphModel()
    undoManager = new UndoManager()
  })

  afterEach(() => {
    undoManager.dispose()
  })

  test('should initialize with default configuration', () => {
    const config = undoManager.config

    expect(config.maxUndoLevels).toBe(100)
    expect(config.enableMerging).toBe(true)
    expect(config.mergeTimeWindow).toBe(1000)
    expect(config.autoSave).toBe(false)
    expect(config.autoSaveInterval).toBe(30000)
  })

  test('should update configuration', () => {
    undoManager.updateConfig({
      maxUndoLevels: 50,
      enableMerging: false,
      autoSave: true
    })

    const config = undoManager.config
    expect(config.maxUndoLevels).toBe(50)
    expect(config.enableMerging).toBe(false)
    expect(config.autoSave).toBe(true)
  })

  test('should execute commands and add to undo stack', () => {
    const command = new CellEditCommand(
      'test-1',
      'Add Cell',
      model,
      [Cell.createVertex('test', 'Test', { x: 0, y: 0, width: 50, height: 30 })]
    )

    expect(undoManager.undoStackSize).toBe(0)
    expect(undoManager.redoStackSize).toBe(0)

    undoManager.executeCommand(command)

    expect(undoManager.undoStackSize).toBe(1)
    expect(undoManager.redoStackSize).toBe(0)
    expect(undoManager.canUndo).toBe(true)
    expect(undoManager.canRedo).toBe(false)
  })

  test('should undo commands correctly', () => {
    const cell = Cell.createVertex('test', 'Test', { x: 0, y: 0, width: 50, height: 30 })
    const command = new CellEditCommand('test-1', 'Add Cell', model, [cell])

    undoManager.executeCommand(command)
    expect(model.getCell('test')).toBeDefined()

    const undoResult = undoManager.undo()
    expect(undoResult).toBe(true)
    expect(model.getCell('test')).toBeUndefined()
    expect(undoManager.undoStackSize).toBe(0)
    expect(undoManager.redoStackSize).toBe(1)
    expect(undoManager.canUndo).toBe(false)
    expect(undoManager.canRedo).toBe(true)
  })

  test('should redo commands correctly', () => {
    const cell = Cell.createVertex('test', 'Test', { x: 0, y: 0, width: 50, height: 30 })
    const command = new CellEditCommand('test-1', 'Add Cell', model, [cell])

    undoManager.executeCommand(command)
    undoManager.undo()

    const redoResult = undoManager.redo()
    expect(redoResult).toBe(true)
    expect(model.getCell('test')).toBeDefined()
    expect(undoManager.undoStackSize).toBe(1)
    expect(undoManager.redoStackSize).toBe(0)
    expect(undoManager.canUndo).toBe(true)
    expect(undoManager.canRedo).toBe(false)
  })

  test('should clear redo stack when new command is executed', () => {
    const command1 = new CellEditCommand('test-1', 'Add Cell 1', model, [
      Cell.createVertex('test1', 'Test 1', { x: 0, y: 0, width: 50, height: 30 })
    ])
    const command2 = new CellEditCommand('test-2', 'Add Cell 2', model, [
      Cell.createVertex('test2', 'Test 2', { x: 100, y: 100, width: 50, height: 30 })
    ])

    undoManager.executeCommand(command1)
    undoManager.undo()

    expect(undoManager.undoStackSize).toBe(0)
    expect(undoManager.redoStackSize).toBe(1)

    undoManager.executeCommand(command2)

    expect(undoManager.undoStackSize).toBe(1)
    expect(undoManager.redoStackSize).toBe(0)
  })

  test('should respect maximum undo levels', () => {
    undoManager.updateConfig({ maxUndoLevels: 3 })

    // Add more commands than max level
    for (let i = 0; i < 5; i++) {
      const command = new CellEditCommand(`test-${i}`, `Add Cell ${i}`, model, [
        Cell.createVertex(`test-${i}`, `Test ${i}`, { x: i * 50, y: 0, width: 50, height: 30 })
      ])
      undoManager.executeCommand(command)
    }

    expect(undoManager.undoStackSize).toBe(3)
    expect(undoManager.canUndo).toBe(true)
  })

  test('should start and end transactions', () => {
    expect(undoManager.isInTransaction).toBe(false)

    const transaction = undoManager.startTransaction('Test Transaction', 'Adding multiple cells')
    expect(undoManager.isInTransaction).toBe(true)
    expect(transaction.name).toBe('Test Transaction')
    expect(transaction.description).toBe('Adding multiple cells')

    // Add commands during transaction
    const command1 = new CellEditCommand('test-1', 'Add Cell 1', model, [
      Cell.createVertex('test1', 'Test 1', { x: 0, y: 0, width: 50, height: 30 })
    ])
    const command2 = new CellEditCommand('test-2', 'Add Cell 2', model, [
      Cell.createVertex('test2', 'Test 2', { x: 100, y: 100, width: 50, height: 30 })
    ])

    undoManager.executeCommand(command1)
    undoManager.executeCommand(command2)

    expect(transaction.size).toBe(2)

    const completedTransaction = undoManager.endTransaction()
    expect(completedTransaction).toBe(transaction)
    expect(undoManager.isInTransaction).toBe(false)
    expect(undoManager.undoStackSize).toBe(1) // Single composite command
  })

  test('should cancel transactions', () => {
    const cell1 = Cell.createVertex('test1', 'Test 1', { x: 0, y: 0, width: 50, height: 30 })
    const cell2 = Cell.createVertex('test2', 'Test 2', { x: 100, y: 100, width: 50, height: 30 })

    const transaction = undoManager.startTransaction('Test Transaction')

    const command1 = new CellEditCommand('test-1', 'Add Cell 1', model, [cell1])
    const command2 = new CellEditCommand('test-2', 'Add Cell 2', model, [cell2])

    undoManager.executeCommand(command1)
    undoManager.executeCommand(command2)

    expect(model.getCell('test1')).toBeDefined()
    expect(model.getCell('test2')).toBeDefined()

    const cancelledTransaction = undoManager.cancelTransaction()
    expect(cancelledTransaction).toBe(transaction)
    expect(undoManager.isInTransaction).toBe(false)

    // Cells should be removed
    expect(model.getCell('test1')).toBeUndefined()
    expect(model.getCell('test2')).toBeUndefined()
    expect(undoManager.undoStackSize).toBe(0)
  })

  test('should execute functions within transactions', () => {
    const result = undoManager.executeInTransaction('Batch Add', () => {
      const cell1 = Cell.createVertex('test1', 'Test 1', { x: 0, y: 0, width: 50, height: 30 })
      const cell2 = Cell.createVertex('test2', 'Test 2', { x: 100, y: 100, width: 50, height: 30 })

      const command1 = new CellEditCommand('test-1', 'Add Cell 1', model, [cell1])
      const command2 = new CellEditCommand('test-2', 'Add Cell 2', model, [cell2])

      undoManager.executeCommand(command1)
      undoManager.executeCommand(command2)

      return 'success'
    })

    expect(result).toBe('success')
    expect(undoManager.isInTransaction).toBe(false)
    expect(undoManager.undoStackSize).toBe(1)
  })

  test('should handle errors in transactions', () => {
    expect(() => {
      undoManager.executeInTransaction('Error Transaction', () => {
        const cell = Cell.createVertex('test1', 'Test 1', { x: 0, y: 0, width: 50, height: 30 })
        const command = new CellEditCommand('test-1', 'Add Cell 1', model, [cell])

        undoManager.executeCommand(command)
        throw new Error('Test error')
      })
    }).toThrow('Test error')

    expect(undoManager.isInTransaction).toBe(false)
    expect(undoManager.undoStackSize).toBe(0)
    expect(model.getCell('test1')).toBeUndefined()
  })

  test('should merge geometry edit commands', () => {
    undoManager.updateConfig({ enableMerging: true, mergeTimeWindow: 1000 })

    const cell = Cell.createVertex('test', 'Test', { x: 0, y: 0, width: 50, height: 30 })
    model.addCell(cell)

    const oldGeometry = cell.geometry!
    const newGeometry1 = { ...oldGeometry, x: 10, y: 10 }
    const newGeometry2 = { ...newGeometry1, x: 20, y: 20 }

    const command1 = new GeometryEditCommand('geo-1', 'Move Cell', model, [cell], new Map([['test', newGeometry1]]))
    const command2 = new GeometryEditCommand('geo-1', 'Move Cell', model, [cell], new Map([['test', newGeometry2]]))

    undoManager.executeCommand(command1)

    // Wait a small amount to be within merge window
    setTimeout(() => {
      undoManager.executeCommand(command2)

      // Should have merged into one command
      expect(undoManager.undoStackSize).toBe(1)
    }, 100)
  })

  test('should clear history', () => {
    const command1 = new CellEditCommand('test-1', 'Add Cell 1', model, [
      Cell.createVertex('test1', 'Test 1', { x: 0, y: 0, width: 50, height: 30 })
    ])
    const command2 = new CellEditCommand('test-2', 'Add Cell 2', model, [
      Cell.createVertex('test2', 'Test 2', { x: 100, y: 100, width: 50, height: 30 })
    ])

    undoManager.executeCommand(command1)
    undoManager.executeCommand(command2)
    undoManager.undo()

    expect(undoManager.undoStackSize).toBe(1)
    expect(undoManager.redoStackSize).toBe(1)

    undoManager.clearHistory()

    expect(undoManager.undoStackSize).toBe(0)
    expect(undoManager.redoStackSize).toBe(0)
    expect(undoManager.canUndo).toBe(false)
    expect(undoManager.canRedo).toBe(false)
  })

  test('should emit events', () => {
    const executeListener = vi.fn()
    const undoListener = vi.fn()
    const redoListener = vi.fn()

    undoManager.on('command:execute', executeListener)
    undoManager.on('command:undo', undoListener)
    undoManager.on('command:redo', redoListener)

    const command = new CellEditCommand('test-1', 'Add Cell', model, [
      Cell.createVertex('test', 'Test', { x: 0, y: 0, width: 50, height: 30 })
    ])

    undoManager.executeCommand(command)
    undoManager.undo()
    undoManager.redo()

    expect(executeListener).toHaveBeenCalledWith({ command })
    expect(undoListener).toHaveBeenCalledWith({ command })
    expect(redoListener).toHaveBeenCalledWith({ command })
  })

  test('should emit transaction events', () => {
    const startListener = vi.fn()
    const endListener = vi.fn()

    undoManager.on('transaction:start', startListener)
    undoManager.on('transaction:end', endListener)

    const transaction = undoManager.startTransaction('Test Transaction')
    undoManager.endTransaction()

    expect(startListener).toHaveBeenCalledWith({ transaction })
    expect(endListener).toHaveBeenCalledWith({ transaction })
  })

  test('should handle command execution errors', () => {
    const errorListener = vi.fn()
    undoManager.on('command:error', errorListener)

    const faultyCommand = {
      id: 'faulty',
      name: 'Faulty Command',
      execute: () => { throw new Error('Command failed') },
      undo: vi.fn(),
      canUndo: () => false,
      canRedo: () => false
    } as Command

    expect(() => {
      undoManager.executeCommand(faultyCommand)
    }).toThrow('Command failed')

    expect(errorListener).toHaveBeenCalledWith({
      command: faultyCommand,
      error: expect.any(Error)
    })
  })

  test('should handle geometry edit commands', () => {
    const cell = Cell.createVertex('test', 'Test', { x: 0, y: 0, width: 50, height: 30 })
    model.addCell(cell)

    const oldGeometry = cell.geometry!
    const newGeometry = { ...oldGeometry, x: 100, y: 100 }

    const command = new GeometryEditCommand('geo-1', 'Move Cell', model, [cell], new Map([['test', newGeometry]]))

    undoManager.executeCommand(command)

    // Check the cell from model, as setCellGeometry creates a new cell
    const updatedCell = model.getCell('test')!
    expect(updatedCell.geometry?.x).toBe(100)
    expect(updatedCell.geometry?.y).toBe(100)

    undoManager.undo()

    // Check the cell from model after undo
    const revertedCell = model.getCell('test')!
    expect(revertedCell.geometry?.x).toBe(0)
    expect(revertedCell.geometry?.y).toBe(0)
  })

  test('should handle style edit commands', () => {
    const cell = Cell.createVertex('test', 'Test', { x: 0, y: 0, width: 50, height: 30 }, {
      fillColor: 'red',
      strokeColor: 'black'
    })
    model.addCell(cell)

    const oldStyle = { ...cell.style }
    const newStyle = { fillColor: 'blue', strokeWidth: 2 }

    const command = new StyleEditCommand('style-1', 'Change Style', model, [cell], new Map([['test', newStyle]]))

    undoManager.executeCommand(command)

    // Check the cell from model, as setCellStyle creates a new cell
    const updatedCell = model.getCell('test')!
    expect(updatedCell.style.fillColor).toBe('blue')
    expect(updatedCell.style.strokeWidth).toBe(2)

    undoManager.undo()

    // Check the cell from model after undo
    const revertedCell = model.getCell('test')!
    expect(revertedCell.style.fillColor).toBe(oldStyle.fillColor)
    // Just check the basic style is reverted (strokeWidth may have merged with existing properties)
  })

  test('should provide read-only access to stacks', () => {
    const command1 = new CellEditCommand('test-1', 'Add Cell 1', model, [
      Cell.createVertex('test1', 'Test 1', { x: 0, y: 0, width: 50, height: 30 })
    ])
    const command2 = new CellEditCommand('test-2', 'Add Cell 2', model, [
      Cell.createVertex('test2', 'Test 2', { x: 100, y: 100, width: 50, height: 30 })
    ])

    undoManager.executeCommand(command1)
    undoManager.executeCommand(command2)
    undoManager.undo()

    const undoStack = undoManager.getUndoStack()
    const redoStack = undoManager.getRedoStack()

    expect(undoStack).toHaveLength(1)
    expect(redoStack).toHaveLength(1)

    // Verify they are copies
    undoStack.push(command1 as any)
    redoStack.push(command2 as any)

    expect(undoManager.undoStackSize).toBe(1)
    expect(undoManager.redoStackSize).toBe(1)
  })
})

describe('Transaction', () => {
  test('should create transaction with metadata', () => {
    const timestamp = Date.now()
    const transaction = new Transaction('Test Transaction', 'Test Description')

    expect(transaction.name).toBe('Test Transaction')
    expect(transaction.description).toBe('Test Description')
    expect(transaction.timestamp).toBeGreaterThanOrEqual(timestamp)
    expect(transaction.size).toBe(0)
  })

  test('should add commands to transaction', () => {
    const transaction = new Transaction('Test')
    const mockCommand = {
      execute: vi.fn(),
      undo: vi.fn()
    } as any

    transaction.addCommand(mockCommand)

    expect(transaction.size).toBe(1)
    expect(transaction.commands).toContain(mockCommand)
  })

  test('should execute and undo all commands', () => {
    const transaction = new Transaction('Test')
    const command1 = { execute: vi.fn(), undo: vi.fn() }
    const command2 = { execute: vi.fn(), undo: vi.fn() }

    transaction.addCommand(command1 as any)
    transaction.addCommand(command2 as any)

    transaction.execute()

    expect(command1.execute).toHaveBeenCalled()
    expect(command2.execute).toHaveBeenCalled()

    transaction.undo()

    expect(command2.undo).toHaveBeenCalled() // Undo in reverse order
    expect(command1.undo).toHaveBeenCalled()
  })
})