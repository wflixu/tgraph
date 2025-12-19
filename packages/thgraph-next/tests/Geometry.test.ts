import { describe, it, expect } from 'vitest'
import { Geometry } from '../src/model/Geometry'

describe('Geometry', () => {
  describe('creation', () => {
    it('should create geometry with default values', () => {
      const geom = new Geometry()

      expect(geom.x).toBe(0)
      expect(geom.y).toBe(0)
      expect(geom.width).toBe(0)
      expect(geom.height).toBe(0)
      expect(geom.points).toBeUndefined()
      expect(geom.relative).toBe(false)
    })

    it('should create geometry from rectangle', () => {
      const geom = Geometry.fromRectangle(10, 20, 100, 50)

      expect(geom.x).toBe(10)
      expect(geom.y).toBe(20)
      expect(geom.width).toBe(100)
      expect(geom.height).toBe(50)
    })

    it('should create geometry from point', () => {
      const point = { x: 15, y: 25 }
      const geom = Geometry.fromPoint(point)

      expect(geom.x).toBe(15)
      expect(geom.y).toBe(25)
      expect(geom.width).toBe(0)
      expect(geom.height).toBe(0)
    })

    it('should create geometry from points', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 10, y: 10 },
        { x: 20, y: 0 },
      ]
      const geom = Geometry.fromPoints(points)

      expect(geom.x).toBe(0)
      expect(geom.y).toBe(0)
      expect(geom.points).toEqual(points)
    })

    it('should throw error when creating from empty points', () => {
      expect(() => Geometry.fromPoints([])).toThrow('Points array cannot be empty')
    })
  })

  describe('with method', () => {
    it('should create new geometry with updated properties', () => {
      const geom = Geometry.fromRectangle(10, 20, 100, 50)
      const newGeom = geom.with({ width: 150, height: 75 })

      expect(newGeom.x).toBe(10) // unchanged
      expect(newGeom.y).toBe(20) // unchanged
      expect(newGeom.width).toBe(150)
      expect(newGeom.height).toBe(75)
    })
  })

  describe('transformations', () => {
    it('should translate geometry', () => {
      const geom = Geometry.fromRectangle(10, 20, 100, 50)
      const translated = geom.translate(5, -10)

      expect(translated.x).toBe(15)
      expect(translated.y).toBe(10)
      expect(translated.width).toBe(100)
      expect(translated.height).toBe(50)
    })

    it('should translate points when translating', () => {
      const points = [{ x: 0, y: 0 }, { x: 10, y: 10 }]
      const geom = new Geometry({ x: 5, y: 5, points })
      const translated = geom.translate(3, 4)

      expect(translated.points).toEqual([{ x: 3, y: 4 }, { x: 13, y: 14 }])
    })

    it('should scale geometry around center', () => {
      const geom = Geometry.fromRectangle(0, 0, 100, 100)
      const scaled = geom.scale(2, 2)

      expect(scaled.x).toBe(-50)
      expect(scaled.y).toBe(-50)
      expect(scaled.width).toBe(200)
      expect(scaled.height).toBe(200)
    })

    it('should scale geometry around custom center', () => {
      const geom = Geometry.fromRectangle(10, 10, 100, 100)
      const center = { x: 10, y: 10 }
      const scaled = geom.scale(2, 2, center)

      expect(scaled.x).toBe(10)
      expect(scaled.y).toBe(10)
      expect(scaled.width).toBe(200)
      expect(scaled.height).toBe(200)
    })

    it('should resize geometry', () => {
      const geom = Geometry.fromRectangle(10, 20, 100, 50)
      const resized = geom.resize(150, 75)

      expect(resized.x).toBe(10)
      expect(resized.y).toBe(20)
      expect(resized.width).toBe(150)
      expect(resized.height).toBe(75)
    })

    it('should move geometry to position', () => {
      const geom = Geometry.fromRectangle(10, 20, 100, 50)
      const moved = geom.moveTo(30, 40)

      expect(moved.x).toBe(30)
      expect(moved.y).toBe(40)
      expect(moved.width).toBe(100)
      expect(moved.height).toBe(50)
    })
  })

  describe('utility methods', () => {
    it('should get center point', () => {
      const geom = Geometry.fromRectangle(0, 0, 100, 50)
      const center = geom.getCenter()

      expect(center.x).toBe(50)
      expect(center.y).toBe(25)
    })

    it('should get bounds', () => {
      const geom = Geometry.fromRectangle(10, 20, 100, 50)
      const bounds = geom.getBounds()

      expect(bounds).toEqual({
        x: 10,
        y: 20,
        width: 100,
        height: 50,
      })
    })

    it('should check if point is contained', () => {
      const geom = Geometry.fromRectangle(10, 20, 100, 50)

      expect(geom.contains({ x: 15, y: 25 })).toBe(true)
      expect(geom.contains({ x: 10, y: 20 })).toBe(true)
      expect(geom.contains({ x: 110, y: 70 })).toBe(true)
      expect(geom.contains({ x: 5, y: 25 })).toBe(false)
      expect(geom.contains({ x: 15, y: 75 })).toBe(false)
    })

    it('should check intersection with another geometry', () => {
      const geom1 = Geometry.fromRectangle(0, 0, 100, 100)
      const geom2 = Geometry.fromRectangle(50, 50, 100, 100)
      const geom3 = Geometry.fromRectangle(200, 200, 100, 100)

      expect(geom1.intersects(geom2)).toBe(true)
      expect(geom1.intersects(geom3)).toBe(false)
    })
  })

  describe('line intersection', () => {
    it('should calculate line intersection', () => {
      const geom = Geometry.fromRectangle(0, 0, 100, 100)
      const p1 = { x: -50, y: 50 }
      const p2 = { x: 150, y: 50 }

      const intersection = geom.getLineIntersection(p1, p2)

      expect(intersection).not.toBeNull()
      expect(intersection?.x).toBe(0)
      expect(intersection?.y).toBe(50)
    })

    it('should return null for line not intersecting', () => {
      const geom = Geometry.fromRectangle(0, 0, 100, 100)
      const p1 = { x: -50, y: -50 }
      const p2 = { x: -25, y: -25 }

      const intersection = geom.getLineIntersection(p1, p2)

      expect(intersection).toBeNull()
    })
  })

  describe('clone', () => {
    it('should create a clone of the geometry', () => {
      const points = [{ x: 0, y: 0 }, { x: 10, y: 10 }]
      const terminal = { x: 5, y: 5 }
      const offsets = Geometry.fromRectangle(1, 1, 10, 10)
      const geom = new Geometry({
        x: 10,
        y: 20,
        width: 100,
        height: 50,
        points,
        terminal,
        offsets,
        relative: true,
      })

      const cloned = geom.clone()

      expect(cloned).not.toBe(geom)
      expect(cloned.x).toBe(geom.x)
      expect(cloned.y).toBe(geom.y)
      expect(cloned.width).toBe(geom.width)
      expect(cloned.height).toBe(geom.height)
      expect(cloned.points).toEqual(geom.points)
      expect(cloned.points).not.toBe(geom.points)
      expect(cloned.terminal).toEqual(geom.terminal)
      expect(cloned.terminal).not.toBe(geom.terminal)
      expect(cloned.offsets).toEqual(geom.offsets)
      expect(cloned.offsets).not.toBe(geom.offsets)
    })
  })

  describe('toString', () => {
    it('should return string representation', () => {
      const geom = Geometry.fromRectangle(10, 20, 100, 50)
      expect(geom.toString()).toBe('Geometry(x=10, y=20, w=100, h=50)')
    })
  })
})