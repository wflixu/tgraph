
/**
 * Class: mxHexagon
 *
 * Implementation of the hexagon shape.
 *
 * Constructor: mxHexagon
 *
 * Constructs a new hexagon shape.
 */
import { mxUtils } from '../util/mxUtils.js';
import { mxActor } from './mxActor.js';
export class mxHexagon extends mxActor {
  	
  constructor() {
    super();
    this.stencil = this;
  }

  /**
   * Function: redrawPath
   *
   * Draws the path for this shape.
   */
  redrawPath(c, x, y, w, h) {
    var arcSize =
      mxUtils.getValue(
        this.style,
        mxConstants.STYLE_ARCSIZE,
        mxConstants.LINE_ARCSIZE,
      ) / 2;
    this.addPoints(
      c,
      [
        new mxPoint(0.25 * w, 0),
        new mxPoint(0.75 * w, 0),
        new mxPoint(w, 0.5 * h),
        new mxPoint(0.75 * w, h),
        new mxPoint(0.25 * w, h),
        new mxPoint(0, 0.5 * h),
      ],
      this.isRounded,
      arcSize,
      true,
    );
  }
}

console.log('graph/shape/mxHexagon.js');
