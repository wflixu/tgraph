/**
 * Class: mxActor
 *
 * Extends <mxShape> to implement an actor shape. If a custom shape with one
 * filled area is needed, then this shape's <redrawPath> should be overridden.
 *
 * Example:
 *
 * (code)
 * function SampleShape() { }
 *
 * SampleShape.prototype = new mxActor();
 *
 * mxCellRenderer.registerShape('sample', SampleShape);
 * SampleShape.redrawPath = function(path, x, y, w, h)
 * {
 *   path.moveTo(0, 0);
 *   path.lineTo(w, h);
 *   // ...
 *   path.close();
 * }
 * (end)
 *
 * This shape is registered under <mxConstants.SHAPE_ACTOR> in
 * <mxCellRenderer>.
 *
 * Constructor: mxActor
 *
 * Constructs a new actor shape.
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
import { mxShape } from './mxShape.js';


export class mxActor extends mxShape {
  constructor(bounds, fill, stroke, strokewidth = 1) {
    super();
    this.stencil = this;
    this.bounds = bounds;
    this.fill = fill;
    this.stroke = stroke;
    this.strokewidth = strokewidth;
  }

  /**
   * Function: paintVertexShape
   *
   * Redirects to redrawPath for subclasses to work.
   */
  paintVertexShape(c, x, y, w, h) {
    c.translate(x, y);
    c.begin();
    this.redrawPath(c, x, y, w, h);
    c.fillAndStroke();
  }

  /**
   * Function: redrawPath
   *
   * Draws the path for this shape.
   */
  redrawPath(c, x, y, w, h) {
    var width = w / 3;
    c.moveTo(0, h);
    c.curveTo(0, (3 * h) / 5, 0, (2 * h) / 5, w / 2, (2 * h) / 5);
    c.curveTo(w / 2 - width, (2 * h) / 5, w / 2 - width, 0, w / 2, 0);
    c.curveTo(w / 2 + width, 0, w / 2 + width, (2 * h) / 5, w / 2, (2 * h) / 5);
    c.curveTo(w, (2 * h) / 5, w, (3 * h) / 5, w, h);
    c.close();
  }
}

console.log('graph/shape/mxActor.js');
