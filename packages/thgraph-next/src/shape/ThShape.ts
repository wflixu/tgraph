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
//  import {
//     mxRectangle,
//     mxPoint,
//     ThUtils,
//     ThConstants,
//     mxSvgCanvas2D,
//     mxEvent,


//   } from '../util/index.js';

import { ThConstants } from "../util/ThConstants";
import { ThUtils } from "../util/ThUtils";
import { ThStencil } from "./ThStencil";

export class ThShape {
    /**
     * Variable: dialect
     *
     * Holds the dialect in which the shape is to be painted.
     * This can be one of the DIALECT constants in <ThConstants>.
     */
    dialect = null;

    /**
     * Variable: scale
     *
     * Holds the scale in which the shape is being painted.
     */
    scale = 1;

    /**
     * Variable: antiAlias
     *
     * Rendering hint for configuring the canvas.
     */
    antiAlias = true;

    /**
     * Variable: minSvgStrokeWidth
     *
     * Minimum stroke width for SVG output.
     */
    minSvgStrokeWidth = 1;

    /**
     * Variable: bounds
     *
     * Holds the <mxRectangle> that specifies the bounds of this shape.
     */
    bounds = null;

    /**
     * Variable: points
     *
     * Holds the array of <mxPoints> that specify the points of this shape.
     */
    points = null;

    /**
     * Variable: node
     *
     * Holds the outermost DOM node that represents this shape.
     */
    node: Optional<HTMLElement> = null;

    /**
     * Variable: state
     *
     * Optional reference to the corresponding <mxCellState>.
     */
    state = null;

    /**
     * Variable: style
     *
     * Optional reference to the style of the corresponding <mxCellState>.
     */
    style = null;

    /**
     * Variable: boundingBox
     *
     * Contains the bounding box of the shape, that is, the smallest rectangle
     * that includes all pixels of the shape.
     */
    boundingBox = null;

    /**
     * Variable: stencil
     *
     * Holds the <mxStencil> that defines the shape.
     */
    stencil:Optional<ThStencil> = null;

    /**
     * Variable: svgStrokeTolerance
     *
     * Event-tolerance for SVG strokes (in px). Default is 8. This is only passed
     * to the canvas in <createSvgCanvas> if <pointerEvents> is true.
     */
    svgStrokeTolerance = 8;

    /**
     * Variable: pointerEvents
     *
     * Specifies if pointer events should be handled. Default is true.
     */
    pointerEvents = true;

    /**
     * Variable: svgPointerEvents
     *
     * Specifies if pointer events should be handled. Default is true.
     */
    svgPointerEvents = 'all';

    /**
     * Variable: shapePointerEvents
     *
     * Specifies if pointer events outside of shape should be handled. Default
     * is false.
     */
    shapePointerEvents = false;

    /**
     * Variable: stencilPointerEvents
     *
     * Specifies if pointer events outside of stencils should be handled. Default
     * is false. Set this to true for backwards compatibility with the 1.x branch.
     */
    stencilPointerEvents = false;

    /**
     * Variable: vmlScale
     *
     * Scale for improving the precision of VML rendering. Default is 1.
     */
    vmlScale = 1;

    /**
     * Variable: outline
     *
     * Specifies if the shape should be drawn as an outline. This disables all
     * fill colors and can be used to disable other drawing states that should
     * not be painted for outlines. Default is false. This should be set before
     * calling <apply>.
     */
    outline = false;

    /**
     * Variable: visible
     *
     * Specifies if the shape is visible. Default is true.
     */
    visible = true;

    /**
     * Variable: useSvgBoundingBox
     *
     * Allows to use the SVG bounding box in SVG. Default is false for performance
     * reasons.
     */
    useSvgBoundingBox = false;
    strokewidth: number = 1;
    rotation: number = 1;
    opacity: number = 100;
    fillOpacity: number = 100;
    strokeOpacity: number = 100;
    flipH: boolean = false;

    constructor(stencil?: any) {
        this.stencil = stencil;
        //   this.initStyles();
    }

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
    init(container: HTMLElement) {
        if (!this.node) {
            this.node = this.create();
            if (container) {
                container.appendChild(this.node);
            }
        }
    }

    /**
     * Function: initStyles
     *
     * Sets the styles to their default values.
     */
    initStyles() {
        this.strokewidth = 1;
        this.rotation = 0;
        this.opacity = 100;
        this.fillOpacity = 100;
        this.strokeOpacity = 100;
        this.flipH = false;
        this.flipH = false;
    }



    /**
     * Function: isHtmlAllowed
     *
     * Returns true if HTML is allowed for this shape. This implementation always
     * returns false.
     */
    isHtmlAllowed() {
        return false;
    }

    /**
     * Function: getSvgScreenOffset
     *
     * Returns 0, or 0.5 if <strokewidth> % 2 == 1.
     */
    getSvgScreenOffset() {
        let sw =
            this.stencil && this.stencil.strokewidth != 'inherit'
                ? Number(this.stencil.strokewidth)
                : this.strokewidth;

        return ThUtils.mod(Math.max(1, Math.round(sw * this.scale)), 2) == 1
            ? 0.5
            : 0;
    }

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
    create():HTMLElement {
    
        let node = this.createSvg();
        return node;
    }

    /**
     * Function: createSvg
     *
     * Creates and returns the SVG node(s) to represent this shape.
     */
    createSvg():HTMLElement {
        return document.createElementNS(ThConstants.NS_SVG, 'g') as HTMLElement;
    }


    /**
     * Function: createHtml
     *
     * Creates and returns the HTML DOM node(s) to represent
     * this shape. This implementation falls back to <createVml>
     * so that the HTML creation is optional.
     */
    createHtml() {
        let node = document.createElement('div');
        node.style.position = 'absolute';

        return node;
    }

    /**
     * Function: reconfigure
     *
     * Reconfigures this shape. This will update the colors etc in
     * addition to the bounds or points.
     */
    reconfigure() {
        // this.redraw();
    }

