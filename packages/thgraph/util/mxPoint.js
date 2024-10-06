/**
 * Class: mxPoint
 *
 * Implements a 2-dimensional vector with double precision coordinates.
 *
 * Constructor: mxPoint
 *
 * Constructs a new point for the optional x and y coordinates. If no
 * coordinates are given, then the default values for <x> and <y> are used.
 */

import { clone as thClone } from './tools.js';


export class mxPoint {
  /**
   * Variable: x
   *
   * Holds the x-coordinate of the point. Default is 0.
   */
  x;
  /**
   * Variable: y
   *
   * Holds the y-coordinate of the point. Default is 0.
   */
  y;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Function: equals
   *
   * Returns true if the given object equals this point.
   */
  equals(obj) {
    return obj != null && obj.x == this.x && obj.y == this.y;
  }

  /**
   * Function: clone
   *
   * Returns a clone of this <mxPoint>.
   */
  clone() {
    // Handles subclasses as well
    return thClone(this);
  }
}

console.log('graph/util/mxPoint.js');
