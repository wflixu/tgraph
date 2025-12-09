import { EventEmitter } from '../interaction/EventEmitter'
import type { Cell, Geometry, GraphModel } from '../types'

/**
 * Command interface for undo/redo operations
 */
export interface Command {
  /** Unique command identifier */
  id: string
  /** Human-readable command name */
  name: string
  /** Command description */
  description?: string
  /** Execute the command */
  execute(): void
  /** Undo the command */
  undo(): void
  /** Check if command can be undone */
  canUndo(): boolean
  /** Check if command can be redone */
  canRedo(): boolean
  /** Merge with another command (optional) */
  merge?(other: Command): boolean
  /** Get command metadata */
  getMetadata?(): CommandMetadata
}

/**
 * Command metadata
 */
export interface CommandMetadata {
  /** Timestamp when command was created */
  timestamp: number
  /** Command type/category */
  type: string
  /** Affected cells */
  affectedCells: string[]
  /** Command duration in milliseconds */
  duration?: number
  /** Additional properties */
  [key: string]: any
}

/**
 * Undo manager configuration
 */
export interface UndoManagerConfig {
  /** Maximum number of undo levels */
  maxUndoLevels: number
  /** Whether to enable command merging */
  enableMerging: boolean
  /** Merge time window in milliseconds */
  mergeTimeWindow: number
  /** Whether to auto-save history */
  autoSave: boolean
  /** Auto-save interval in milliseconds */
  autoSaveInterval: number
}

/**
 * Transaction for batching multiple commands
 */
export class Transaction {
  private _commands: Command[] = []
  private _name: string
  private _description?: string
  private _timestamp: number

  constructor(name: string, description?: string) {
    this._name = name
    this._description = description
    this._timestamp = Date.now()
  }

  /**
   * Get transaction name
   */
  get name(): string {
    return this._name
  }

  /**
   * Get transaction description
   */
  get description(): string | undefined {
    return this._description
  }

  /**
   * Get timestamp
   */
  get timestamp(): number {
    return this._timestamp
  }

  /**
   * Get commands in transaction
   */
  get commands(): Command[] {
    return [...this._commands]
  }

  /**
   * Add a command to the transaction
   */
  addCommand(command: Command): void {
    this._commands.push(command)
  }

  /**
   * Get number of commands
   */
  get size(): number {
    return this._commands.length
  }

  /**
   * Execute all commands in the transaction
   */
  execute(): void {
    this._commands.forEach(command => command.execute())
  }

  /**
   * Undo all commands in reverse order
   */
  undo(): void {
    for (let i = this._commands.length - 1; i >= 0; i--) {
      this._commands[i].undo()
    }
  }
}

/**
 * Command to add/remove cells
 */
export class CellEditCommand implements Command {
  private _executed = false
  private _metadata: CommandMetadata

  constructor(
    public id: string,
    public name: string,
    private model: GraphModel,
    private cells: Cell[],
    private parent?: Cell,
    private index?: number
  ) {
    this._metadata = {
      timestamp: Date.now(),
      type: 'cell-edit',
      affectedCells: cells.map(cell => cell.id)
    }
  }

  execute(): void {
    if (this._executed) return

    if (this.parent && this.index !== undefined) {
      this.cells.forEach((cell, i) => {
        this.model.addCell(cell, this.parent, this.index + i)
      })
    } else {
      this.cells.forEach(cell => this.model.addCell(cell))
    }

    this._executed = true
  }

  undo(): void {
    if (!this._executed) return

    this.cells.forEach(cell => this.model.removeCell(cell))
    this._executed = false
  }

  canUndo(): boolean {
    return this._executed
  }

  canRedo(): boolean {
    return !this._executed
  }

  getMetadata(): CommandMetadata {
    return this._metadata
  }
}

/**
 * Command to modify cell geometry
 */
