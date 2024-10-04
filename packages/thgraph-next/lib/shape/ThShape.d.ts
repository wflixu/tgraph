/**
 * Class: ThShape
 *
 * Base class for all shapes. A shape in mxGraph is a
 * separate implementation for SVG, VML and HTML. Which
 * implementation to use is controlled by the <dialect>
 * property which is assigned from within the <mxCellRenderer>
 * when the shape is created. The dialect must be assigned
 * for a shape, and it does normally depend on the browser and
 * the confiuration of the graph (see <mxGraph> rendering hint).
 *
 * For each supported shape in SVG and VML, a corresponding
 * shape exists in mxGraph, namely for text, image, rectangle,
 * rhombus, ellipse and polyline. The other shapes are a
 * combination of these shapes (eg. label and swimlane)
 * or they consist of one or more (filled) path objects
 * (eg. actor and cylinder). The HTML implementation is
 * optional but may be required for a HTML-only view of
 * the graph.
 *
 * Custom Shapes:
 *
 * To extend from this class, the basic code looks as follows.
 * In the special case where the custom shape consists only of
 * one filled region or one filled region and an additional stroke
 * the <mxActor> and <mxCylinder> should be subclassed,
 * respectively.
 *
 * (code)
 * function CustomShape() { }
 *
 * CustomShape.prototype = new ThShape();
 * CustomShape.prototype.constructor = CustomShape;
 * (end)
 *
 * To register a custom shape in an existing graph instance,
 * one must register the shape under a new name in the graph's
 * cell renderer as follows:
 *
 * (code)
 * mxCellRenderer.registerShape('customShape', CustomShape);
 * (end)
 *
 * The second argument is the name of the constructor.
 *
 * In order to use the shape you can refer to the given name above
 * in a stylesheet. For example, to change the shape for the default
 * vertex style, the following code is used:
 *
 * (code)
 * let style = graph.getStylesheet().getDefaultVertexStyle();
 * style[ThConstants.STYLE_SHAPE] = 'customShape';
 * (end)
 *
 * Constructor: ThShape
 *
 * Constructs a new shape.
 */
import { ThStencil } from "./ThStencil";
export declare class ThShape {
    /**
     * Variable: dialect
     *
     * Holds the dialect in which the shape is to be painted.
     * This can be one of the DIALECT constants in <ThConstants>.
     */
    dialect: null;
    /**
     * Variable: scale
     *
     * Holds the scale in which the shape is being painted.
     */
    scale: number;
    /**
     * Variable: antiAlias
     *
     * Rendering hint for configuring the canvas.
     */
    antiAlias: boolean;
    /**
     * Variable: minSvgStrokeWidth
     *
     * Minimum stroke width for SVG output.
     */
    minSvgStrokeWidth: number;
    /**
     * Variable: bounds
     *
     * Holds the <mxRectangle> that specifies the bounds of this shape.
     */
    bounds: null;
    /**
     * Variable: points
     *
     * Holds the array of <mxPoints> that specify the points of this shape.
     */
    points: null;
    /**
     * Variable: node
     *
     * Holds the outermost DOM node that represents this shape.
     */
    node: Optional<HTMLElement>;
    /**
     * Variable: state
     *
     * Optional reference to the corresponding <mxCellState>.
     */
    state: null;
    /**
     * Variable: style
     *
     * Optional reference to the style of the corresponding <mxCellState>.
     */
    style: null;
    /**
     * Variable: boundingBox
     *
     * Contains the bounding box of the shape, that is, the smallest rectangle
     * that includes all pixels of the shape.
     */
    boundingBox: null;
    /**
     * Variable: stencil
     *
     * Holds the <mxStencil> that defines the shape.
     */
    stencil: Optional<ThStencil>;
    /**
     * Variable: svgStrokeTolerance
     *
     * Event-tolerance for SVG strokes (in px). Default is 8. This is only passed
     * to the canvas in <createSvgCanvas> if <pointerEvents> is true.
     */
    svgStrokeTolerance: number;
    /**
     * Variable: pointerEvents
     *
     * Specifies if pointer events should be handled. Default is true.
     */
    pointerEvents: boolean;
    /**
     * Variable: svgPointerEvents
     *
     * Specifies if pointer events should be handled. Default is true.
     */
    svgPointerEvents: string;
    /**
     * Variable: shapePointerEvents
     *
     * Specifies if pointer events outside of shape should be handled. Default
     * is false.
     */
    shapePointerEvents: boolean;
    /**
     * Variable: stencilPointerEvents
     *
     * Specifies if pointer events outside of stencils should be handled. Default
     * is false. Set this to true for backwards compatibility with the 1.x branch.
     */
    stencilPointerEvents: boolean;
    /**
     * Variable: vmlScale
     *
     * Scale for improving the precision of VML rendering. Default is 1.
     */
    vmlScale: number;
    /**
     * Variable: outline
     *
     * Specifies if the shape should be drawn as an outline. This disables all
     * fill colors and can be used to disable other drawing states that should
     * not be painted for outlines. Default is false. This should be set before
     * calling <apply>.
     */
    outline: boolean;
    /**
     * Variable: visible
     *
     * Specifies if the shape is visible. Default is true.
     */
    visible: boolean;
    /**
     * Variable: useSvgBoundingBox
     *
     * Allows to use the SVG bounding box in SVG. Default is false for performance
     * reasons.
     */
    useSvgBoundingBox: boolean;
    strokewidth: number;
    rotation: number;
    opacity: number;
    fillOpacity: number;
    strokeOpacity: number;
    flipH: boolean;
    constructor(stencil?: any);
    /**
     * Function: init
     *
     * Initializes the shape by creaing the DOM node using <create>
     * and adding it into the given container.
     *
     * Parameters:
     *
     * container - DOM node that will contain the shape.
     */
    init(container: HTMLElement): void;
    /**
     * Function: initStyles
     *
     * Sets the styles to their default values.
     */
    initStyles(): void;
    /**
     * Function: isHtmlAllowed
     *
     * Returns true if HTML is allowed for this shape. This implementation always
     * returns false.
     */
    isHtmlAllowed(): boolean;
    /**
     * Function: getSvgScreenOffset
     *
     * Returns 0, or 0.5 if <strokewidth> % 2 == 1.
     */
    getSvgScreenOffset(): 0 | 0.5;
    /**
     * Function: create
     *
     * Creates and returns the DOM node(s) for the shape in
     * the given container. This implementation invokes
     * <createSvg>, <createHtml> or <createVml> depending
     * on the <dialect> and style settings.
     *
     * Parameters:
     *
     * container - DOM node that will contain the shape.
     */
    create(): HTMLElement;
    /**
     * Function: createSvg
     *
     * Creates and returns the SVG node(s) to represent this shape.
     */
    createSvg(): HTMLElement;
    /**
     * Function: createHtml
     *
     * Creates and returns the HTML DOM node(s) to represent
     * this shape. This implementation falls back to <createVml>
     * so that the HTML creation is optional.
     */
    createHtml(): HTMLDivElement;
    /**
     * Function: reconfigure
     *
     * Reconfigures this shape. This will update the colors etc in
     * addition to the bounds or points.
     */
    reconfigure(): void;
}
