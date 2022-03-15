/**
 * Class: ThPoint
 *
 * Implements a 2-dimensional vector with double precision coordinates.
 *
 * Constructor: ThPoint
 *
 * Constructs a new point for the optional x and y coordinates. If no
 * coordinates are given, then the default values for <x> and <y> are used.
 */

import { ThUtils } from './ThUtils';
export class ThPoint {
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
    equals(obj: any) {
        return obj && obj.x == this.x && obj.y == this.y;
    }

    /**
     * Function: clone
     *
     * Returns a clone of this <ThPoint>.
     */
    clone() {
        // Handles subclasses as well
        return ThUtils.clone(this);
    }
}