export class GeometryEditCommand implements Command {
  private _executed = false
  private _oldGeometries: Map<string, Geometry | null>
  private _metadata: CommandMetadata

  constructor(
    public id: string,
    public name: string,
    private model: GraphModel,
    private cells: Cell[],
    private newGeometries: Map<string, Geometry | null>
  ) {
    this._oldGeometries = new Map()
    this.cells.forEach(cell => {
      this._oldGeometries.set(cell.id, cell.geometry)
    })

    this._metadata = {
      timestamp: Date.now(),
      type: 'geometry-edit',
      affectedCells: cells.map(cell => cell.id)
    }
  }

  execute(): void {
    if (this._executed) return

    this.cells.forEach(cell => {
      const newGeometry = this.newGeometries.get(cell.id)
      if (newGeometry !== undefined) {
        this.model.setCellGeometry(cell, newGeometry)
      }
    })

    this._executed = true
  }

  undo(): void {
    if (!this._executed) return

    this.cells.forEach(cell => {
      const oldGeometry = this._oldGeometries.get(cell.id)
      if (oldGeometry !== undefined) {
        this.model.setCellGeometry(cell, oldGeometry)
      }
    })

    this._executed = false
  }

  canUndo(): boolean {
    return this._executed
  }

  canRedo(): boolean {
    return !this._executed
  }

  merge(other: Command): boolean {
    if (!(other instanceof GeometryEditCommand) || other.id !== this.id) {
      return false
    }

    // Merge geometry edits if they affect the same cells and are within time window
    const timeDiff = Math.abs(this._metadata.timestamp - other._metadata.timestamp)
    if (timeDiff > 1000) { // 1 second merge window
      return false
    }

    // Merge by taking the newest geometries
    other.cells.forEach(cell => {
      const newGeometry = other.newGeometries.get(cell.id)
      if (newGeometry !== undefined) {
        this.newGeometries.set(cell.id, newGeometry)
      }
    })

    this._metadata.timestamp = other._metadata.timestamp
    return true
  }

  getMetadata(): CommandMetadata {
    return this._metadata
  }
}

/**
 * Command to modify cell style
 */
export class StyleEditCommand implements Command {
  private _executed = false
  private _oldStyles: Map<string, any>
  private _metadata: CommandMetadata

  constructor(
    public id: string,
    public name: string,
    private model: GraphModel,
    private cells: Cell[],
    private newStyles: Map<string, any>
  ) {
    this._oldStyles = new Map()
    this.cells.forEach(cell => {
      this._oldStyles.set(cell.id, { ...cell.style })
    })

    this._metadata = {
      timestamp: Date.now(),
      type: 'style-edit',
      affectedCells: cells.map(cell => cell.id)
    }
  }

  execute(): void {
    if (this._executed) return

    this.cells.forEach(cell => {
      const newStyle = this.newStyles.get(cell.id)
      if (newStyle !== undefined) {
        this.model.setCellStyle(cell, newStyle)
      }
    })

    this._executed = true
  }

  undo(): void {
    if (!this._executed) return

    this.cells.forEach(cell => {
      const oldStyle = this._oldStyles.get(cell.id)
      if (oldStyle !== undefined) {
        this.model.setCellStyle(cell, oldStyle)
      }
    })

    this._executed = false
  }

  canUndo(): boolean {
    return this._executed
  }

  canRedo(): boolean {
    return !this._executed
  }

  merge(other: Command): boolean {
    if (!(other instanceof StyleEditCommand) || other.id !== this.id) {
      return false
    }

    const timeDiff = Math.abs(this._metadata.timestamp - other._metadata.timestamp)
    if (timeDiff > 1000) {
      return false
    }

    other.cells.forEach(cell => {
      const newStyle = other.newStyles.get(cell.id)
      if (newStyle !== undefined) {
        this.newStyles.set(cell.id, newStyle)
      }
    })

    this._metadata.timestamp = other._metadata.timestamp
    return true
  }