    // /**
    //  * Function: redraw
    //  *
    //  * Creates and returns the SVG node(s) to represent this shape.
    //  */
    // redraw() {
    //     this.updateBoundsFromPoints();

    //     if (this.visible && this.checkBounds()) {
    //         this.node.style.visibility = 'visible';
    //         this.clear();

    //         if (
    //             this.node.nodeName == 'DIV' &&
    //             (this.isHtmlAllowed() || !mxClient.IS_VML)
    //         ) {
    //             this.redrawHtmlShape();
    //         } else {
    //             this.redrawShape();
    //         }

    //         this.updateBoundingBox();
    //     } else {
    //         this.node.style.visibility = 'hidden';
    //         this.boundingBox = null;
    //     }
    // }

    // /**
    //  * Function: clear
    //  *
    //  * Removes all child nodes and resets all CSS.
    //  */
    // clear() {
    //     if (this.node.ownerSVGElement != null) {
    //         while (this.node.lastChild != null) {
    //             this.node.removeChild(this.node.lastChild);
    //         }
    //     } else {
    //         this.node.style.cssText =
    //             'position:absolute;' +
    //             (this.cursor != null ? 'cursor:' + this.cursor + ';' : '');
    //         this.node.innerHTML = '';
    //     }
    // }

    // /**
    //  * Function: updateBoundsFromPoints
    //  *
    //  * Updates the bounds based on the points.
    //  */
    // updateBoundsFromPoints() {
    //     let pts = this.points;

    //     if (pts != null && pts.length > 0 && pts[0] != null) {
    //         this.bounds = new mxRectangle(Number(pts[0].x), Number(pts[0].y), 1, 1);

    //         for (let i = 1; i < this.points.length; i++) {
    //             if (pts[i] != null) {
    //                 this.bounds.add(
    //                     new mxRectangle(Number(pts[i].x), Number(pts[i].y), 1, 1),
    //                 );
    //             }
    //         }
    //     }
    // }

    // /**
    //  * Function: getLabelBounds
    //  *
    //  * Returns the <mxRectangle> for the label bounds of this shape, based on the
    //  * given scaled and translated bounds of the shape. This method should not
    //  * change the rectangle in-place. This implementation returns the given rect.
    //  */
    // getLabelBounds(rect) {
    //     let d = ThUtils.getValue(
    //         this.style,
    //         ThConstants.STYLE_DIRECTION,
    //         ThConstants.DIRECTION_EAST,
    //     );
    //     let bounds = rect;

    //     // Normalizes argument for getLabelMargins hook
    //     if (
    //         d != ThConstants.DIRECTION_SOUTH &&
    //         d != ThConstants.DIRECTION_NORTH &&
    //         this.state != null &&
    //         this.state.text != null &&
    //         this.state.text.isPaintBoundsInverted()
    //     ) {
    //         bounds = bounds.clone();
    //         let tmp = bounds.width;
    //         bounds.width = bounds.height;
    //         bounds.height = tmp;
    //     }

    //     let m = this.getLabelMargins(bounds);

    //     if (m != null) {
    //         let flipH =
    //             ThUtils.getValue(this.style, ThConstants.STYLE_FLIPH, false) == '1';
    //         let flipV =
    //             ThUtils.getValue(this.style, ThConstants.STYLE_FLIPV, false) == '1';

    //         // Handles special case for vertical labels
    //         if (
    //             this.state != null &&
    //             this.state.text != null &&
    //             this.state.text.isPaintBoundsInverted()
    //         ) {
    //             let tmp = m.x;
    //             m.x = m.height;
    //             m.height = m.width;
    //             m.width = m.y;
    //             m.y = tmp;

    //             tmp = flipH;
    //             flipH = flipV;
    //             flipV = tmp;
    //         }

    //         return ThUtils.getDirectedBounds(rect, m, this.style, flipH, flipV);
    //     }

    //     return rect;
    // }

    // /**
    //  * Function: getLabelMargins
    //  *
    //  * Returns the scaled top, left, bottom and right margin to be used for
    //  * computing the label bounds as an <mxRectangle>, where the bottom and right
    //  * margin are defined in the width and height of the rectangle, respectively.
    //  */
    // getLabelMargins(rect) {
    //     return null;
    // }

    // /**
    //  * Function: checkBounds
    //  *
    //  * Returns true if the bounds are not null and all of its variables are numeric.
    //  */
    // checkBounds() {
    //     return (
    //         !isNaN(this.scale) &&
    //         isFinite(this.scale) &&
    //         this.scale > 0 &&
    //         this.bounds != null &&
    //         !isNaN(this.bounds.x) &&
    //         !isNaN(this.bounds.y) &&
    //         !isNaN(this.bounds.width) &&
    //         !isNaN(this.bounds.height) &&
    //         this.bounds.width > 0 &&
    //         this.bounds.height > 0
    //     );
    // }

    // /**
    //  * Function: createVmlGroup
    //  *
    //  * Returns the temporary element used for rendering in IE8 standards mode.
    //  */
    // createVmlGroup() {
    //     let node = document.createElement(mxClient.VML_PREFIX + ':group');
    //     node.style.position = 'absolute';
    //     node.style.width = this.node.style.width;
    //     node.style.height = this.node.style.height;

    //     return node;
    // }

    // /**
    //  * Function: redrawShape
    //  *
    //  * Updates the SVG or VML shape.
    //  */
    // redrawShape() {
    //     let canvas = this.createCanvas();

    //     if (canvas != null) {
    //         // Specifies if events should be handled
    //         canvas.pointerEvents = this.pointerEvents;

    //         this.beforePaint(canvas);
    //         this.paint(canvas);
    //         this.afterPaint(canvas);

    //         if (this.node != canvas.root) {
    //             // Forces parsing in IE8 standards mode - slow! avoid
    //             this.node.insertAdjacentHTML('beforeend', canvas.root.outerHTML);
    //         }

