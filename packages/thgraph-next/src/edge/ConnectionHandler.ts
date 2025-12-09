import { EventEmitter } from '../interaction/EventEmitter'
import type { Cell, Point, Rectangle, GraphModel, Port } from '../types'

/**
 * Connection constraints and validation
 */
export interface ConnectionConstraint {
  /** Whether outgoing connections are allowed */
  outgoing?: boolean
  /** Whether incoming connections are allowed */
  incoming?: boolean
  /** Maximum number of connections */
  maxConnections?: number
  /** Allowed connection types */
  allowedTypes?: string[]
  /** Custom validation function */
  validate?: (source: Cell, target: Cell) => boolean
}

/**
 * Port information for connection points
 */
export interface ConnectionPort {
  id: string
  name: string
  position: Point
  direction?: 'north' | 'south' | 'east' | 'west'
  constraint?: ConnectionConstraint
}

/**
 * Connection state during creation
 */
export interface ConnectionState {
  source: Cell | null
  target: Cell | null
  sourcePort?: ConnectionPort
  targetPort?: ConnectionPort
  waypoints: Point[]
  isValid: boolean
  errorMessage?: string
}

/**
 * Connection handler for creating and managing graph connections
 */
export class ConnectionHandler extends EventEmitter {
  private _model: GraphModel
  private _isEnabled = true
  private _snapToPorts = true
  private _snapToGeometry = true
  private _snapTolerance = 8
  private _currentConnection: ConnectionState | null = null

  // Connection validation
  private _allowSelfLoops = false
  private _allowMultipleEdges = false
  private _defaultConstraints: ConnectionConstraint = {
    outgoing: true,
    incoming: true,
    maxConnections: Infinity
  }

  constructor(model: GraphModel) {
    super()
    this._model = model
  }

  /**
   * Get the enabled state
   */
  get isEnabled(): boolean {
    return this._isEnabled
  }

  /**
   * Enable or disable the connection handler
   */
  setEnabled(enabled: boolean): void {
    this._isEnabled = enabled
    if (!enabled && this._currentConnection) {
      this.cancelConnection()
    }
  }

  /**
   * Get snap to ports setting
   */
  get snapToPorts(): boolean {
    return this._snapToPorts
  }

  /**
   * Enable or disable snapping to ports
   */
  setSnapToPorts(snap: boolean): void {
    this._snapToPorts = snap
  }

  /**
   * Get snap to geometry setting
   */
  get snapToGeometry(): boolean {
    return this._snapToGeometry
  }

  /**
   * Enable or disable snapping to geometry bounds
   */
  setSnapToGeometry(snap: boolean): void {
    this._snapToGeometry = snap
  }

  /**
   * Get snap tolerance in pixels
   */
  get snapTolerance(): number {
    return this._snapTolerance
  }

  /**
   * Set snap tolerance in pixels
   */
  setSnapTolerance(tolerance: number): void {
    this._snapTolerance = Math.max(1, tolerance)
  }

  /**
   * Get whether self-loops are allowed
   */
  get allowSelfLoops(): boolean {
    return this._allowSelfLoops
  }

  /**
   * Enable or disable self-loops
   */
  setAllowSelfLoops(allow: boolean): void {
    this._allowSelfLoops = allow
  }

  /**
   * Get whether multiple edges between same cells are allowed
   */
  get allowMultipleEdges(): boolean {
    return this._allowMultipleEdges
  }

  /**
   * Enable or disable multiple edges between same cells
   */
  setAllowMultipleEdges(allow: boolean): void {
    this._allowMultipleEdges = allow
  }

  /**
   * Start creating a connection from a source cell
   */
  startConnection(source: Cell, point?: Point, port?: ConnectionPort): void {
    if (!this._isEnabled || source.edge) {
      return
    }

    this._currentConnection = {
      source,
      target: null,
      sourcePort: port,
      waypoints: point ? [point] : [],
      isValid: true
    }

    this.emit('connection:start', {
      source,
      point,
      port,
      connection: this._currentConnection
    })
  }

  /**
   * Update the current connection with a new point
   */
  updateConnection(point: Point): void {
    if (!this._currentConnection) {
      return
    }

    this._currentConnection.waypoints.push(point)

    // Check for nearby targets
    const nearestTarget = this.findNearestConnectionTarget(point)
    if (nearestTarget) {
      this._currentConnection.target = nearestTarget.cell
      this._currentConnection.targetPort = nearestTarget.port

      // Validate the connection
      const validation = this.validateConnection(
        this._currentConnection.source!,
        nearestTarget.cell
      )
      this._currentConnection.isValid = validation.valid
      this._currentConnection.errorMessage = validation.error

      this.emit('connection:update', {
        point,
        target: nearestTarget,
        connection: this._currentConnection
      })
    } else {
      this._currentConnection.target = null
      this._currentConnection.targetPort = undefined
      this._currentConnection.isValid = true
      this._currentConnection.errorMessage = undefined

      this.emit('connection:update', {
        point,
        connection: this._currentConnection
      })
    }
  }