  getMetadata(): CommandMetadata {
    return this._metadata
  }
}

/**
 * Undo manager with command pattern and transaction support
 */
export class UndoManager extends EventEmitter {
  private _config: UndoManagerConfig
  private _undoStack: Command[] = []
  private _redoStack: Command[] = []
  private _currentTransaction: Transaction | null = null
  private _lastCommandTime = 0
  private _autoSaveTimer: number | null = null

  constructor(config?: Partial<UndoManagerConfig>) {
    super()
    this._config = {
      maxUndoLevels: 100,
      enableMerging: true,
      mergeTimeWindow: 1000,
      autoSave: false,
      autoSaveInterval: 30000,
      ...config
    }

    if (this._config.autoSave) {
      this.startAutoSave()
    }
  }

  /**
   * Get current configuration
   */
  get config(): UndoManagerConfig {
    return { ...this._config }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<UndoManagerConfig>): void {
    this._config = { ...this._config, ...config }

    // Restart auto-save if needed
    if (this._config.autoSave) {
      this.startAutoSave()
    } else {
      this.stopAutoSave()
    }
  }

  /**
   * Get undo stack size
   */
  get undoStackSize(): number {
    return this._undoStack.length
  }

  /**
   * Get redo stack size
   */
  get redoStackSize(): number {
    return this._redoStack.length
  }

  /**
   * Check if undo is available
   */
  get canUndo(): boolean {
    return this._undoStack.length > 0
  }

  /**
   * Check if redo is available
   */
  get canRedo(): boolean {
    return this._redoStack.length > 0
  }

  /**
   * Get current transaction
   */
  get currentTransaction(): Transaction | null {
    return this._currentTransaction
  }

  /**
   * Check if in transaction
   */
  get isInTransaction(): boolean {
    return this._currentTransaction !== null
  }

  /**
   * Execute a command
   */
  executeCommand(command: Command): void {
    try {
      command.execute()

      if (this._currentTransaction) {
        this._currentTransaction.addCommand(command)
      } else {
        this.addToHistory(command)
      }

      this.emit('command:execute', { command })
    } catch (error) {
      this.emit('command:error', { command, error })
      throw error
    }
  }

  /**
   * Undo the last command
   */
  undo(): boolean {
    if (!this.canUndo) {
      return false
    }

    const command = this._undoStack.pop()!

    try {
      command.undo()
      this._redoStack.push(command)

      this.emit('command:undo', { command })
      return true
    } catch (error) {
      this.emit('command:error', { command, error })
      this._undoStack.push(command) // Restore command
      return false
    }
  }

  /**
   * Redo the next command
   */
  redo(): boolean {
    if (!this.canRedo) {
      return false
    }

    const command = this._redoStack.pop()!

    try {
      command.execute()
      this._undoStack.push(command)

      this.emit('command:redo', { command })
      return true
    } catch (error) {
      this.emit('command:error', { command, error })
      this._redoStack.push(command) // Restore command
      return false
    }
  }

  /**
   * Start a transaction
   */
  startTransaction(name: string, description?: string): Transaction {
    if (this._currentTransaction) {
      throw new Error('Transaction already in progress')
    }

    this._currentTransaction = new Transaction(name, description)
    this.emit('transaction:start', { transaction: this._currentTransaction })

    return this._currentTransaction
  }

  /**
   * Complete the current transaction
   */
  endTransaction(): Transaction | null {
    if (!this._currentTransaction) {
      return null
    }

    const transaction = this._currentTransaction
    this._currentTransaction = null

    if (transaction.size > 0) {
      // Create a composite command for the transaction
      const compositeCommand = new CompositeCommand(
        transaction.name,
        transaction.description,
        transaction.commands
      )
      this.addToHistory(compositeCommand)
    }

    this.emit('transaction:end', { transaction })
    return transaction
  }