    //         if (this.node.nodeName == 'DIV' && document.documentMode == 8) {
    //             // Makes DIV transparent to events for IE8 in IE8 standards
    //             // mode (Note: Does not work for IE9 in IE8 standards mode
    //             // and not for IE11 in enterprise mode)
    //             this.node.style.filter = '';

    //             // Adds event transparency in IE8 standards
    //             ThUtils.addTransparentBackgroundFilter(this.node);
    //         }

    //         this.destroyCanvas(canvas);
    //     }
    // }

    // /**
    //  * Function: createCanvas
    //  *
    //  * Creates a new canvas for drawing this shape. May return null.
    //  */
    // createCanvas() {
    //     let canvas = null;

    //     // LATER: Check if reusing existing DOM nodes improves performance
    //     if (this.node.ownerSVGElement != null) {
    //         canvas = this.createSvgCanvas();
    //     }

    //     if (canvas != null && this.outline) {
    //         canvas.setStrokeWidth(this.strokewidth);
    //         canvas.setStrokeColor(this.stroke);

    //         if (this.isDashed != null) {
    //             canvas.setDashed(this.isDashed);
    //         }

    //         canvas.setStrokeWidth = function () { };
    //         canvas.setStrokeColor = function () { };
    //         canvas.setFillColor = function () { };
    //         canvas.setGradient = function () { };
    //         canvas.setDashed = function () { };
    //         canvas.text = function () { };
    //     }

    //     return canvas;
    // }

    // /**
    //  * Function: createSvgCanvas
    //  *
    //  * Creates and returns an <mxSvgCanvas2D> for rendering this shape.
    //  */
    // createSvgCanvas() {
    //     let canvas = new mxSvgCanvas2D(this.node, false);
    //     canvas.strokeTolerance = this.pointerEvents ? this.svgStrokeTolerance : 0;
    //     canvas.pointerEventsValue = this.svgPointerEvents;
    //     let off = this.getSvgScreenOffset();

    //     if (off != 0) {
    //         this.node.setAttribute('transform', 'translate(' + off + ',' + off + ')');
    //     } else {
    //         this.node.removeAttribute('transform');
    //     }

    //     canvas.minStrokeWidth = this.minSvgStrokeWidth;

    //     if (!this.antiAlias) {
    //         // Rounds all numbers in the SVG output to integers
    //         canvas.format = function (value) {
    //             return Math.round(parseFloat(value));
    //         };
    //     }

    //     return canvas;
    // }

    // /**
    //  * Function: updateVmlContainer
    //  *
    //  * Updates the bounds of the VML container.
    //  */
    // updateVmlContainer() {
    //     this.node.style.left = Math.round(this.bounds.x) + 'px';
    //     this.node.style.top = Math.round(this.bounds.y) + 'px';
    //     let w = Math.max(1, Math.round(this.bounds.width));
    //     let h = Math.max(1, Math.round(this.bounds.height));
    //     this.node.style.width = w + 'px';
    //     this.node.style.height = h + 'px';
    //     this.node.style.overflow = 'visible';
    // }

    // /**
    //  * Function: redrawHtml
    //  *
    //  * Allow optimization by replacing VML with HTML.
    //  */
    // redrawHtmlShape() {
    //     // LATER: Refactor methods
    //     this.updateHtmlBounds(this.node);
    //     this.updateHtmlFilters(this.node);
    //     this.updateHtmlColors(this.node);
    // }

    // /**
    //  * Function: updateHtmlFilters
    //  *
    //  * Allow optimization by replacing VML with HTML.
    //  */
    // updateHtmlFilters(node) {
    //     let f = '';

    //     if (this.opacity < 100) {
    //         f += 'alpha(opacity=' + this.opacity + ')';
    //     }

    //     if (this.isShadow) {
    //         // FIXME: Cannot implement shadow transparency with filter
    //         f +=
    //             'progid:DXImageTransform.Microsoft.dropShadow (' +
    //             "OffX='" +
    //             Math.round(ThConstants.SHADOW_OFFSET_X * this.scale) +
    //             "', " +
    //             "OffY='" +
    //             Math.round(ThConstants.SHADOW_OFFSET_Y * this.scale) +
    //             "', " +
    //             "Color='" +
    //             ThConstants.VML_SHADOWCOLOR +
    //             "')";
    //     }

    //     if (
    //         this.fill != null &&
    //         this.fill != ThConstants.NONE &&
    //         this.gradient &&
    //         this.gradient != ThConstants.NONE
    //     ) {
    //         let start = this.fill;
    //         let end = this.gradient;
    //         let type = '0';

    //         let lookup = { east: 0, south: 1, west: 2, north: 3 };
    //         let dir = this.direction != null ? lookup[this.direction] : 0;

    //         if (this.gradientDirection != null) {
    //             dir = ThUtils.mod(dir + lookup[this.gradientDirection] - 1, 4);
    //         }

    //         if (dir == 1) {
    //             type = '1';
    //             let tmp = start;
    //             start = end;
    //             end = tmp;
    //         } else if (dir == 2) {
    //             let tmp = start;
    //             start = end;
    //             end = tmp;
    //         } else if (dir == 3) {
    //             type = '1';
    //         }

    //         f +=
    //             'progid:DXImageTransform.Microsoft.gradient(' +
    //             "startColorStr='" +
    //             start +
    //             "', endColorStr='" +
    //             end +
    //             "', gradientType='" +
    //             type +
    //             "')";
    //     }

    //     node.style.filter = f;
    // }

    // /**
    //  * Function: updateHtmlColors
    //  *
    //  * Allow optimization by replacing VML with HTML.
    //  */
    // updateHtmlColors(node) {
    //     let color = this.stroke;

    //     if (color != null && color != ThConstants.NONE) {
    //         node.style.borderColor = color;

