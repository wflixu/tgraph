import { SvgFactory } from '../SvgFactory'
import type { Shape } from './Shape'
import type { Cell, Geometry, Style, Point, Rectangle } from '../../types'

export class ImageShape implements Shape {
  readonly type = 'image'

  render(
    cell: Cell,
    geometry: Geometry,
    style: Style,
    container: SVGElement
  ): SVGElement {
    const imageSrc = cell.value?.toString() || style.imageSrc || ''

    const image = SvgFactory.createImage(
      0,
      0,
      geometry.width,
      geometry.height,
      imageSrc,
      {
        preserveAspectRatio: style.imageAspectRatio || 'xMidYMid meet',
        opacity: style.opacity ?? 1,
      },
      container
    )

    return image
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
    ]
  }

  updateShape(element: SVGElement, geometry: Geometry, style: Style): void {
    if (element instanceof SVGImageElement) {
      element.setAttribute('width', String(Math.max(0, geometry.width)))
      element.setAttribute('height', String(Math.max(0, geometry.height)))

      if (style.imageSrc) element.setAttribute('xlink:href', style.imageSrc)
      if (style.imageAspectRatio) element.setAttribute('preserveAspectRatio', style.imageAspectRatio)
      if (style.opacity !== undefined) element.setAttribute('opacity', String(style.opacity))
    }
  }
}