  /**
   * Cancel the current transaction
   */
  cancelTransaction(): Transaction | null {
    if (!this._currentTransaction) {
      return null
    }

    const transaction = this._currentTransaction
    this._currentTransaction = null

    // Undo all commands in the transaction
    transaction.undo()

    this.emit('transaction:cancel', { transaction })
    return transaction
  }

  /**
   * Execute a function within a transaction
   */
  executeInTransaction<T>(
    name: string,
    fn: () => T,
    description?: string
  ): T {
    this.startTransaction(name, description)

    try {
      const result = fn()
      this.endTransaction()
      return result
    } catch (error) {
      this.cancelTransaction()
      throw error
    }
  }

  /**
   * Clear all history
   */
  clearHistory(): void {
    this._undoStack = []
    this._redoStack = []
    this._lastCommandTime = 0

    this.emit('history:clear')
  }

  /**
   * Get undo stack (read-only)
   */
  getUndoStack(): Command[] {
    return [...this._undoStack]
  }

  /**
   * Get redo stack (read-only)
   */
  getRedoStack(): Command[] {
    return [...this._redoStack]
  }

  /**
   * Get command history as array
   */
  getHistory(): Command[] {
    return [...this._undoStack, ...this._redoStack.reverse()]
  }

  /**
   * Add command to history with merging
   */
  private addToHistory(command: Command): void {
    // Try to merge with last command if enabled
    if (this._config.enableMerging &&
        this._undoStack.length > 0 &&
        command.merge) {

      const lastCommand = this._undoStack[this._undoStack.length - 1]
      const timeDiff = Date.now() - this._lastCommandTime

      if (timeDiff <= this._config.mergeTimeWindow && lastCommand.merge(command)) {
        // Merged successfully
        return
      }
    }

    // Clear redo stack when new command is executed
    this._redoStack = []

    // Add to undo stack
    this._undoStack.push(command)
    this._lastCommandTime = Date.now()

    // Trim stack if it exceeds maximum levels
    if (this._undoStack.length > this._config.maxUndoLevels) {
      const removed = this._undoStack.shift()!
      this.emit('command:removed', { command: removed })
    }
  }

  /**
   * Start auto-save timer
   */
  private startAutoSave(): void {
    this.stopAutoSave()
    this._autoSaveTimer = window.setInterval(() => {
      this.saveHistory()
    }, this._config.autoSaveInterval)
  }

  /**
   * Stop auto-save timer
   */
  private stopAutoSave(): void {
    if (this._autoSaveTimer) {
      clearInterval(this._autoSaveTimer)
      this._autoSaveTimer = null
    }
  }

  /**
   * Save history (can be overridden for persistence)
   */
  protected saveHistory(): void {
    this.emit('history:save', {
      undoStack: this._undoStack,
      redoStack: this._redoStack
    })
  }

  /**
   * Dispose the undo manager
   */
  dispose(): void {
    this.cancelTransaction()
    this.stopAutoSave()
    this.clearHistory()
    this.removeAllListeners()
  }
}

/**
 * Composite command for grouping multiple commands
 */
class CompositeCommand implements Command {
  private _executed = false
  private _metadata: CommandMetadata

  constructor(
    public id: string,
    public name: string,
    public description: string | undefined,
    private commands: Command[]
  ) {
    this._metadata = {
      timestamp: Date.now(),
      type: 'composite',
      affectedCells: commands.flatMap(cmd =>
        cmd.getMetadata?.().affectedCells || []
      )
    }
  }

  execute(): void {
    if (this._executed) return

    this.commands.forEach(command => command.execute())
    this._executed = true
  }

  undo(): void {
    if (!this._executed) return

    for (let i = this.commands.length - 1; i >= 0; i--) {
      this.commands[i].undo()
    }
    this._executed = false
  }

  canUndo(): boolean {
    return this._executed
  }

  canRedo(): boolean {
    return !this._executed
  }

  getMetadata(): CommandMetadata {
    return this._metadata
  }
}