    //         if (this.isDashed) {
    //             node.style.borderStyle = 'dashed';
    //         } else if (this.strokewidth > 0) {
    //             node.style.borderStyle = 'solid';
    //         }

    //         node.style.borderWidth =
    //             Math.max(1, Math.ceil(this.strokewidth * this.scale)) + 'px';
    //     } else {
    //         node.style.borderWidth = '0px';
    //     }

    //     color = this.outline ? null : this.fill;

    //     if (color != null && color != ThConstants.NONE) {
    //         node.style.backgroundColor = color;
    //         node.style.backgroundImage = 'none';
    //     } else if (this.pointerEvents) {
    //         node.style.backgroundColor = 'transparent';
    //     } else if (document.documentMode == 8) {
    //         ThUtils.addTransparentBackgroundFilter(node);
    //     } else {
    //         this.setTransparentBackgroundImage(node);
    //     }
    // }

    // /**
    //  * Function: updateHtmlBounds
    //  *
    //  * Allow optimization by replacing VML with HTML.
    //  */
    // updateHtmlBounds(node) {
    //     let sw =
    //         document.documentMode >= 9 ? 0 : Math.ceil(this.strokewidth * this.scale);
    //     node.style.borderWidth = Math.max(1, sw) + 'px';
    //     node.style.overflow = 'hidden';

    //     node.style.left = Math.round(this.bounds.x - sw / 2) + 'px';
    //     node.style.top = Math.round(this.bounds.y - sw / 2) + 'px';

    //     if (document.compatMode == 'CSS1Compat') {
    //         sw = -sw;
    //     }

    //     node.style.width = Math.round(Math.max(0, this.bounds.width + sw)) + 'px';
    //     node.style.height = Math.round(Math.max(0, this.bounds.height + sw)) + 'px';
    // }

    // /**
    //  * Function: destroyCanvas
    //  *
    //  * Destroys the given canvas which was used for drawing. This implementation
    //  * increments the reference counts on all shared gradients used in the canvas.
    //  */
    // destroyCanvas(canvas) {
    //     // Manages reference counts
    //     if (canvas instanceof mxSvgCanvas2D) {
    //         // Increments ref counts
    //         for (let key in canvas.gradients) {
    //             let gradient = canvas.gradients[key];

    //             if (gradient != null) {
    //                 gradient.mxRefCount = (gradient.mxRefCount || 0) + 1;
    //             }
    //         }

    //         this.releaseSvgGradients(this.oldGradients);
    //         this.oldGradients = canvas.gradients;
    //     }
    // }

    // /**
    //  * Function: beforePaint
    //  *
    //  * Invoked before paint is called.
    //  */
    // beforePaint(c) { }

    // /**
    //  * Function: afterPaint
    //  *
    //  * Invokes after paint was called.
    //  */
    // afterPaint(c) { }

    // /**
    //  * Function: paint
    //  *
    //  * Generic rendering code.
    //  */
    // paint(c) {
    //     let strokeDrawn = false;

    //     if (c != null && this.outline) {
    //         let stroke = c.stroke;

    //         c.stroke = function () {
    //             strokeDrawn = true;
    //             stroke.apply(this, arguments);
    //         };

    //         let fillAndStroke = c.fillAndStroke;

    //         c.fillAndStroke = function () {
    //             strokeDrawn = true;
    //             fillAndStroke.apply(this, arguments);
    //         };
    //     }

    //     // Scale is passed-through to canvas
    //     let s = this.scale;
    //     let x = this.bounds.x / s;
    //     let y = this.bounds.y / s;
    //     let w = this.bounds.width / s;
    //     let h = this.bounds.height / s;

    //     if (this.isPaintBoundsInverted()) {
    //         let t = (w - h) / 2;
    //         x += t;
    //         y -= t;
    //         let tmp = w;
    //         w = h;
    //         h = tmp;
    //     }

    //     this.updateTransform(c, x, y, w, h);
    //     this.configureCanvas(c, x, y, w, h);

    //     // Adds background rectangle to capture events
    //     let bg = null;

    //     if (
    //         (this.stencil == null &&
    //             this.points == null &&
    //             this.shapePointerEvents) ||
    //         (this.stencil != null && this.stencilPointerEvents)
    //     ) {
    //         let bb = this.createBoundingBox();

    //         if (this.dialect == ThConstants.DIALECT_SVG) {
    //             bg = this.createTransparentSvgRectangle(
    //                 bb.x,
    //                 bb.y,
    //                 bb.width,
    //                 bb.height,
    //             );
    //             this.node.appendChild(bg);
    //         } else {
    //             let rect = c.createRect(
    //                 'rect',
    //                 bb.x / s,
    //                 bb.y / s,
    //                 bb.width / s,
    //                 bb.height / s,
    //             );
    //             rect.appendChild(c.createTransparentFill());
    //             rect.stroked = 'false';
    //             c.root.appendChild(rect);
    //         }
    //     }

    //     if (this.stencil && this.stencil.drawShape) {
    //         this.stencil.drawShape(c, this, x, y, w, h);
    //     } else {
    //         // Stencils have separate strokewidth
    //         c.setStrokeWidth(this.strokewidth);

    //         if (this.points != null) {
    //             // Paints edge shape
    //             let pts = [];

    //             for (let i = 0; i < this.points.length; i++) {
    //                 if (this.points[i] != null) {
    //                     pts.push(new mxPoint(this.points[i].x / s, this.points[i].y / s));
    //                 }
    //             }

    //             this.paintEdgeShape(c, pts);
    //         } else {
    //             // Paints vertex shape
    //             this.paintVertexShape(c, x, y, w, h);
    //         }
    //     }

    //     if (bg != null && c.state != null && c.state.transform != null) {
    //         bg.setAttribute('transform', c.state.transform);
    //     }

    //     // Draws highlight rectangle if no stroke was used
    //     if (c != null && this.outline && !strokeDrawn) {
    //         c.rect(x, y, w, h);
    //         c.stroke();
    //     }
    // }