  /**
   * Complete the current connection
   */
  completeConnection(): Cell | null {
    if (!this._currentConnection || !this._currentConnection.target) {
      return null
    }

    const { source, target, sourcePort, targetPort, waypoints } = this._currentConnection

    // Final validation
    const validation = this.validateConnection(source, target)
    if (!validation.valid) {
      this.emit('connection:error', {
        source,
        target,
        error: validation.error,
        connection: this._currentConnection
      })
      return null
    }

    // Create edge geometry
    const edgeGeometry = this.createEdgeGeometry(waypoints, sourcePort, targetPort)

    // Create edge cell
    const edge = this._model.createEdge(
      undefined, // Let model generate ID
      undefined, // No value
      edgeGeometry,
      {
        source: { id: source.id, port: sourcePort?.id },
        target: { id: target.id, port: targetPort?.id }
      }
    )

    // Add to model
    this._model.addEdge(edge, source, target)

    // Clear current connection
    const completedConnection = this._currentConnection
    this._currentConnection = null

    this.emit('connection:complete', {
      edge,
      source,
      target,
      connection: completedConnection
    })

    return edge
  }

  /**
   * Cancel the current connection
   */
  cancelConnection(): void {
    if (!this._currentConnection) {
      return
    }

    const cancelledConnection = this._currentConnection
    this._currentConnection = null

    this.emit('connection:cancel', {
      connection: cancelledConnection
    })
  }

  /**
   * Get the current connection state
   */
  get currentConnection(): ConnectionState | null {
    return this._currentConnection
  }

  /**
   * Check if currently creating a connection
   */
  get isCreatingConnection(): boolean {
    return this._currentConnection !== null
  }

  /**
   * Find the nearest connection target for a point
   */
  findNearestConnectionTarget(point: Point): { cell: Cell; port?: ConnectionPort } | null {
    let nearest: { cell: Cell; port?: ConnectionPort; distance: number } | null = null

    // Check all cells for potential targets
    this._model.cells.forEach(cell => {
      if (cell.edge || cell === this._currentConnection?.source) {
        return
      }

      // Check cell bounds first
      const bounds = this.getCellBounds(cell)
      if (bounds) {
        const distance = this.distanceToRectangle(point, bounds)
        if (distance <= this._snapTolerance) {
          if (!nearest || distance < nearest.distance) {
            nearest = { cell, distance }
          }
        }
      }

      // Check ports if enabled
      if (this._snapToPorts) {
        const ports = this.getCellPorts(cell)
        for (const port of ports) {
          const portDistance = Math.sqrt(
            Math.pow(point.x - port.position.x, 2) +
            Math.pow(point.y - port.position.y, 2)
          )
          if (portDistance <= this._snapTolerance) {
            if (!nearest || portDistance < nearest.distance) {
              nearest = { cell, port, distance: portDistance }
            }
          }
        }
      }
    })

    return nearest
  }

  /**
   * Validate a potential connection
   */
  validateConnection(source: Cell, target: Cell): { valid: boolean; error?: string } {
    // Check if source and target are different
    if (!this._allowSelfLoops && source === target) {
      return { valid: false, error: 'Self-loops are not allowed' }
    }

    // Check for existing connections if multiple edges are disallowed
    if (!this._allowMultipleEdges) {
      const hasExistingConnection = Array.from(this._model.cells).some(cell =>
        cell.edge &&
        cell.source?.id === source.id &&
        cell.target?.id === target.id
      )
      if (hasExistingConnection) {
        return { valid: false, error: 'Multiple connections between same cells are not allowed' }
      }
    }

    // Check source constraints
    const sourceConstraints = this.getCellConstraints(source, 'outgoing')
    if (sourceConstraints.outgoing === false) {
      return { valid: false, error: 'Source does not allow outgoing connections' }
    }
    if (sourceConstraints.maxConnections !== undefined) {
      const outgoingCount = this.getOutgoingConnectionCount(source)
      if (outgoingCount >= sourceConstraints.maxConnections) {
        return { valid: false, error: 'Source has reached maximum connection limit' }
      }
    }

    // Check target constraints
    const targetConstraints = this.getCellConstraints(target, 'incoming')
    if (targetConstraints.incoming === false) {
      return { valid: false, error: 'Target does not allow incoming connections' }
    }
    if (targetConstraints.maxConnections !== undefined) {
      const incomingCount = this.getIncomingConnectionCount(target)
      if (incomingCount >= targetConstraints.maxConnections) {
        return { valid: false, error: 'Target has reached maximum connection limit' }
      }
    }

    // Custom validation
    if (sourceConstraints.validate) {
      const customValid = sourceConstraints.validate(source, target)
      if (!customValid) {
        return { valid: false, error: 'Connection failed custom validation' }
      }
    }

    return { valid: true }
  }

