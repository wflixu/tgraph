import { expect, test, describe, beforeEach } from 'vitest'
import { EdgeRouter, EdgeStyle } from '../src/edge/EdgeRouter'
import type { Geometry, Rectangle, Point } from '../src/types'

describe('EdgeRouter', () => {
  let edgeRouter: EdgeRouter
  let sourceGeometry: Geometry
  let targetGeometry: Geometry

  beforeEach(() => {
    edgeRouter = new EdgeRouter()

    sourceGeometry = {
      x: 0,
      y: 0,
      width: 100,
      height: 50
    }

    targetGeometry = {
      x: 200,
      y: 100,
      width: 100,
      height: 50
    }
  })

  test('should initialize with default configuration', () => {
    const config = edgeRouter.config

    expect(config.style).toBe(EdgeStyle.STRAIGHT)
    expect(config.spacing).toBe(20)
    expect(config.curveTension).toBe(0.5)
    expect(config.cornerRadius).toBe(8)
    expect(config.maxSegmentLength).toBe(1000)
    expect(config.simplify).toBe(true)
    expect(config.avoidObstacles).toBe(false)
    expect(config.obstacleMargin).toBe(10)
  })

  test('should update configuration', () => {
    edgeRouter.updateConfig({
      style: EdgeStyle.ORTHOGONAL,
      spacing: 30,
      curveTension: 0.7
    })

    const config = edgeRouter.config
    expect(config.style).toBe(EdgeStyle.ORTHOGONAL)
    expect(config.spacing).toBe(30)
    expect(config.curveTension).toBe(0.7)
  })

  test('should route straight edges', () => {
    edgeRouter.updateConfig({ style: EdgeStyle.STRAIGHT })

    const result = edgeRouter.routeEdge(sourceGeometry, targetGeometry)

    expect(result.metadata.style).toBe(EdgeStyle.STRAIGHT)
    expect(result.metadata.segments).toBe(1)
    expect(result.path).toHaveLength(2)
    expect(result.metadata.processed).toBe(true)
  })

  test('should route orthogonal edges', () => {
    edgeRouter.updateConfig({ style: EdgeStyle.ORTHOGONAL })

    const result = edgeRouter.routeEdge(sourceGeometry, targetGeometry)

    expect(result.metadata.style).toBe(EdgeStyle.ORTHOGONAL)
    expect(result.metadata.segments).toBeGreaterThan(1)
    expect(result.path.length).toBeGreaterThanOrEqual(3)
    expect(result.metadata.processed).toBe(true)
  })

  test('should route curved edges', () => {
    edgeRouter.updateConfig({ style: EdgeStyle.CURVED })

    const result = edgeRouter.routeEdge(sourceGeometry, targetGeometry)

    expect(result.metadata.style).toBe(EdgeStyle.CURVED)
    expect(result.metadata.segments).toBeGreaterThan(10) // Curved routing generates many points
    expect(result.path.length).toBeGreaterThan(result.waypoints.length)
    expect(result.metadata.processed).toBe(true)
  })

  test('should route Manhattan style edges', () => {
    edgeRouter.updateConfig({ style: EdgeStyle.MANHATTAN })

    const obstacles: Rectangle[] = [
      { x: 80, y: 40, width: 40, height: 40 }
    ]

    const result = edgeRouter.routeEdge(sourceGeometry, targetGeometry, [], obstacles)

    expect(result.metadata.style).toBe(EdgeStyle.MANHATTAN)
    expect(result.metadata.processed).toBe(true)
  })

  test('should route avoiding obstacles', () => {
    edgeRouter.updateConfig({ style: EdgeStyle.AVOID_OBSTACLES, avoidObstacles: true })

    const obstacles: Rectangle[] = [
      { x: 100, y: 50, width: 50, height: 50 }
    ]

    const result = edgeRouter.routeEdge(sourceGeometry, targetGeometry, [], obstacles)

    expect(result.metadata.style).toBe(EdgeStyle.AVOID_OBSTACLES)
    expect(result.metadata.processed).toBe(true)
  })

  test('should handle waypoints', () => {
    const waypoints: Point[] = [
      { x: 50, y: 25 },
      { x: 150, y: 75 }
    ]

    const result = edgeRouter.routeEdge(sourceGeometry, targetGeometry, waypoints)

    expect(result.waypoints).toHaveLength(4) // source + 2 waypoints + target
    expect(result.path.length).toBeGreaterThanOrEqual(waypoints.length)
  })

  test('should calculate path length correctly', () => {
    const result = edgeRouter.routeEdge(sourceGeometry, targetGeometry)

    expect(result.metadata.length).toBeGreaterThan(0)

    // Simple straight line distance check
    const expectedMinDistance = Math.sqrt(
      Math.pow(250 - 50, 2) + Math.pow(125 - 25, 2)
    )
    expect(result.metadata.length).toBeGreaterThanOrEqual(expectedMinDistance)
  })

  test('should handle empty geometries', () => {
    const result = edgeRouter.routeEdge(null, targetGeometry)

    expect(result.metadata.processed).toBe(false)
    expect(result.metadata.length).toBe(0)
    expect(result.metadata.segments).toBe(0)
  })

  test('should simplify paths when enabled', () => {
    edgeRouter.updateConfig({ simplify: true })

    // Create a path with collinear points
    const waypoints: Point[] = [
      { x: 50, y: 25 },
      { x: 75, y: 37.5 }, // Collinear point
      { x: 100, y: 50 }
    ]

    const result = edgeRouter.routeEdge(sourceGeometry, targetGeometry, waypoints)

    expect(result.metadata.processed).toBe(true)
  })

  test('should not simplify paths when disabled', () => {
    edgeRouter.updateConfig({ simplify: false })

    const waypoints: Point[] = [
      { x: 50, y: 25 },
      { x: 75, y: 37.5 },
      { x: 100, y: 50 }
    ]

    const result = edgeRouter.routeEdge(sourceGeometry, targetGeometry, waypoints)

    expect(result.path.length).toBeGreaterThanOrEqual(waypoints.length + 2)
  })

  test('should handle corner radius in orthogonal routing', () => {
    edgeRouter.updateConfig({
      style: EdgeStyle.ORTHOGONAL,
      cornerRadius: 10
    })

    const result = edgeRouter.routeEdge(sourceGeometry, targetGeometry)

    expect(result.metadata.style).toBe(EdgeStyle.ORTHOGONAL)
    expect(result.metadata.segments).toBeGreaterThanOrEqual(2)
  })

  test('should handle curve tension in curved routing', () => {
    edgeRouter.updateConfig({
      style: EdgeStyle.CURVED,
      curveTension: 0.8
    })

    const result = edgeRouter.routeEdge(sourceGeometry, targetGeometry)

    expect(result.metadata.style).toBe(EdgeStyle.CURVED)
    expect(result.path.length).toBeGreaterThan(10)
  })

  test('should create connection points on geometry boundaries', () => {
    edgeRouter.updateConfig({ style: EdgeStyle.STRAIGHT })

    const waypoint = { x: 300, y: 125 } // East of target
    const result = edgeRouter.routeEdge(sourceGeometry, targetGeometry, [waypoint])

    expect(result.path.length).toBeGreaterThanOrEqual(2)
    expect(result.path).toContainEqual(waypoint)

    // Check that last point is on target geometry boundary
    const lastPoint = result.path[result.path.length - 1]
    const targetCenterX = targetGeometry.x + (targetGeometry.width || 0) / 2
    const targetCenterY = targetGeometry.y + (targetGeometry.height || 0) / 2

    expect(lastPoint.x).toBeGreaterThanOrEqual(targetGeometry.x)
    expect(lastPoint.x).toBeLessThanOrEqual(targetGeometry.x + (targetGeometry.width || 0))
    expect(lastPoint.y).toBeGreaterThanOrEqual(targetGeometry.y)
    expect(lastPoint.y).toBeLessThanOrEqual(targetGeometry.y + (targetGeometry.height || 0))
  })

  test('should handle different obstacle configurations', () => {
    edgeRouter.updateConfig({
      style: EdgeStyle.AVOID_OBSTACLES,
      obstacleMargin: 20
    })

    const obstacles: Rectangle[] = [
      { x: 90, y: 30, width: 60, height: 60 },
      { x: 180, y: 80, width: 40, height: 40 }
    ]

    const result = edgeRouter.routeEdge(sourceGeometry, targetGeometry, [], obstacles)

    expect(result.metadata.style).toBe(EdgeStyle.AVOID_OBSTACLES)
    expect(result.metadata.processed).toBe(true)
  })

  test('should handle maximum segment length constraint', () => {
    edgeRouter.updateConfig({
      style: EdgeStyle.STRAIGHT,
      maxSegmentLength: 50
    })

    // Create a long distance that would exceed max segment length
    const farTarget = {
      x: 500,
      y: 300,
      width: 100,
      height: 50
    }

    const result = edgeRouter.routeEdge(sourceGeometry, farTarget)

    expect(result.metadata.processed).toBe(true)
  })
})