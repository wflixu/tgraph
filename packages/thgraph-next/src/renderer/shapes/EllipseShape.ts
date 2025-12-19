import { SvgFactory } from '../SvgFactory'
import type { Shape } from './Shape'
import type { Cell, Geometry, Style, Point, Rectangle } from '../../types'

export class EllipseShape implements Shape {
  readonly type = 'ellipse'

  render(
    cell: Cell,
    geometry: Geometry,
    style: Style,
    container: SVGElement
  ): SVGElement {
    const cx = geometry.width / 2
    const cy = geometry.height / 2

    const ellipse = SvgFactory.createEllipse(
      cx,
      cy,
      Math.abs(geometry.width / 2),
      Math.abs(geometry.height / 2),
      {
        fill: style.fillColor || 'white',
        stroke: style.strokeColor || 'black',
        'stroke-width': style.strokeWidth || 1,
        'fill-opacity': style.fillOpacity ?? 1,
        'stroke-opacity': style.strokeOpacity ?? 1,
      },
      container
    )

    return ellipse
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
    const cx = geometry.x + geometry.width / 2
    const cy = geometry.y + geometry.height / 2
    const rx = Math.abs(geometry.width / 2)
    const ry = Math.abs(geometry.height / 2)

    const dx = (x - cx) / rx
    const dy = (y - cy) / ry

    return dx * dx + dy * dy <= 1
  }

  getConnectionPoints(geometry: Geometry): Point[] {
    const cx = geometry.x + geometry.width / 2
    const cy = geometry.y + geometry.height / 2

    return [
      { x: geometry.x, y: cy }, // Left
      { x: cx, y: geometry.y }, // Top
      { x: geometry.x + geometry.width, y: cy }, // Right
      { x: cx, y: geometry.y + geometry.height }, // Bottom
    ]
  }

  updateShape(element: SVGElement, geometry: Geometry, style: Style): void {
    if (element instanceof SVGEllipseElement) {
      const cx = geometry.width / 2
      const cy = geometry.height / 2

      element.setAttribute('cx', String(cx))
      element.setAttribute('cy', String(cy))
      element.setAttribute('rx', String(Math.abs(geometry.width / 2)))
      element.setAttribute('ry', String(Math.abs(geometry.height / 2)))

      if (style.fillColor) element.setAttribute('fill', style.fillColor)
      if (style.strokeColor) element.setAttribute('stroke', style.strokeColor)
      if (style.strokeWidth !== undefined) element.setAttribute('stroke-width', String(style.strokeWidth))
      if (style.fillOpacity !== undefined) element.setAttribute('fill-opacity', String(style.fillOpacity))
      if (style.strokeOpacity !== undefined) element.setAttribute('stroke-opacity', String(style.strokeOpacity))
    }
  }
}