  /**
   * Get cell bounds for snapping
   */
  private getCellBounds(cell: Cell): Rectangle | null {
    if (!cell.geometry) {
      return null
    }

    return {
      x: cell.geometry.x,
      y: cell.geometry.y,
      width: cell.geometry.width || 0,
      height: cell.geometry.height || 0
    }
  }

  /**
   * Calculate distance from point to rectangle
   */
  private distanceToRectangle(point: Point, rect: Rectangle): number {
    const dx = Math.max(rect.x - point.x, 0, point.x - (rect.x + rect.width))
    const dy = Math.max(rect.y - point.y, 0, point.y - (rect.y + rect.height))
    return Math.sqrt(dx * dx + dy * dy)
  }

  /**
   * Get ports for a cell
   */
  private getCellPorts(cell: Cell): ConnectionPort[] {
    // Extract ports from cell style or geometry
    const ports: ConnectionPort[] = []

    // Default ports based on geometry
    if (cell.geometry) {
      const { x, y, width = 0, height = 0 } = cell.geometry

      // Add default ports at cardinal points
      ports.push(
        {
          id: 'north',
          name: 'North',
          position: { x: x + width / 2, y },
          direction: 'north'
        },
        {
          id: 'south',
          name: 'South',
          position: { x: x + width / 2, y: y + height },
          direction: 'south'
        },
        {
          id: 'east',
          name: 'East',
          position: { x: x + width, y: y + height / 2 },
          direction: 'east'
        },
        {
          id: 'west',
          name: 'West',
          position: { x, y: y + height / 2 },
          direction: 'west'
        }
      )
    }

    // Extract custom ports from cell style
    const cellPorts = cell.style.ports as ConnectionPort[] | undefined
    if (cellPorts) {
      ports.push(...cellPorts)
    }

    return ports
  }

  /**
   * Get connection constraints for a cell
   */
  private getCellConstraints(cell: Cell, direction: 'incoming' | 'outgoing'): ConnectionConstraint {
    // Get constraints from cell style
    const styleConstraints = cell.style.constraints as ConnectionConstraint | undefined
    if (styleConstraints) {
      return { ...this._defaultConstraints, ...styleConstraints }
    }

    return this._defaultConstraints
  }

  /**
   * Get outgoing connection count for a cell
   */
  private getOutgoingConnectionCount(cell: Cell): number {
    return Array.from(this._model.cells).filter(edge =>
      edge.edge && edge.source?.id === cell.id
    ).length
  }

  /**
   * Get incoming connection count for a cell
   */
  private getIncomingConnectionCount(cell: Cell): number {
    return Array.from(this._model.cells).filter(edge =>
      edge.edge && edge.target?.id === cell.id
    ).length
  }

  /**
   * Create edge geometry from waypoints and ports
   */
  private createEdgeGeometry(waypoints: Point[], sourcePort?: ConnectionPort, targetPort?: ConnectionPort): any {
    // Filter out duplicate or invalid waypoints
    const filteredWaypoints = waypoints.filter((point, index) => {
      if (index === 0 || index === waypoints.length - 1) {
        return true // Keep first and last points
      }
      return point.x !== undefined && point.y !== undefined
    })

    // Add port positions as waypoints if they exist
    const allWaypoints: Point[] = []
    if (sourcePort) {
      allWaypoints.push(sourcePort.position)
    }
    allWaypoints.push(...filteredWaypoints)
    if (targetPort) {
      allWaypoints.push(targetPort.position)
    }

    return {
      points: allWaypoints.length > 0 ? allWaypoints : undefined,
      relative: false
    }
  }

  /**
   * Dispose the connection handler
   */
  dispose(): void {
    this.cancelConnection()
    this.removeAllListeners()
    this._isEnabled = false
  }
}