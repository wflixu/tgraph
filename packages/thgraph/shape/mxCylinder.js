
/**
 * Class: mxCylinder
 *
 * Extends <mxShape> to implement an cylinder shape. If a
 * custom shape with one filled area and an overlay path is
 * needed, then this shape's <redrawPath> should be overridden.
 * This shape is registered under <mxConstants.SHAPE_CYLINDER>
 * in <mxCellRenderer>.
 *
 * Constructor: mxCylinder
 *
 * Constructs a new cylinder shape.
 *
 * Parameters:
 *
 * bounds - <mxRectangle> that defines the bounds. This is stored in
 * <mxShape.bounds>.
 * fill - String that defines the fill color. This is stored in <fill>.
 * stroke - String that defines the stroke color. This is stored in <stroke>.
 * strokewidth - Optional integer that defines the stroke width. Default is
 * 1. This is stored in <strokewidth>.
 */


import { mxUtils } from '../util/mxUtils.js';
import { mxShape } from './mxShape.js';


export class mxCylinder extends mxShape {
  /**
   * Variable: maxHeight
   *
   * Defines the maximum height of the top and bottom part
   * of the cylinder shape.
   */
  maxHeight = 40;

  /**
   * Variable: svgStrokeTolerance
   *
   * Sets stroke tolerance to 0 for SVG.
   */
  svgStrokeTolerance = 0;

  constructor(bounds, fill, stroke, strokewidth ) {

    super();
    this.stencil = this;
    
    this.bounds = bounds;
    this.fill = fill;
    this.stroke = stroke;
    this.strokewidth = strokewidth ?? 1;
  }

  /**
   * Function: paintVertexShape
   *
   * Redirects to redrawPath for subclasses to work.
   */
  paintVertexShape  (c, x, y, w, h) {
    c.translate(x, y);
    c.begin();
    this.redrawPath(c, x, y, w, h, false);
    c.fillAndStroke();

    if (
      !this.outline ||
      this.style == null ||
      mxUtils.getValue(this.style, mxConstants.STYLE_BACKGROUND_OUTLINE, 0) == 0
    ) {
      c.setShadow(false);
      c.begin();
      this.redrawPath(c, x, y, w, h, true);
      c.stroke();
    }
  };

  /**
   * Function: getCylinderSize
   *
   * Returns the cylinder size.
   */
  getCylinderSize  (x, y, w, h) {
    return Math.min(this.maxHeight, Math.round(h / 5));
  };

  /**
   * Function: redrawPath
   *
   * Draws the path for this shape.
   */
  redrawPath  (c, x, y, w, h, isForeground) {
    var dy = this.getCylinderSize(x, y, w, h);

    if (
      (isForeground && this.fill != null) ||
      (!isForeground && this.fill == null)
    ) {
      c.moveTo(0, dy);
      c.curveTo(0, 2 * dy, w, 2 * dy, w, dy);

      // Needs separate shapes for correct hit-detection
      if (!isForeground) {
        c.stroke();
        c.begin();
      }
    }

    if (!isForeground) {
      c.moveTo(0, dy);
      c.curveTo(0, -dy / 3, w, -dy / 3, w, dy);
      c.lineTo(w, h - dy);
      c.curveTo(w, h + dy / 3, 0, h + dy / 3, 0, h - dy);
      c.close();
    }
  };

  /**
   * Variable: maxHeight
   *
   * Defines the maximum height of the top and bottom part
   * of the cylinder shape.
   */
  maxHeight = 40;

  /**
   * Variable: svgStrokeTolerance
   *
   * Sets stroke tolerance to 0 for SVG.
   */
  svgStrokeTolerance = 0;

  /**
   * Function: paintVertexShape
   *
   * Redirects to redrawPath for subclasses to work.
   */
  paintVertexShape  (c, x, y, w, h) {
    c.translate(x, y);
    c.begin();
    this.redrawPath(c, x, y, w, h, false);
    c.fillAndStroke();

    if (
      !this.outline ||
      this.style == null ||
      mxUtils.getValue(this.style, mxConstants.STYLE_BACKGROUND_OUTLINE, 0) == 0
    ) {
      c.setShadow(false);
      c.begin();
      this.redrawPath(c, x, y, w, h, true);
      c.stroke();
    }
  };

  /**
   * Function: getCylinderSize
   *
   * Returns the cylinder size.
   */
  getCylinderSize  (x, y, w, h) {
    return Math.min(this.maxHeight, Math.round(h / 5));
  };

  /**
   * Function: redrawPath
   *
   * Draws the path for this shape.
   */
  redrawPath  (c, x, y, w, h, isForeground) {
    var dy = this.getCylinderSize(x, y, w, h);

    if (
      (isForeground && this.fill != null) ||
      (!isForeground && this.fill == null)
    ) {
      c.moveTo(0, dy);
      c.curveTo(0, 2 * dy, w, 2 * dy, w, dy);

      // Needs separate shapes for correct hit-detection
      if (!isForeground) {
        c.stroke();
        c.begin();
      }
    }

    if (!isForeground) {
      c.moveTo(0, dy);
      c.curveTo(0, -dy / 3, w, -dy / 3, w, dy);
      c.lineTo(w, h - dy);
      c.curveTo(w, h + dy / 3, 0, h + dy / 3, 0, h - dy);
      c.close();
    }
  };
}

console.log('graph/shape/mxCylinder.js');
