import { SvgFactory } from '../SvgFactory'
import type { Shape } from './Shape'
import type { Cell, Geometry, Style, Point, Rectangle } from '../../types'

export class RectangleShape implements Shape {
  readonly type = 'rectangle'

  render(
    cell: Cell,
    geometry: Geometry,
    style: Style,
    container: SVGElement
  ): SVGElement {
    const rect = SvgFactory.createRectangle(
      0,
      0,
      geometry.width,
      geometry.height,
      {
        fill: style.fillColor || 'white',
        stroke: style.strokeColor || 'black',
        'stroke-width': style.strokeWidth || 1,
        'fill-opacity': style.fillOpacity ?? 1,
        'stroke-opacity': style.strokeOpacity ?? 1,
        rx: style.cornerRadius || 0,
        ry: style.cornerRadius || 0,
      },
      container
    )

    return rect
  }

  getBounds(geometry: Geometry): Rectangle {
    return {
      x: geometry.x,
      y: geometry.y,
      width: geometry.width,
      height: geometry.height
    }
  }

  containsPoint(geometry: Geometry, x: number, y: number): boolean {
    return (
      x >= geometry.x &&
      x <= geometry.x + geometry.width &&
      y >= geometry.y &&
      y <= geometry.y + geometry.height
    )
  }

  getConnectionPoints(geometry: Geometry): Point[] {
    const cx = geometry.x + geometry.width / 2
    const cy = geometry.y + geometry.height / 2

    return [
      { x: geometry.x, y: cy }, // Left
      { x: cx, y: geometry.y }, // Top
      { x: geometry.x + geometry.width, y: cy }, // Right
      { x: cx, y: geometry.y + geometry.height }, // Bottom
      { x: geometry.x, y: geometry.y }, // Top-left
      { x: geometry.x + geometry.width, y: geometry.y }, // Top-right
      { x: geometry.x, y: geometry.y + geometry.height }, // Bottom-left
      { x: geometry.x + geometry.width, y: geometry.y + geometry.height }, // Bottom-right
    ]
  }

  updateShape(element: SVGElement, geometry: Geometry, style: Style): void {
    if (element instanceof SVGRectElement) {
      element.setAttribute('width', String(Math.max(0, geometry.width)))
      element.setAttribute('height', String(Math.max(0, geometry.height)))

      if (style.fillColor) element.setAttribute('fill', style.fillColor)
      if (style.strokeColor) element.setAttribute('stroke', style.strokeColor)
      if (style.strokeWidth !== undefined) element.setAttribute('stroke-width', String(style.strokeWidth))
      if (style.fillOpacity !== undefined) element.setAttribute('fill-opacity', String(style.fillOpacity))
      if (style.strokeOpacity !== undefined) element.setAttribute('stroke-opacity', String(style.strokeOpacity))
      if (style.cornerRadius !== undefined) {
        element.setAttribute('rx', String(style.cornerRadius))
        element.setAttribute('ry', String(style.cornerRadius))
      }
    }
  }
}