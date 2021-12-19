/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */

import { mxPoint } from "./mxPoint";

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
  width: number;
  height: number;
  constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super(x, y);
    this.width = width ?? 0;
    this.height = height ?? 0;
  }

  setRect(x:number, y:number, w:number, h:number) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }
  getCenterX() {
    return this.x + this.width / 2;
  }
  getCenterY() {
    return this.y + this.height / 2;
  }
  add(rect: mxRectangle) {
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
  }

  intersect(rect: mxRectangle) {
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
  }

  grow(amount: number) {
    this.x -= amount;
    this.y -= amount;
    this.width += 2 * amount;
    this.height += 2 * amount;

    return this;
  }


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
  equals(obj: mxRectangle) {
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
  static fromRectangle(rect: mxRectangle) {
    return new mxRectangle(rect.x, rect.y, rect.width, rect.height);
  };
}






