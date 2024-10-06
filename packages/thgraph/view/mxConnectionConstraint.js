
/**
 * Class: mxConnectionConstraint
 * 
 * Defines an object that contains the constraints about how to connect one
 * side of an edge to its terminal.
 * 
 * Constructor: mxConnectionConstraint
 * 
 * Constructs a new connection constraint for the given point and boolean
 * arguments.
 * 
 * Parameters:
 * 
 * point - Optional <mxPoint> that specifies the fixed location of the point
 * in relative coordinates. Default is null.
 * perimeter - Optional boolean that specifies if the fixed point should be
 * projected onto the perimeter of the terminal. Default is true.
 */
export class mxConnectionConstraint {

    /**
 * Variable: point
 * 
 * <mxPoint> that specifies the fixed location of the connection point.
 */
    point = null;

    /**
     * Variable: perimeter
     * 
     * Boolean that specifies if the point should be projected onto the perimeter
     * of the terminal.
     */
    perimeter = null;

    /**
     * Variable: name
     * 
     * Optional string that specifies the name of the constraint.
     */
    name = null;

    /**
     * Variable: dx
     * 
     * Optional float that specifies the horizontal offset of the constraint.
     */
    dx = null;

    /**
     * Variable: dy
     * 
     * Optional float that specifies the vertical offset of the constraint.
     */
    dy = null;

    constructor(point, perimeter, name, dx, dy) {
        this.point = point;
        this.perimeter = (perimeter != null) ? perimeter : true;
        this.name = name;
        this.dx = dx ? dx : 0;
        this.dy = dy ? dy : 0;
    }

};



console.log('graph/view/mxConnectionConstraint.js');