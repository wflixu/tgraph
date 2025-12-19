/**
 * SVG Factory utilities for modern DOM manipulation
 * Provides a convenient interface for creating and managing SVG elements
 */

export class SvgFactory {
  private static svgNamespace = 'http://www.w3.org/2000/svg'
  private static xlinkNamespace = 'http://www.w3.org/1999/xlink'

  /**
   * Create an SVG element with specified attributes
   */
  static createSvgElement<T extends SVGElement>(
    tagName: string,
    attributes: Record<string, string | number | boolean | null> = {},
    parent?: SVGElement
  ): T {
    const element = document.createElementNS(this.svgNamespace, tagName) as T

    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key.startsWith('xlink:')) {
          element.setAttributeNS(this.xlinkNamespace, key, String(value))
        } else {
          element.setAttribute(key, String(value))
        }
      }
    })

    // Append to parent if provided
    if (parent) {
      parent.appendChild(element)
    }

    return element
  }

  /**
   * Create SVG root element
   */
  static createSvgRoot(
    width: number = 100,
    height: number = 100,
    attributes: Record<string, string | number | boolean | null> = {}
  ): SVGSVGElement {
    return this.createSvgElement('svg', {
      width: width,
      height: height,
      viewBox: `0 0 ${width} ${height}`,
      ...attributes
    })
  }

  /**
   * Create SVG group element
   */
  static createGroup(
    attributes: Record<string, string | number | boolean | null> = {},
    parent?: SVGElement
  ): SVGGElement {
    return this.createSvgElement('g', attributes, parent)
  }

  /**
   * Create rectangle element
   */
  static createRectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    attributes: Record<string, string | number | boolean | null> = {},
    parent?: SVGElement
  ): SVGRectElement {
    return this.createSvgElement('rect', {
      x: x,
      y: y,
      width: Math.max(0, width),
      height: Math.max(0, height),
      ...attributes
    }, parent)
  }

  /**
   * Create ellipse element
   */
  static createEllipse(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    attributes: Record<string, string | number | boolean | null> = {},
    parent?: SVGElement
  ): SVGEllipseElement {
    return this.createSvgElement('ellipse', {
      cx: cx,
      cy: cy,
      rx: Math.max(0, rx),
      ry: Math.max(0, ry),
      ...attributes
    }, parent)
  }

  /**
   * Create circle element
   */
  static createCircle(
    cx: number,
    cy: number,
    r: number,
    attributes: Record<string, string | number | boolean | null> = {},
    parent?: SVGElement
  ): SVGCircleElement {
    return this.createSvgElement('circle', {
      cx: cx,
      cy: cy,
      r: Math.max(0, r),
      ...attributes
    }, parent)
  }

  /**
   * Create line element
   */
  static createLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    attributes: Record<string, string | number | boolean | null> = {},
    parent?: SVGElement
  ): SVGLineElement {
    return this.createSvgElement('line', {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      ...attributes
    }, parent)
  }

  /**
   * Create polyline element
   */
  static createPolyline(
    points: Array<{ x: number; y: number }>,
    attributes: Record<string, string | number | boolean | null> = {},
    parent?: SVGElement
  ): SVGPolylineElement {
    const pointsString = points.map(p => `${p.x},${p.y}`).join(' ')
    return this.createSvgElement('polyline', {
      points: pointsString,
      ...attributes
    }, parent)
  }

  /**
   * Create polygon element
   */
  static createPolygon(
    points: Array<{ x: number; y: number }>,
    attributes: Record<string, string | number | boolean | null> = {},
    parent?: SVGElement
  ): SVGPolygonElement {
    const pointsString = points.map(p => `${p.x},${p.y}`).join(' ')
    return this.createSvgElement('polygon', {
      points: pointsString,
      ...attributes
    }, parent)
  }

  /**
   * Create path element
   */
  static createPath(
    d: string,
    attributes: Record<string, string | number | boolean | null> = {},
    parent?: SVGElement
  ): SVGPathElement {
    return this.createSvgElement('path', {
      d: d,
      ...attributes
    }, parent)
  }

  /**
   * Create text element
   */
  static createText(
    x: number,
    y: number,
    text: string,
    attributes: Record<string, string | number | boolean | null> = {},
    parent?: SVGElement
  ): SVGTextElement {
    const textElement = this.createSvgElement('text', {
      x: x,
      y: y,
      ...attributes
    }, parent)

    textElement.textContent = text
    return textElement
  }

  /**
   * Create image element
   */
  static createImage(
    x: number,
    y: number,
    width: number,
    height: number,
    href: string,
    attributes: Record<string, string | number | boolean | null> = {},
    parent?: SVGElement
  ): SVGImageElement {
    return this.createSvgElement('image', {
      x: x,
      y: y,
      width: Math.max(0, width),
      height: Math.max(0, height),
      'xlink:href': href,
      ...attributes
    }, parent)
  }

  /**
   * Create clip path element
   */
  static createClipPath(
    id: string,
    attributes: Record<string, string | number | boolean | null> = {},
    parent?: SVGElement
  ): SVGClipPathElement {
    return this.createSvgElement('clipPath', {
      id: id,
      ...attributes
    }, parent)
  }

  /**
   * Create linear gradient
   */
  static createLinearGradient(
    id: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    attributes: Record<string, string | number | boolean | null> = {},
    parent?: SVGElement
  ): SVGLinearGradientElement {
    return this.createSvgElement('linearGradient', {
      id: id,
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      ...attributes
    }, parent)
  }

  /**
   * Create gradient stop
   */
  static createGradientStop(
    offset: number | string,
    stopColor: string,
    stopOpacity: number = 1,
    attributes: Record<string, string | number | boolean | null> = {},
    parent?: SVGElement
  ): SVGStopElement {
    return this.createSvgElement('stop', {
      offset: offset,
      'stop-color': stopColor,
      'stop-opacity': stopOpacity,
      ...attributes
    }, parent)
  }

  /**
   * Set style properties on an element
   */
  static setStyles(element: SVGElement, styles: Record<string, string | number>): void {
    Object.entries(styles).forEach(([property, value]) => {
      element.style.setProperty(property, String(value))
    })
  }

  /**
   * Add event listener to an element
   */
  static addEventListener<T extends keyof SVGElementEventMap>(
    element: SVGElement,
    type: T,
    listener: (event: SVGElementEventMap[T]) => void,
    options?: boolean | AddEventListenerOptions
  ): void {
    element.addEventListener(type, listener, options)
  }

  /**
   * Remove element from DOM
   */
  static removeElement(element: SVGElement): void {
    if (element.parentNode) {
      element.parentNode.removeChild(element)
    }
  }

  /**
   * Clear all children of an element
   */
  static clearChildren(element: SVGElement): void {
    while (element.firstChild) {
      element.removeChild(element.firstChild)
    }
  }
}