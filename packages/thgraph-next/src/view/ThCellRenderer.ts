import { ThConnector } from '../shape/ThConnector';
import { ThRectangleShape } from '../shape/ThRectangleShape';
import { ThText } from '../shape/ThText';
import { ThShape } from './../shape/ThShape';


export class ThCellRenderer {
    /**
   * Variable: defaultShapes
   *
   * Static array that contains the globally registered shapes which are
   * known to all instances of this class. For adding new shapes you should
   * use the static <ThCellRenderer.registerShape> function.
   */
    static defaultShapes:Record<string,ThShape> = {};

    /**
     * Function: registerShape
     *
     * Registers the given constructor under the specified key in this instance
     * of the renderer.
     *
     * Example:
     *
     * (code)
     * ThCellRenderer.registerShape(mxConstants.SHAPE_RECTANGLE, ThRectangleShape);
     * (end)
     *
     * Parameters:
     *
     * key - String representing the shape name.
     * shape - Constructor of the <mxShape> subclass.
     */
    static registerShape(key:string, shape:ThShape) {
        ThCellRenderer.defaultShapes[key] = shape;
    }

    /**
     * Variable: defaultEdgeShape
     *
     * Defines the default shape for edges. Default is <ThConnector>.
     */
    defaultEdgeShape = ThConnector;

    /**
     * Variable: defaultVertexShape
     *
     * Defines the default shape for vertices. Default is <ThRectangleShape>.
     */
    defaultVertexShape = ThRectangleShape;

    /**
     * Variable: defaultTextShape
     *
     * Defines the default shape for labels. Default is <ThText>.
     */
    defaultTextShape = ThText;

    /**
     * Variable: legacyControlPosition
     *
     * Specifies if the folding icon should ignore the horizontal
     * orientation of a swimlane. Default is true.
     */
    legacyControlPosition = true;

    /**
     * Variable: legacySpacing
     *
     * Specifies if spacing and label position should be ignored if overflow is
     * fill or width. Default is true for backwards compatiblity.
     */
    legacySpacing = true;

    /**
     * Variable: antiAlias
     *
     * Anti-aliasing option for new shapes. Default is true.
     */
    antiAlias = true;

    /**
     * Variable: minSvgStrokeWidth
     *
     * Minimum stroke width for SVG output.
     */
    minSvgStrokeWidth = 1;

    /**
     * Variable: forceControlClickHandler
     *
     * Specifies if the enabled state of the graph should be ignored in the control
     * click handler (to allow folding in disabled graphs). Default is false.
     */
    forceControlClickHandler = false;
}