    // /**
    //  * Function: configureCanvas
    //  *
    //  * Sets the state of the canvas for drawing the shape.
    //  */
    // configureCanvas(c, x, y, w, h) {
    //     let dash = null;

    //     if (this.style != null) {
    //         dash = this.style['dashPattern'];
    //     }

    //     c.setAlpha(this.opacity / 100);
    //     c.setFillAlpha(this.fillOpacity / 100);
    //     c.setStrokeAlpha(this.strokeOpacity / 100);

    //     // Sets alpha, colors and gradients
    //     if (this.isShadow != null) {
    //         c.setShadow(this.isShadow);
    //     }

    //     // Dash pattern
    //     if (this.isDashed != null) {
    //         c.setDashed(
    //             this.isDashed,
    //             this.style != null
    //                 ? ThUtils.getValue(this.style, ThConstants.STYLE_FIX_DASH, false) == 1
    //                 : false,
    //         );
    //     }

    //     if (dash != null) {
    //         c.setDashPattern(dash);
    //     }

    //     if (
    //         this.fill != null &&
    //         this.fill != ThConstants.NONE &&
    //         this.gradient &&
    //         this.gradient != ThConstants.NONE
    //     ) {
    //         let b = this.getGradientBounds(c, x, y, w, h);
    //         c.setGradient(
    //             this.fill,
    //             this.gradient,
    //             b.x,
    //             b.y,
    //             b.width,
    //             b.height,
    //             this.gradientDirection,
    //         );
    //     } else {
    //         c.setFillColor(this.fill);
    //     }

    //     c.setStrokeColor(this.stroke);
    // }

    // /**
    //  * Function: getGradientBounds
    //  *
    //  * Returns the bounding box for the gradient box for this shape.
    //  */
    // getGradientBounds(c, x, y, w, h) {
    //     return new mxRectangle(x, y, w, h);
    // }

    // /**
    //  * Function: updateTransform
    //  *
    //  * Sets the scale and rotation on the given canvas.
    //  */
    // updateTransform(c, x, y, w, h) {
    //     // NOTE: Currently, scale is implemented in state and canvas. This will
    //     // move to canvas in a later version, so that the states are unscaled
    //     // and untranslated and do not need an update after zooming or panning.
    //     c.scale(this.scale);
    //     c.rotate(
    //         this.getShapeRotation(),
    //         this.flipH,
    //         this.flipV,
    //         x + w / 2,
    //         y + h / 2,
    //     );
    // }

    // /**
    //  * Function: paintVertexShape
    //  *
    //  * Paints the vertex shape.
    //  */
    // paintVertexShape(c, x, y, w, h) {
    //     this.paintBackground(c, x, y, w, h);

    //     if (
    //         !this.outline ||
    //         this.style == null ||
    //         ThUtils.getValue(this.style, ThConstants.STYLE_BACKGROUND_OUTLINE, 0) == 0
    //     ) {
    //         c.setShadow(false);
    //         this.paintForeground(c, x, y, w, h);
    //     }
    // }

    // /**
    //  * Function: paintBackground
    //  *
    //  * Hook for subclassers. This implementation is empty.
    //  */
    // paintBackground(c, x, y, w, h) { }

    // /**
    //  * Function: paintForeground
    //  *
    //  * Hook for subclassers. This implementation is empty.
    //  */
    // paintForeground(c, x, y, w, h) { }

    // /**
    //  * Function: paintEdgeShape
    //  *
    //  * Hook for subclassers. This implementation is empty.
    //  */
    // paintEdgeShape(c, pts) { }

    // /**
    //  * Function: getArcSize
    //  *
    //  * Returns the arc size for the given dimension.
    //  */
    // getArcSize(w, h) {
    //     let r = 0;

    //     if (
    //         ThUtils.getValue(this.style, ThConstants.STYLE_ABSOLUTE_ARCSIZE, 0) == '1'
    //     ) {
    //         r = Math.min(
    //             w / 2,
    //             Math.min(
    //                 h / 2,
    //                 ThUtils.getValue(
    //                     this.style,
    //                     ThConstants.STYLE_ARCSIZE,
    //                     ThConstants.LINE_ARCSIZE,
    //                 ) / 2,
    //             ),
    //         );
    //     } else {
    //         let f =
    //             ThUtils.getValue(
    //                 this.style,
    //                 ThConstants.STYLE_ARCSIZE,
    //                 ThConstants.RECTANGLE_ROUNDING_FACTOR * 100,
    //             ) / 100;
    //         r = Math.min(w * f, h * f);
    //     }

    //     return r;
    // }

    // /**
    //  * Function: paintGlassEffect
    //  *
    //  * Paints the glass gradient effect.
    //  */
    // paintGlassEffect(c, x, y, w, h, arc) {
    //     let sw = Math.ceil(this.strokewidth / 2);
    //     let size = 0.4;

    //     c.setGradient('#ffffff', '#ffffff', x, y, w, h * 0.6, 'south', 0.9, 0.1);
    //     c.begin();
    //     arc += 2 * sw;

    //     if (this.isRounded) {
    //         c.moveTo(x - sw + arc, y - sw);
    //         c.quadTo(x - sw, y - sw, x - sw, y - sw + arc);
    //         c.lineTo(x - sw, y + h * size);
    //         c.quadTo(x + w * 0.5, y + h * 0.7, x + w + sw, y + h * size);
    //         c.lineTo(x + w + sw, y - sw + arc);
    //         c.quadTo(x + w + sw, y - sw, x + w + sw - arc, y - sw);
    //     } else {
    //         c.moveTo(x - sw, y - sw);
    //         c.lineTo(x - sw, y + h * size);
    //         c.quadTo(x + w * 0.5, y + h * 0.7, x + w + sw, y + h * size);
    //         c.lineTo(x + w + sw, y - sw);
    //     }

