import type { Point, Rectangle, Cell, Geometry } from '../types'

/**
 * Edge routing style
 */
export enum EdgeStyle {
  /** Straight line between points */
  STRAIGHT = 'straight',
  /** Orthogonal routing with horizontal and vertical segments */
  ORTHOGONAL = 'orthogonal',
  /** Curved routing using Bezier curves */
  CURVED = 'curved',
  /** Manhattan routing with spacing */
  MANHATTAN = 'manhattan',
  /** Avoid obstacles routing */
  AVOID_OBSTACLES = 'avoid-obstacles'
}

/**
 * Routing configuration
 */
export interface RoutingConfig {
  /** Routing style */
  style: EdgeStyle
  /** Spacing for orthogonal routing */
  spacing: number
  /** Curve tension for curved routing */
  curveTension: number
  /** Corner radius for orthogonal routing */
  cornerRadius: number
  /** Maximum segment length */
  maxSegmentLength: number
  /** Whether to simplify waypoints */
  simplify: boolean
  /** Obstacle avoidance settings */
  avoidObstacles: boolean
  obstacleMargin: number
}

/**
 * Routing result with path points
 */
export interface RoutingResult {
  /** Original waypoints */
  waypoints: Point[]
  /** Computed path points */
  path: Point[]
  /** Routing metadata */
  metadata: {
    length: number
    style: EdgeStyle
    segments: number
    processed: boolean
  }
}

/**
 * Advanced edge router with multiple routing algorithms
 */
export class EdgeRouter {
  private _config: RoutingConfig = {
    style: EdgeStyle.STRAIGHT,
    spacing: 20,
    curveTension: 0.5,
    cornerRadius: 8,
    maxSegmentLength: 1000,
    simplify: true,
    avoidObstacles: false,
    obstacleMargin: 10
  }

  constructor(config?: Partial<RoutingConfig>) {
    if (config) {
      this._config = { ...this._config, ...config }
    }
  }

  /**
   * Get current routing configuration
   */
  get config(): RoutingConfig {
    return { ...this._config }
  }

  /**
   * Update routing configuration
   */
  updateConfig(config: Partial<RoutingConfig>): void {
    this._config = { ...this._config, ...config }
  }

  /**
   * Route an edge from source to target
   */
  routeEdge(
    sourceGeometry: Geometry | null,
    targetGeometry: Geometry | null,
    waypoints: Point[] = [],
    obstacles: Rectangle[] = []
  ): RoutingResult {
    if (!sourceGeometry || !targetGeometry) {
      return {
        waypoints: waypoints,
        path: waypoints,
        metadata: {
          length: 0,
          style: this._config.style,
          segments: 0,
          processed: false
        }
      }
    }

    // Get connection points
    const sourcePoint = this.getConnectionPoint(sourceGeometry, waypoints[0])
    const targetPoint = this.getConnectionPoint(targetGeometry, waypoints[waypoints.length - 1])

    // Build complete waypoint list
    const allWaypoints: Point[] = [sourcePoint]
    if (waypoints.length > 0) {
      allWaypoints.push(...waypoints.slice(1, -1))
    }
    allWaypoints.push(targetPoint)

    // Route based on configured style
    let path: Point[]
    switch (this._config.style) {
      case EdgeStyle.STRAIGHT:
        path = this.routeStraight(allWaypoints)
        break
      case EdgeStyle.ORTHOGONAL:
        path = this.routeOrthogonal(allWaypoints)
        break
      case EdgeStyle.CURVED:
        path = this.routeCurved(allWaypoints)
        break
      case EdgeStyle.MANHATTAN:
        path = this.routeManhattan(allWaypoints, obstacles)
        break
      case EdgeStyle.AVOID_OBSTACLES:
        path = this.routeAvoidObstacles(allWaypoints, obstacles)
        break
      default:
        path = allWaypoints
    }

    // Simplify path if enabled
    if (this._config.simplify) {
      path = this.simplifyPath(path)
    }

    return {
      waypoints: allWaypoints,
      path,
      metadata: {
        length: this.calculatePathLength(path),
        style: this._config.style,
        segments: path.length - 1,
        processed: true
      }
    }
  }

  /**
   * Route using straight lines
   */
  private routeStraight(waypoints: Point[]): Point[] {
    return waypoints
  }

  /**
   * Route using orthogonal (horizontal/vertical) segments
   */
  private routeOrthogonal(waypoints: Point[]): Point[] {
    if (waypoints.length < 2) return waypoints

    const path: Point[] = []
    let previousPoint = waypoints[0]
    path.push(previousPoint)

    for (let i = 1; i < waypoints.length; i++) {
      const currentPoint = waypoints[i]
      const nextPoint = waypoints[i + 1]

      // Determine orthogonal connection
      const midPoints = this.createOrthogonalSegment(previousPoint, currentPoint, nextPoint)
      path.push(...midPoints)

      previousPoint = currentPoint
    }

    return this.removeDuplicates(path)
  }

