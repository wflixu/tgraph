import { SvgFactory } from '../SvgFactory'
import type { Shape } from './Shape'
import type { Cell, Geometry, Style, Point, Rectangle } from '../../types'

export class TextShape implements Shape {
  readonly type = 'text'

  render(
    cell: Cell,
    geometry: Geometry,
    style: Style,
    container: SVGElement
  ): SVGElement {
    const text = SvgFactory.createText(
      0,
      0,
      cell.value?.toString() || '',
      {
        'font-family': style.fontFamily || 'Arial, sans-serif',
        'font-size': style.fontSize || 14,
        'font-weight': style.fontWeight || 'normal',
        'font-style': style.fontStyle || 'normal',
        'text-decoration': style.textDecoration || 'none',
        'text-align': style.align || 'left',
        'vertical-align': style.verticalAlign || 'top',
        fill: style.fontColor || 'black',
        'text-anchor': this.getTextAnchor(style.align),
        'dominant-baseline': this.getDominantBaseline(style.verticalAlign),
      },
      container
    )

    return text
  }

  getBounds(geometry: Geometry): Rectangle {
    // Estimate text bounds based on geometry
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
    if (element instanceof SVGTextElement) {
      if (style.fontFamily) element.setAttribute('font-family', style.fontFamily)
      if (style.fontSize !== undefined) element.setAttribute('font-size', String(style.fontSize))
      if (style.fontWeight) element.setAttribute('font-weight', style.fontWeight)
      if (style.fontStyle) element.setAttribute('font-style', style.fontStyle)
      if (style.textDecoration) element.setAttribute('text-decoration', style.textDecoration)
      if (style.fontColor) element.setAttribute('fill', style.fontColor)
      if (style.align) element.setAttribute('text-anchor', this.getTextAnchor(style.align))
      if (style.verticalAlign) element.setAttribute('dominant-baseline', this.getDominantBaseline(style.verticalAlign))
    }
  }

  private getTextAnchor(align?: string): string {
    switch (align) {
      case 'center': return 'middle'
      case 'right': return 'end'
      default: return 'start'
    }
  }

  private getDominantBaseline(verticalAlign?: string): string {
    switch (verticalAlign) {
      case 'middle': return 'middle'
      case 'bottom': return 'text-after-edge'
      default: return 'hanging'
    }
  }
}