    //     c.close();
    //     c.fill();
    // }

    // /**
    //  * Function: addPoints
    //  *
    //  * Paints the given points with rounded corners.
    //  */
    // addPoints(c, pts, rounded, arcSize, close, exclude, initialMove) {
    //     if (pts != null && pts.length > 0) {
    //         initialMove = initialMove != null ? initialMove : true;
    //         let pe = pts[pts.length - 1];

    //         // Adds virtual waypoint in the center between start and end point
    //         if (close && rounded) {
    //             pts = pts.slice();
    //             let p0 = pts[0];
    //             let wp = new mxPoint(
    //                 pe.x + (p0.x - pe.x) / 2,
    //                 pe.y + (p0.y - pe.y) / 2,
    //             );
    //             pts.splice(0, 0, wp);
    //         }

    //         let pt = pts[0];
    //         let i = 1;

    //         // Draws the line segments
    //         if (initialMove) {
    //             c.moveTo(pt.x, pt.y);
    //         } else {
    //             c.lineTo(pt.x, pt.y);
    //         }

    //         while (i < (close ? pts.length : pts.length - 1)) {
    //             let tmp = pts[ThUtils.mod(i, pts.length)];
    //             let dx = pt.x - tmp.x;
    //             let dy = pt.y - tmp.y;

    //             if (
    //                 rounded &&
    //                 (dx != 0 || dy != 0) &&
    //                 (exclude == null || ThUtils.indexOf(exclude, i - 1) < 0)
    //             ) {
    //                 // Draws a line from the last point to the current
    //                 // point with a spacing of size off the current point
    //                 // into direction of the last point
    //                 let dist = Math.sqrt(dx * dx + dy * dy);
    //                 let nx1 = (dx * Math.min(arcSize, dist / 2)) / dist;
    //                 let ny1 = (dy * Math.min(arcSize, dist / 2)) / dist;

    //                 let x1 = tmp.x + nx1;
    //                 let y1 = tmp.y + ny1;
    //                 c.lineTo(x1, y1);

    //                 // Draws a curve from the last point to the current
    //                 // point with a spacing of size off the current point
    //                 // into direction of the next point
    //                 let next = pts[ThUtils.mod(i + 1, pts.length)];

    //                 // Uses next non-overlapping point
    //                 while (
    //                     i < pts.length - 2 &&
    //                     Math.round(next.x - tmp.x) == 0 &&
    //                     Math.round(next.y - tmp.y) == 0
    //                 ) {
    //                     next = pts[ThUtils.mod(i + 2, pts.length)];
    //                     i++;
    //                 }

    //                 dx = next.x - tmp.x;
    //                 dy = next.y - tmp.y;

    //                 dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
    //                 let nx2 = (dx * Math.min(arcSize, dist / 2)) / dist;
    //                 let ny2 = (dy * Math.min(arcSize, dist / 2)) / dist;

    //                 let x2 = tmp.x + nx2;
    //                 let y2 = tmp.y + ny2;

    //                 c.quadTo(tmp.x, tmp.y, x2, y2);
    //                 tmp = new mxPoint(x2, y2);
    //             } else {
    //                 c.lineTo(tmp.x, tmp.y);
    //             }

    //             pt = tmp;
    //             i++;
    //         }

    //         if (close) {
    //             c.close();
    //         } else {
    //             c.lineTo(pe.x, pe.y);
    //         }
    //     }
    // }

    // /**
    //  * Function: resetStyles
    //  *
    //  * Resets all styles.
    //  */
    // resetStyles() {
    //     this.initStyles();

    //     this.spacing = 0;

    //     delete this.fill;
    //     delete this.gradient;
    //     delete this.gradientDirection;
    //     delete this.stroke;
    //     delete this.startSize;
    //     delete this.endSize;
    //     delete this.startArrow;
    //     delete this.endArrow;
    //     delete this.direction;
    //     delete this.isShadow;
    //     delete this.isDashed;
    //     delete this.isRounded;
    //     delete this.glass;
    // }

    // /**
    //  * Function: apply
    //  *
    //  * Applies the style of the given <mxCellState> to the shape. This
    //  * implementation assigns the following styles to local fields:
    //  *
    //  * - <ThConstants.STYLE_FILLCOLOR> => fill
    //  * - <ThConstants.STYLE_GRADIENTCOLOR> => gradient
    //  * - <ThConstants.STYLE_GRADIENT_DIRECTION> => gradientDirection
    //  * - <ThConstants.STYLE_OPACITY> => opacity
    //  * - <ThConstants.STYLE_FILL_OPACITY> => fillOpacity
    //  * - <ThConstants.STYLE_STROKE_OPACITY> => strokeOpacity
    //  * - <ThConstants.STYLE_STROKECOLOR> => stroke
    //  * - <ThConstants.STYLE_STROKEWIDTH> => strokewidth
    //  * - <ThConstants.STYLE_SHADOW> => isShadow
    //  * - <ThConstants.STYLE_DASHED> => isDashed
    //  * - <ThConstants.STYLE_SPACING> => spacing
    //  * - <ThConstants.STYLE_STARTSIZE> => startSize
    //  * - <ThConstants.STYLE_ENDSIZE> => endSize
    //  * - <ThConstants.STYLE_ROUNDED> => isRounded
    //  * - <ThConstants.STYLE_STARTARROW> => startArrow
    //  * - <ThConstants.STYLE_ENDARROW> => endArrow
    //  * - <ThConstants.STYLE_ROTATION> => rotation
    //  * - <ThConstants.STYLE_DIRECTION> => direction
    //  * - <ThConstants.STYLE_GLASS> => glass
    //  *
    //  * This keeps a reference to the <style>. If you need to keep a reference to
    //  * the cell, you can override this method and store a local reference to
    //  * state.cell or the <mxCellState> itself. If <outline> should be true, make
    //  * sure to set it before calling this method.
    //  *
    //  * Parameters:
    //  *
    //  * state - <mxCellState> of the corresponding cell.
    //  */
    // apply(state) {
    //     this.state = state;
    //     this.style = state.style;

