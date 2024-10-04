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
export declare class ThPoint {
    /**
     * Variable: x
     *
     * Holds the x-coordinate of the point. Default is 0.
     */
    x: number;
    /**
     * Variable: y
     *
     * Holds the y-coordinate of the point. Default is 0.
     */
    y: number;
    constructor(x?: number, y?: number);
    /**
     * Function: equals
     *
     * Returns true if the given object equals this point.
     */
    equals(obj: any): any;
    /**
     * Function: clone
     *
     * Returns a clone of this <ThPoint>.
     */
    clone(): any;
}
