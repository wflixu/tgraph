import { mxPoint } from './mxPoint.js';
/**
 * Class: mxRectangle
 *
 * Extends <mxPoint> to implement a 2-dimensional rectangle with double
 * precision coordinates.
 *
 * Constructor: mxRectangle
 *
 * Constructs a new rectangle for the optional parameters. If no parameters
 * are given then the respective default values are used.
 */
export class mxRectangle extends mxPoint {


  /**
   * Variable: width
   *
   * Holds the width of the rectangle. Default is 0.
   */
  width = null;

  /**
   * Variable: height
   *
   * Holds the height of the rectangle. Default is 0.
   */
  height = null;

  constructor(x, y, width = 0, height = 0) {
    super(x, y);
    this.width = width;
    this.height = height;
  }


  /**
   * Function: setRect
   *
   * Sets this rectangle to the specified values
   */
  setRect(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  };

  /**
   * Function: getCenterX
   *
   * Returns the x-coordinate of the center point.
   */
  getCenterX() {
    return this.x + this.width / 2;
  };

  /**
   * Function: getCenterY
   *
   * Returns the y-coordinate of the center point.
   */
  getCenterY() {
    return this.y + this.height / 2;
  };

  /**
   * Function: add
   *
   * Adds the given rectangle to this rectangle.
   */
  add(rect) {
    if (rect != null) {
      var minX = Math.min(this.x, rect.x);
      var minY = Math.min(this.y, rect.y);
      var maxX = Math.max(this.x + this.width, rect.x + rect.width);
      var maxY = Math.max(this.y + this.height, rect.y + rect.height);

      this.x = minX;
      this.y = minY;
      this.width = maxX - minX;
      this.height = maxY - minY;
    }
  };

  /**
   * Function: intersect
   *
   * Changes this rectangle to where it overlaps with the given rectangle.
   */
  intersect(rect) {
    if (rect != null) {
      var r1 = this.x + this.width;
      var r2 = rect.x + rect.width;

      var b1 = this.y + this.height;
      var b2 = rect.y + rect.height;

      this.x = Math.max(this.x, rect.x);
      this.y = Math.max(this.y, rect.y);
      this.width = Math.min(r1, r2) - this.x;
      this.height = Math.min(b1, b2) - this.y;
    }
  };

  /**
   * Function: grow
   *
   * Grows the rectangle by the given amount, that is, this method subtracts
   * the given amount from the x- and y-coordinates and adds twice the amount
   * to the width and height.
   */
  grow(amount) {
    this.x -= amount;
    this.y -= amount;
    this.width += 2 * amount;
    this.height += 2 * amount;

    return this;
  };

  /**
   * Function: getPoint
   *
   * Returns the top, left corner as a new <mxPoint>.
   */
  getPoint() {
    return new mxPoint(this.x, this.y);
  };

  /**
   * Function: rotate90
   *
   * Rotates this rectangle by 90 degree around its center point.
   */
  rotate90() {
    var t = (this.width - this.height) / 2;
    this.x += t;
    this.y -= t;
    var tmp = this.width;
    this.width = this.height;
    this.height = tmp;
  };

  /**
   * Function: equals
   *
   * Returns true if the given object equals this rectangle.
   */
  equals(obj) {
    return (
      obj != null &&
      obj.x == this.x &&
      obj.y == this.y &&
      obj.width == this.width &&
      obj.height == this.height
    );
  };

  /**
   * Function: fromRectangle
   *
   * Returns a new <mxRectangle> which is a copy of the given rectangle.
   */
  static fromRectangle(rect) {
    return new mxRectangle(rect.x, rect.y, rect.width, rect.height);
  };
}


console.log('graph/util/mxRectangle.js');