    //     if (this.style != null) {
    //         this.fill = ThUtils.getValue(
    //             this.style,
    //             ThConstants.STYLE_FILLCOLOR,
    //             this.fill,
    //         );
    //         this.gradient = ThUtils.getValue(
    //             this.style,
    //             ThConstants.STYLE_GRADIENTCOLOR,
    //             this.gradient,
    //         );
    //         this.gradientDirection = ThUtils.getValue(
    //             this.style,
    //             ThConstants.STYLE_GRADIENT_DIRECTION,
    //             this.gradientDirection,
    //         );
    //         this.opacity = ThUtils.getValue(
    //             this.style,
    //             ThConstants.STYLE_OPACITY,
    //             this.opacity,
    //         );
    //         this.fillOpacity = ThUtils.getValue(
    //             this.style,
    //             ThConstants.STYLE_FILL_OPACITY,
    //             this.fillOpacity,
    //         );
    //         this.strokeOpacity = ThUtils.getValue(
    //             this.style,
    //             ThConstants.STYLE_STROKE_OPACITY,
    //             this.strokeOpacity,
    //         );
    //         this.stroke = ThUtils.getValue(
    //             this.style,
    //             ThConstants.STYLE_STROKECOLOR,
    //             this.stroke,
    //         );
    //         this.strokewidth = ThUtils.getNumber(
    //             this.style,
    //             ThConstants.STYLE_STROKEWIDTH,
    //             this.strokewidth,
    //         );
    //         this.spacing = ThUtils.getValue(
    //             this.style,
    //             ThConstants.STYLE_SPACING,
    //             this.spacing,
    //         );
    //         this.startSize = ThUtils.getNumber(
    //             this.style,
    //             ThConstants.STYLE_STARTSIZE,
    //             this.startSize,
    //         );
    //         this.endSize = ThUtils.getNumber(
    //             this.style,
    //             ThConstants.STYLE_ENDSIZE,
    //             this.endSize,
    //         );
    //         this.startArrow = ThUtils.getValue(
    //             this.style,
    //             ThConstants.STYLE_STARTARROW,
    //             this.startArrow,
    //         );
    //         this.endArrow = ThUtils.getValue(
    //             this.style,
    //             ThConstants.STYLE_ENDARROW,
    //             this.endArrow,
    //         );
    //         this.rotation = ThUtils.getValue(
    //             this.style,
    //             ThConstants.STYLE_ROTATION,
    //             this.rotation,
    //         );
    //         this.direction = ThUtils.getValue(
    //             this.style,
    //             ThConstants.STYLE_DIRECTION,
    //             this.direction,
    //         );
    //         this.flipH =
    //             ThUtils.getValue(this.style, ThConstants.STYLE_FLIPH, 0) == 1;
    //         this.flipV =
    //             ThUtils.getValue(this.style, ThConstants.STYLE_FLIPV, 0) == 1;

    //         // Legacy support for stencilFlipH/V
    //         if (this.stencil != null) {
    //             this.flipH =
    //                 ThUtils.getValue(this.style, 'stencilFlipH', 0) == 1 || this.flipH;
    //             this.flipV =
    //                 ThUtils.getValue(this.style, 'stencilFlipV', 0) == 1 || this.flipV;
    //         }

    //         if (
    //             this.direction == ThConstants.DIRECTION_NORTH ||
    //             this.direction == ThConstants.DIRECTION_SOUTH
    //         ) {
    //             let tmp = this.flipH;
    //             this.flipH = this.flipV;
    //             this.flipV = tmp;
    //         }

    //         this.isShadow =
    //             ThUtils.getValue(this.style, ThConstants.STYLE_SHADOW, this.isShadow) ==
    //             1;
    //         this.isDashed =
    //             ThUtils.getValue(this.style, ThConstants.STYLE_DASHED, this.isDashed) ==
    //             1;
    //         this.isRounded =
    //             ThUtils.getValue(
    //                 this.style,
    //                 ThConstants.STYLE_ROUNDED,
    //                 this.isRounded,
    //             ) == 1;
    //         this.glass =
    //             ThUtils.getValue(this.style, ThConstants.STYLE_GLASS, this.glass) == 1;

    //         if (this.fill == ThConstants.NONE) {
    //             this.fill = null;
    //         }

    //         if (this.gradient == ThConstants.NONE) {
    //             this.gradient = null;
    //         }

    //         if (this.stroke == ThConstants.NONE) {
    //             this.stroke = null;
    //         }
    //     }
    // }

    // /**
    //  * Function: setCursor
    //  *
    //  * Sets the cursor on the given shape.
    //  *
    //  * Parameters:
    //  *
    //  * cursor - The cursor to be used.
    //  */
    // setCursor(cursor) {
    //     if (cursor == null) {
    //         cursor = '';
    //     }

    //     this.cursor = cursor;

    //     if (this.node != null) {
    //         this.node.style.cursor = cursor;
    //     }
    // }

    // /**
    //  * Function: getCursor
    //  *
    //  * Returns the current cursor.
    //  */
    // getCursor() {
    //     return this.cursor;
    // }

    // /**
    //  * Function: isRoundable
    //  *
    //  * Hook for subclassers.
    //  */
    // isRoundable() {
    //     return false;
    // }

    // /**
    //  * Function: updateBoundingBox
    //  *
    //  * Updates the <boundingBox> for this shape using <createBoundingBox> and
    //  * <augmentBoundingBox> and stores the result in <boundingBox>.
    //  */
    // updateBoundingBox() {
    //     // Tries to get bounding box from SVG subsystem
    //     // LATER: Use getBoundingClientRect for fallback in VML
    //     if (
    //         this.useSvgBoundingBox &&
    //         this.node != null &&
    //         this.node.ownerSVGElement != null
    //     ) {
    //         try {
    //             let b = this.node.getBBox();