  /**
   * Create orthogonal segment between two points
   */
  private createOrthogonalSegment(
    start: Point,
    end: Point,
    next?: Point
  ): Point[] {
    const points: Point[] = []

    if (start.x === end.x || start.y === end.y) {
      // Already aligned, just add end point
      points.push(end)
      return points
    }

    // Determine L-shape direction
    let midX: number
    let midY: number

    if (next) {
      // Look ahead to choose better path
      const preferHorizontal = Math.abs(end.y - next.y) < Math.abs(end.x - next.x)
      if (preferHorizontal) {
        midX = end.x
        midY = start.y
      } else {
        midX = start.x
        midY = end.y
      }
    } else {
      // Default to horizontal then vertical
      midX = end.x
      midY = start.y
    }

    // Add corner points with radius
    if (this._config.cornerRadius > 0) {
      const cornerPoint1 = { x: midX, y: start.y }
      const cornerPoint2 = { x: midX, y: end.y }

      points.push(cornerPoint1)
      points.push(cornerPoint2)
    } else {
      const midPoint = { x: midX, y: midY }
      points.push(midPoint)
    }

    points.push(end)
    return points
  }

  /**
   * Route using curved (Bezier) paths
   */
  private routeCurved(waypoints: Point[]): Point[] {
    if (waypoints.length < 2) return waypoints
    if (waypoints.length === 2) {
      return waypoints // Simple straight line
    }

    const path: Point[] = []
    const tension = this._config.curveTension
    const segments = 20 // Number of points per curve segment

    for (let i = 0; i < waypoints.length - 1; i++) {
      const p0 = waypoints[Math.max(0, i - 1)]
      const p1 = waypoints[i]
      const p2 = waypoints[i + 1]
      const p3 = waypoints[Math.min(waypoints.length - 1, i + 2)]

      const curvePoints = this.calculateBezierCurve(p0, p1, p2, p3, tension, segments)

      // Add curve points (skip first to avoid duplication)
      for (let j = i === 0 ? 0 : 1; j < curvePoints.length; j++) {
        path.push(curvePoints[j])
      }
    }

    return path
  }

