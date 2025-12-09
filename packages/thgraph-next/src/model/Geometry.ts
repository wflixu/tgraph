import type { Geometry as IGeometry, Point } from '../types/index.js'

/**
 * Immutable implementation of the Geometry interface
 */
export class Geometry implements IGeometry {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly points: readonly Point[] | undefined
  readonly offsets: Geometry | undefined
  readonly relative: boolean
  readonly terminal: Point | undefined

  constructor(params: {
    x?: number
    y?: number
    width?: number
    height?: number
    points?: readonly Point[]
    offsets?: Geometry
    relative?: boolean
    terminal?: Point
  } = {}) {
    this.x = params.x ?? 0
    this.y = params.y ?? 0
    this.width = params.width ?? 0
    this.height = params.height ?? 0
    this.points = params.points
    this.offsets = params.offsets
    this.relative = params.relative ?? false
    this.terminal = params.terminal
  }

  /**
   * Create a geometry from x, y, width, height
   */
  static fromRectangle(x: number, y: number, width: number, height: number): Geometry {
    return new Geometry({ x, y, width, height })
  }

  /**
   * Create a geometry from a point (for edges)
   */
  static fromPoint(point: Point): Geometry {
    return new Geometry({ x: point.x, y: point.y })
  }

  /**
   * Create a geometry with points (for edges)
   */
  static fromPoints(points: readonly Point[]): Geometry {
    if (points.length === 0) {
      throw new Error('Points array cannot be empty')
    }

    const first = points[0]
    return new Geometry({
      x: first.x,
      y: first.y,
      points,
    })
  }

  /**
   * Create a new Geometry with updated properties
   */
  with(params: Partial<{
    x: number
    y: number
    width: number
    height: number
    points: readonly Point[]
    offsets: Geometry
    relative: boolean
    terminal: Point
  }>): Geometry {
    return new Geometry({
      x: params.x ?? this.x,
      y: params.y ?? this.y,
      width: params.width ?? this.width,
      height: params.height ?? this.height,
      points: params.points ?? this.points,
      offsets: params.offsets ?? this.offsets,
      relative: params.relative ?? this.relative,
      terminal: params.terminal ?? this.terminal,
    })
  }

  /**
   * Translate the geometry by dx, dy
   */
  translate(dx: number, dy: number): Geometry {
    return this.with({
      x: this.x + dx,
      y: this.y + dy,
      points: this.points?.map(p => ({ x: p.x + dx, y: p.y + dy })),
    })
  }

  /**
   * Scale the geometry by sx, sy around an optional center point
   */
  scale(sx: number, sy: number, center?: Point): Geometry {
    const cx = center?.x ?? this.x + this.width / 2
    const cy = center?.y ?? this.y + this.height / 2

    const newX = cx + (this.x - cx) * sx
    const newY = cy + (this.y - cy) * sy
    const newWidth = this.width * sx
    const newHeight = this.height * sy

    return new Geometry({
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
      points: this.points?.map(p => ({
        x: cx + (p.x - cx) * sx,
        y: cy + (p.y - cy) * sy,
      })),
    })
  }

  /**
   * Resize the geometry to the specified width and height
   */
  resize(width: number, height: number): Geometry {
    return this.with({ width, height })
  }

  /**
   * Move the geometry to the specified x, y position
   */
  moveTo(x: number, y: number): Geometry {
    return this.with({ x, y })
  }

  /**
   * Get the center point of the geometry
   */
  getCenter(): Point {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    }
  }

  /**
   * Get the bounds as a Rectangle
   */
  getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    }
  }

  /**
   * Check if this geometry contains the given point
   */
  contains(point: Point): boolean {
    return (
      point.x >= this.x &&
      point.x <= this.x + this.width &&
      point.y >= this.y &&
      point.y <= this.y + this.height
    )
  }

  /**
   * Check if this geometry intersects with another geometry
   */
  intersects(other: Geometry): boolean {
    return !(
      this.x + this.width < other.x ||
      other.x + other.width < this.x ||
      this.y + this.height < other.y ||
      other.y + other.height < this.y
    )
  }

  /**
   * Get the intersection points with a line from p1 to p2
   */
  getLineIntersection(p1: Point, p2: Point): Point | null {
    // Simple implementation for rectangular geometry
    const edges = [
      { start: { x: this.x, y: this.y }, end: { x: this.x + this.width, y: this.y } },
      { start: { x: this.x + this.width, y: this.y }, end: { x: this.x + this.width, y: this.y + this.height } },
      { start: { x: this.x + this.width, y: this.y + this.height }, end: { x: this.x, y: this.y + this.height } },
      { start: { x: this.x, y: this.y + this.height }, end: { x: this.x, y: this.y } },
    ]

    let closestIntersection: Point | null = null
    let minDistance = Infinity

    for (const edge of edges) {
      const intersection = this.lineIntersection(p1, p2, edge.start, edge.end)
      if (intersection) {
        const distance = Math.sqrt(
          Math.pow(intersection.x - p1.x, 2) + Math.pow(intersection.y - p1.y, 2)
        )
        if (distance < minDistance && distance > 0.001) {
          minDistance = distance
          closestIntersection = intersection
        }
      }
    }

    return closestIntersection
  }

  /**
   * Calculate intersection point of two lines
   */
  private lineIntersection(
    p1: Point,
    p2: Point,
    p3: Point,
    p4: Point,
  ): Point | null {
    const x1 = p1.x
    const y1 = p1.y
    const x2 = p2.x
    const y2 = p2.y
    const x3 = p3.x
    const y3 = p3.y
    const x4 = p4.x
    const y4 = p4.y

    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    if (Math.abs(denom) < 0.0001) {
      return null // Lines are parallel
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: x1 + t * (x2 - x1),
        y: y1 + t * (y2 - y1),
      }
    }

    return null
  }

  /**
   * Clone the geometry
   */
  clone(): Geometry {
    return new Geometry({
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      points: this.points ? [...this.points] : undefined,
      offsets: this.offsets?.clone(),
      relative: this.relative,
      terminal: this.terminal ? { ...this.terminal } : undefined,
    })
  }

  /**
   * Convert to string representation
   */
  toString(): string {
    return `Geometry(x=${this.x}, y=${this.y}, w=${this.width}, h=${this.height})`
  }
}