    //             if (b.width > 0 && b.height > 0) {
    //                 this.boundingBox = new mxRectangle(b.x, b.y, b.width, b.height);

    //                 // Adds strokeWidth
    //                 this.boundingBox.grow((this.strokewidth * this.scale) / 2);

    //                 return;
    //             }
    //         } catch (e) {
    //             // fallback to code below
    //         }
    //     }

    //     if (this.bounds != null) {
    //         let bbox = this.createBoundingBox();

    //         if (bbox != null) {
    //             this.augmentBoundingBox(bbox);
    //             let rot = this.getShapeRotation();

    //             if (rot != 0) {
    //                 bbox = ThUtils.getBoundingBox(bbox, rot);
    //             }
    //         }

    //         this.boundingBox = bbox;
    //     }
    // }

    // /**
    //  * Function: createBoundingBox
    //  *
    //  * Returns a new rectangle that represents the bounding box of the bare shape
    //  * with no shadows or strokewidths.
    //  */
    // createBoundingBox() {
    //     let bb = this.bounds.clone();

    //     if (
    //         (this.stencil != null &&
    //             (this.direction == ThConstants.DIRECTION_NORTH ||
    //                 this.direction == ThConstants.DIRECTION_SOUTH)) ||
    //         this.isPaintBoundsInverted()
    //     ) {
    //         bb.rotate90();
    //     }

    //     return bb;
    // }

    // /**
    //  * Function: augmentBoundingBox
    //  *
    //  * Augments the bounding box with the strokewidth and shadow offsets.
    //  */
    // augmentBoundingBox(bbox) {
    //     if (this.isShadow) {
    //         bbox.width += Math.ceil(ThConstants.SHADOW_OFFSET_X * this.scale);
    //         bbox.height += Math.ceil(ThConstants.SHADOW_OFFSET_Y * this.scale);
    //     }

    //     // Adds strokeWidth
    //     bbox.grow((this.strokewidth * this.scale) / 2);
    // }

    // /**
    //  * Function: isPaintBoundsInverted
    //  *
    //  * Returns true if the bounds should be inverted.
    //  */
    // isPaintBoundsInverted() {
    //     // Stencil implements inversion via aspect
    //     return (
    //         this.stencil == null &&
    //         (this.direction == ThConstants.DIRECTION_NORTH ||
    //             this.direction == ThConstants.DIRECTION_SOUTH)
    //     );
    // }

    // /**
    //  * Function: getRotation
    //  *
    //  * Returns the rotation from the style.
    //  */
    // getRotation() {
    //     return this.rotation != null ? this.rotation : 0;
    // }

    // /**
    //  * Function: getTextRotation
    //  *
    //  * Returns the rotation for the text label.
    //  */
    // getTextRotation() {
    //     let rot = this.getRotation();

    //     if (ThUtils.getValue(this.style, ThConstants.STYLE_HORIZONTAL, 1) != 1) {
    //         rot += this.verticalTextRotation;
    //     }

    //     return rot;
    // }

    // /**
    //  * Function: getShapeRotation
    //  *
    //  * Returns the actual rotation of the shape.
    //  */
    // getShapeRotation() {
    //     let rot = this.getRotation();

    //     if (this.direction != null) {
    //         if (this.direction == ThConstants.DIRECTION_NORTH) {
    //             rot += 270;
    //         } else if (this.direction == ThConstants.DIRECTION_WEST) {
    //             rot += 180;
    //         } else if (this.direction == ThConstants.DIRECTION_SOUTH) {
    //             rot += 90;
    //         }
    //     }

    //     return rot;
    // }

    // /**
    //  * Function: createTransparentSvgRectangle
    //  *
    //  * Adds a transparent rectangle that catches all events.
    //  */
    // createTransparentSvgRectangle(x, y, w, h) {
    //     let rect = document.createElementNS(ThConstants.NS_SVG, 'rect');
    //     rect.setAttribute('x', x);
    //     rect.setAttribute('y', y);
    //     rect.setAttribute('width', w);
    //     rect.setAttribute('height', h);
    //     rect.setAttribute('fill', 'none');
    //     rect.setAttribute('stroke', 'none');
    //     rect.setAttribute('pointer-events', 'all');

    //     return rect;
    // }

    // /**
    //  * Function: setTransparentBackgroundImage
    //  *
    //  * Sets a transparent background CSS style to catch all events.
    //  *
    //  * Paints the line shape.
    //  */
    // setTransparentBackgroundImage(node) {
    //     node.style.backgroundImage =
    //         "url('" + mxClient.imageBasePath + "/transparent.gif')";
    // }

    // /**
    //  * Function: releaseSvgGradients
    //  *
    //  * Paints the line shape.
    //  */
    // releaseSvgGradients(grads) {
    //     if (grads != null) {
    //         for (let key in grads) {
    //             let gradient = grads[key];

    //             if (gradient != null) {
    //                 gradient.mxRefCount = (gradient.mxRefCount || 0) - 1;

    //                 if (gradient.mxRefCount == 0 && gradient.parentNode != null) {
    //                     gradient.parentNode.removeChild(gradient);
    //                 }
    //             }
    //         }
    //     }
    // }

    // /**
    //  * Function: destroy
    //  *
    //  * Destroys the shape by removing it from the DOM and releasing the DOM
    //  * node associated with the shape using <mxEvent.release>.
    //  */
    // destroy() {
    //     if (this.node != null) {
    //         mxEvent.release(this.node);

    //         if (this.node.parentNode != null) {
    //             this.node.parentNode.removeChild(this.node);
    //         }

    //         this.node = null;
    //     }

    //     // Decrements refCount and removes unused
    //     this.releaseSvgGradients(this.oldGradients);
    //     this.oldGradients = null;
    // }
}