  /**
   * Calculate Bezier curve points
   */
  private calculateBezierCurve(
    p0: Point,
    p1: Point,
    p2: Point,
    p3: Point,
    tension: number,
    segments: number
  ): Point[] {
    const points: Point[] = []

    // Calculate control points
    const d01 = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2))
    const d12 = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
    const d23 = Math.sqrt(Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y, 2))

    const d01_tension = d01 * tension
    const d12_tension = d12 * tension
    const d23_tension = d23 * tension

    const m1 = {
      x: p1.x + (p2.x - p0.x) / d01 * d01_tension,
      y: p1.y + (p2.y - p0.y) / d01 * d01_tension
    }

    const m2 = {
      x: p2.x - (p3.x - p1.x) / d23 * d23_tension,
      y: p2.y - (p3.y - p1.y) / d23 * d23_tension
    }

    // Generate curve points
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const point = this.cubicBezier(p1, m1, m2, p2, t)
      points.push(point)
    }

    return points
  }

  /**
   * Calculate cubic Bezier point
   */
  private cubicBezier(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
    const t2 = t * t
    const t3 = t2 * t
    const mt = 1 - t
    const mt2 = mt * mt
    const mt3 = mt2 * mt

    return {
      x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
      y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y
    }
  }

  /**
   * Route using Manhattan style with obstacles
   */
  private routeManhattan(waypoints: Point[], obstacles: Rectangle[]): Point[] {
    // Simple Manhattan routing - can be enhanced with A* pathfinding
    const path: Point[] = [waypoints[0]]

    for (let i = 0; i < waypoints.length - 1; i++) {
      const start = waypoints[i]
      const end = waypoints[i + 1]

      // Find Manhattan path avoiding obstacles
      const manhattanPath = this.findManhattanPath(start, end, obstacles)
      path.push(...manhattanPath.slice(1)) // Skip first point to avoid duplication
    }

    return this.removeDuplicates(path)
  }

  /**
   * Find Manhattan path avoiding obstacles
   */
  private findManhattanPath(start: Point, end: Point, obstacles: Rectangle[]): Point[] {
    const path: Point[] = [start]

    // Simple L-shape routing with basic obstacle avoidance
    const midPoint1 = { x: start.x, y: end.y }
    const midPoint2 = { x: end.x, y: start.y }

    // Try different path configurations
    const paths: Point[][] = [
      [midPoint1, end],
      [midPoint2, end],
      [
        { x: start.x, y: (start.y + end.y) / 2 },
        { x: end.x, y: (start.y + end.y) / 2 },
        end
      ],
      [
        { x: (start.x + end.x) / 2, y: start.y },
        { x: (start.x + end.x) / 2, y: end.y },
        end
      ]
    ]

    let bestPath = paths[0]
    let minLength = this.calculatePathLength([start, ...paths[0]])

    for (const path of paths) {
      const fullPath = [start, ...path]
      const length = this.calculatePathLength(fullPath)

      // Check if path avoids obstacles
      const avoidsObstacles = !this.pathIntersectsObstacles(fullPath, obstacles)

      if (avoidsObstacles && length < minLength) {
        bestPath = path
        minLength = length
      }
    }

    path.push(...bestPath)
    return path
  }

  /**
   * Route with obstacle avoidance
   */
  private routeAvoidObstacles(waypoints: Point[], obstacles: Rectangle[]): Point[] {
    // Enhanced obstacle avoidance using visibility graph
    // This is a simplified version - can be enhanced with full visibility graph algorithm
    const path: Point[] = []

    for (let i = 0; i < waypoints.length - 1; i++) {
      const start = waypoints[i]
      const end = waypoints[i + 1]

      // Check if direct path intersects obstacles
      if (!this.segmentIntersectsObstacles(start, end, obstacles)) {
        path.push(end)
      } else {
        // Find alternative path
        const altPath = this.findAlternativePath(start, end, obstacles)
        path.push(...altPath.slice(1)) // Skip first point
      }
    }

    return this.removeDuplicates(path)
  }

  /**
   * Find alternative path avoiding obstacles
   */
  private findAlternativePath(start: Point, end: Point, obstacles: Rectangle[]): Point[] {
    // Simple alternative path finder
    const margin = this._config.obstacleMargin
    const candidates: Point[] = []

    // Generate candidate points around obstacles
    obstacles.forEach(obstacle => {
      candidates.push(
        { x: obstacle.x - margin, y: obstacle.y - margin },
        { x: obstacle.x + obstacle.width + margin, y: obstacle.y - margin },
        { x: obstacle.x + obstacle.width + margin, y: obstacle.y + obstacle.height + margin },
        { x: obstacle.x - margin, y: obstacle.y + obstacle.height + margin }
      )
    })

    // Add intermediate grid points
    const gridSize = this._config.spacing
    for (let x = Math.min(start.x, end.x); x <= Math.max(start.x, end.x); x += gridSize) {
      for (let y = Math.min(start.y, end.y); y <= Math.max(start.y, end.y); y += gridSize) {
        candidates.push({ x, y })
      }
    }

    // Find shortest viable path (simplified A*)
    const path = this.findShortestPath(start, end, candidates, obstacles)
    return path || [end] // Fallback to direct path
  }

  /**
   * Simplified A* pathfinding
   */
  private findShortestPath(
    start: Point,
    end: Point,
    candidates: Point[],
    obstacles: Rectangle[]
  ): Point[] | null {
    // Very simplified pathfinding - can be enhanced with proper A* implementation
    const validCandidates = candidates.filter(point =>
      !this.pointInObstacle(point, obstacles) &&
      !this.segmentIntersectsObstacles(start, point, obstacles) &&
      !this.segmentIntersectsObstacles(point, end, obstacles)
    )

    if (validCandidates.length === 0) {
      return null
    }

    // Find candidate with minimal total path length
    let bestPoint = validCandidates[0]
    let bestLength = this.calculatePathLength([start, bestPoint, end])

    for (const point of validCandidates) {
      const length = this.calculatePathLength([start, point, end])
      if (length < bestLength) {
        bestPoint = point
        bestLength = length
      }
    }

    return [start, bestPoint, end]
  }

  /**
   * Get connection point on geometry
   */
  private getConnectionPoint(geometry: Geometry, waypoint?: Point): Point {
    if (!waypoint) {
      return {
        x: geometry.x + (geometry.width || 0) / 2,
        y: geometry.y + (geometry.height || 0) / 2
      }
    }

    // Find closest point on geometry boundary
    const centerX = geometry.x + (geometry.width || 0) / 2
    const centerY = geometry.y + (geometry.height || 0) / 2
    const width = geometry.width || 0
    const height = geometry.height || 0

    // Calculate intersection with geometry bounds
    const dx = waypoint.x - centerX
    const dy = waypoint.y - centerY

    if (width === 0 || height === 0) {
      return { x: centerX, y: centerY }
    }

    const aspectRatio = width / height
    const direction = Math.atan2(dy, dx)

    let x: number, y: number

    if (Math.abs(Math.tan(direction)) <= aspectRatio) {
      // Intersect with vertical sides
      x = dx > 0 ? geometry.x + width : geometry.x
      y = centerY + (x - centerX) * Math.tan(direction)
    } else {
      // Intersect with horizontal sides
      y = dy > 0 ? geometry.y + height : geometry.y
      x = centerX + (y - centerY) / Math.tan(direction)
    }

    return { x, y }
  }

  /**
   * Remove duplicate points from path
   */
  private removeDuplicates(points: Point[]): Point[] {
    const result: Point[] = []
    let lastPoint: Point | null = null

    for (const point of points) {
      if (!lastPoint || point.x !== lastPoint.x || point.y !== lastPoint.y) {
        result.push(point)
        lastPoint = point
      }
    }

    return result
  }

  /**
   * Simplify path by removing unnecessary points
   */
  private simplifyPath(points: Point[]): Point[] {
    if (points.length <= 2) return points

    const simplified: Point[] = [points[0]]

    for (let i = 1; i < points.length - 1; i++) {
      const prev = points[i - 1]
      const current = points[i]
      const next = points[i + 1]

      // Check if point is collinear and can be removed
      if (!this.isCollinear(prev, current, next)) {
        simplified.push(current)
      }
    }

    simplified.push(points[points.length - 1])
    return simplified
  }

  /**
   * Check if three points are collinear
   */
  private isCollinear(p1: Point, p2: Point, p3: Point): boolean {
    const tolerance = 0.1
    const area = Math.abs((p2.x - p1.x) * (p3.y - p1.y) - (p3.x - p1.x) * (p2.y - p1.y))
    return area < tolerance
  }

  /**
   * Calculate total path length
   */
  private calculatePathLength(points: Point[]): number {
    let length = 0
    for (let i = 0; i < points.length - 1; i++) {
      const dx = points[i + 1].x - points[i].x
      const dy = points[i + 1].y - points[i].y
      length += Math.sqrt(dx * dx + dy * dy)
    }
    return length
  }

  /**
   * Check if path intersects with obstacles
   */
  private pathIntersectsObstacles(path: Point[], obstacles: Rectangle[]): boolean {
    for (let i = 0; i < path.length - 1; i++) {
      if (this.segmentIntersectsObstacles(path[i], path[i + 1], obstacles)) {
        return true
      }
    }
    return false
  }

  /**
   * Check if segment intersects with obstacles
   */
  private segmentIntersectsObstacles(start: Point, end: Point, obstacles: Rectangle[]): boolean {
    for (const obstacle of obstacles) {
      if (this.segmentIntersectsRectangle(start, end, obstacle)) {
        return true
      }
    }
    return false
  }

  /**
   * Check if line segment intersects rectangle
   */
  private segmentIntersectsRectangle(start: Point, end: Point, rect: Rectangle): boolean {
    // Simple bounding box check first
    const minX = Math.min(start.x, end.x)
    const maxX = Math.max(start.x, end.x)
    const minY = Math.min(start.y, end.y)
    const maxY = Math.max(start.y, end.y)

    if (maxX < rect.x || minX > rect.x + rect.width ||
        maxY < rect.y || minY > rect.y + rect.height) {
      return false
    }

    // More precise line-rectangle intersection
    // This is simplified - can be enhanced with proper line clipping algorithm
    return this.pointInRectangle(start, rect) ||
           this.pointInRectangle(end, rect) ||
           this.lineIntersectsLine(start, end, { x: rect.x, y: rect.y }, { x: rect.x + rect.width, y: rect.y }) ||
           this.lineIntersectsLine(start, end, { x: rect.x + rect.width, y: rect.y }, { x: rect.x + rect.width, y: rect.y + rect.height }) ||
           this.lineIntersectsLine(start, end, { x: rect.x + rect.width, y: rect.y + rect.height }, { x: rect.x, y: rect.y + rect.height }) ||
           this.lineIntersectsLine(start, end, { x: rect.x, y: rect.y + rect.height }, { x: rect.x, y: rect.y })
  }

  /**
   * Check if point is in rectangle
   */
  private pointInRectangle(point: Point, rect: Rectangle): boolean {
    return point.x >= rect.x && point.x <= rect.x + rect.width &&
           point.y >= rect.y && point.y <= rect.y + rect.height
  }

  /**
   * Check if point is in obstacle
   */
  private pointInObstacle(point: Point, obstacles: Rectangle[]): boolean {
    return obstacles.some(obstacle => this.pointInRectangle(point, obstacle))
  }

  /**
   * Check if two line segments intersect
   */
  private lineIntersectsLine(p1: Point, p2: Point, p3: Point, p4: Point): boolean {
    const ccw = (A: Point, B: Point, C: Point) => {
      return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x)
    }
    return ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4)
  }
}