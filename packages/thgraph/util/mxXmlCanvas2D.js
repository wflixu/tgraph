
/**
 * Class: mxXmlCanvas2D
 *
 * Base class for all canvases. The following methods make up the public
 * interface of the canvas 2D for all painting in mxGraph:
 * 
 * - <save>, <restore>
 * - <scale>, <translate>, <rotate>
 * - <setAlpha>, <setFillAlpha>, <setStrokeAlpha>, <setFillColor>, <setGradient>,
 *   <setStrokeColor>, <setStrokeWidth>, <setDashed>, <setDashPattern>, <setLineCap>, 
 *   <setLineJoin>, <setMiterLimit>
 * - <setFontColor>, <setFontBackgroundColor>, <setFontBorderColor>, <setFontSize>,
 *   <setFontFamily>, <setFontStyle>
 * - <setShadow>, <setShadowColor>, <setShadowAlpha>, <setShadowOffset>
 * - <rect>, <roundrect>, <ellipse>, <image>, <text>
 * - <begin>, <moveTo>, <lineTo>, <quadTo>, <curveTo>
 * - <stroke>, <fill>, <fillAndStroke>
 * 
 * <mxAbstractCanvas2D.arcTo> is an additional method for drawing paths. This is
 * a synthetic method, meaning that it is turned into a sequence of curves by
 * default. Subclassers may add native support for arcs.
 * 
 * Constructor: mxXmlCanvas2D
 *
 * Constructs a new abstract canvas.
 */



import { mxUtils } from "./mxUtils.js";
import { mxAbstractCanvas2D } from "./mxAbstractCanvas2D.js";

export class mxXmlCanvas2D extends mxAbstractCanvas2D {


    /**
     * Variable: textEnabled
     * 
     * Specifies if text output should be enabled. Default is true.
     */
    textEnabled = true;

    /**
     * Variable: compressed
     * 
     * Specifies if the output should be compressed by removing redundant calls.
     * Default is true.
     */
    compressed = true;



    constructor(root) {
        super()

        /**
         * Variable: root
         * 
         * Reference to the container for the SVG content.
         */
        this.root = root;

        // Writes default settings;
        this.writeDefaults();
    }


    /**
     * Function: writeDefaults
     * 
     * Writes the rendering defaults to <root>:
     */
    writeDefaults() {
        var elem;

        // Writes font defaults
        elem = this.createElement('fontfamily');
        elem.setAttribute('family', mxConstants.DEFAULT_FONTFAMILY);
        this.root.appendChild(elem);

        elem = this.createElement('fontsize');
        elem.setAttribute('size', mxConstants.DEFAULT_FONTSIZE);
        this.root.appendChild(elem);

        // Writes shadow defaults
        elem = this.createElement('shadowcolor');
        elem.setAttribute('color', mxConstants.SHADOWCOLOR);
        this.root.appendChild(elem);

        elem = this.createElement('shadowalpha');
        elem.setAttribute('alpha', mxConstants.SHADOW_OPACITY);
        this.root.appendChild(elem);

        elem = this.createElement('shadowoffset');
        elem.setAttribute('dx', mxConstants.SHADOW_OFFSET_X);
        elem.setAttribute('dy', mxConstants.SHADOW_OFFSET_Y);
        this.root.appendChild(elem);
    };

    /**
     * Function: format
     * 
     * Returns a formatted number with 2 decimal places.
     */
    format(value) {
        return parseFloat(parseFloat(value).toFixed(2));
    };

    /**
     * Function: createElement
     * 
     * Creates the given element using the owner document of <root>.
     */
    createElement(name) {
        return this.root.ownerDocument.createElement(name);
    };

    /**
     * Function: save
     * 
     * Saves the drawing state.
     */
    save() {
        if (this.compressed) {
            super.save();
        }

        this.root.appendChild(this.createElement('save'));
    };

    /**
     * Function: restore
     * 
     * Restores the drawing state.
     */
    restore() {
        if (this.compressed) {
            super.restore();
        }

        this.root.appendChild(this.createElement('restore'));
    };

    /**
     * Function: scale
     * 
     * Scales the output.
     * 
     * Parameters:
     * 
     * scale - Number that represents the scale where 1 is equal to 100%.
     */
    scale(value) {
        var elem = this.createElement('scale');
        elem.setAttribute('scale', value);
        this.root.appendChild(elem);
    };

    /**
     * Function: translate
     * 
     * Translates the output.
     * 
     * Parameters:
     * 
     * dx - Number that specifies the horizontal translation.
     * dy - Number that specifies the vertical translation.
     */
    translate(dx, dy) {
        var elem = this.createElement('translate');
        elem.setAttribute('dx', this.format(dx));
        elem.setAttribute('dy', this.format(dy));
        this.root.appendChild(elem);
    };

    /**
     * Function: rotate
     * 
     * Rotates and/or flips the output around a given center. (Note: Due to
     * limitations in VML, the rotation cannot be concatenated.)
     * 
     * Parameters:
     * 
     * theta - Number that represents the angle of the rotation (in degrees).
     * flipH - Boolean indicating if the output should be flipped horizontally.
     * flipV - Boolean indicating if the output should be flipped vertically.
     * cx - Number that represents the x-coordinate of the rotation center.
     * cy - Number that represents the y-coordinate of the rotation center.
     */
    rotate(theta, flipH, flipV, cx, cy) {
        var elem = this.createElement('rotate');

        if (theta != 0 || flipH || flipV) {
            elem.setAttribute('theta', this.format(theta));
            elem.setAttribute('flipH', (flipH) ? '1' : '0');
            elem.setAttribute('flipV', (flipV) ? '1' : '0');
            elem.setAttribute('cx', this.format(cx));
            elem.setAttribute('cy', this.format(cy));
            this.root.appendChild(elem);
        }
    };

    /**
     * Function: setAlpha
     * 
     * Sets the current alpha.
     * 
     * Parameters:
     * 
     * value - Number that represents the new alpha. Possible values are between
     * 1 (opaque) and 0 (transparent).
     */
    setAlpha(value) {
        if (this.compressed) {
            if (this.state.alpha == value) {
                return;
            }

            super.setAlpha(value)
        }

        var elem = this.createElement('alpha');
        elem.setAttribute('alpha', this.format(value));
        this.root.appendChild(elem);
    };

    /**
     * Function: setFillAlpha
     * 
     * Sets the current fill alpha.
     * 
     * Parameters:
     * 
     * value - Number that represents the new fill alpha. Possible values are between
     * 1 (opaque) and 0 (transparent).
     */
    setFillAlpha(value) {
        if (this.compressed) {
            if (this.state.fillAlpha == value) {
                return;
            }

            super.setFillAlpha(value)
        }

        var elem = this.createElement('fillalpha');
        elem.setAttribute('alpha', this.format(value));
        this.root.appendChild(elem);
    };

    /**
     * Function: setStrokeAlpha
     * 
     * Sets the current stroke alpha.
     * 
     * Parameters:
     * 
     * value - Number that represents the new stroke alpha. Possible values are between
     * 1 (opaque) and 0 (transparent).
     */
    setStrokeAlpha(value) {
        if (this.compressed) {
            if (this.state.strokeAlpha == value) {
                return;
            }

            super.setStrokeAlpha(value)
        }

        var elem = this.createElement('strokealpha');
        elem.setAttribute('alpha', this.format(value));
        this.root.appendChild(elem);
    };

    /**
     * Function: setFillColor
     * 
     * Sets the current fill color.
     * 
     * Parameters:
     * 
     * value - Hexadecimal representation of the color or 'none'.
     */
    setFillColor(value) {
        if (value == mxConstants.NONE) {
            value = null;
        }

        if (this.compressed) {
            if (this.state.fillColor == value) {
                return;
            }

            mxAbstractCanvas2D.setFillColor.apply(this, arguments);
        }

        var elem = this.createElement('fillcolor');
        elem.setAttribute('color', (value != null) ? value : mxConstants.NONE);
        this.root.appendChild(elem);
    };

    /**
     * Function: setGradient
     * 
     * Sets the gradient. Note that the coordinates may be ignored by some implementations.
     * 
     * Parameters:
     * 
     * color1 - Hexadecimal representation of the start color.
     * color2 - Hexadecimal representation of the end color.
     * x - X-coordinate of the gradient region.
     * y - y-coordinate of the gradient region.
     * w - Width of the gradient region.
     * h - Height of the gradient region.
     * direction - One of <mxConstants.DIRECTION_NORTH>, <mxConstants.DIRECTION_EAST>,
     * <mxConstants.DIRECTION_SOUTH> or <mxConstants.DIRECTION_WEST>.
     * alpha1 - Optional alpha of the start color. Default is 1. Possible values
     * are between 1 (opaque) and 0 (transparent).
     * alpha2 - Optional alpha of the end color. Default is 1. Possible values
     * are between 1 (opaque) and 0 (transparent).
     */
    setGradient(color1, color2, x, y, w, h, direction, alpha1, alpha2) {
        if (color1 != null && color2 != null) {

            super.setGradient(color1, color2, x, y, w, h, direction, alpha1, alpha2)
            var elem = this.createElement('gradient');
            elem.setAttribute('c1', color1);
            elem.setAttribute('c2', color2);
            elem.setAttribute('x', this.format(x));
            elem.setAttribute('y', this.format(y));
            elem.setAttribute('w', this.format(w));
            elem.setAttribute('h', this.format(h));

            // Default direction is south
            if (direction != null) {
                elem.setAttribute('direction', direction);
            }

            if (alpha1 != null) {
                elem.setAttribute('alpha1', alpha1);
            }

            if (alpha2 != null) {
                elem.setAttribute('alpha2', alpha2);
            }

            this.root.appendChild(elem);
        }
    };

    /**
     * Function: setStrokeColor
     * 
     * Sets the current stroke color.
     * 
     * Parameters:
     * 
     * value - Hexadecimal representation of the color or 'none'.
     */
    setStrokeColor(value) {
        if (value == mxConstants.NONE) {
            value = null;
        }

        if (this.compressed) {
            if (this.state.strokeColor == value) {
                return;
            }

            super.setStrokeColor(value);
        }

        var elem = this.createElement('strokecolor');
        elem.setAttribute('color', (value != null) ? value : mxConstants.NONE);
        this.root.appendChild(elem);
    };

    /**
     * Function: setStrokeWidth
     * 
     * Sets the current stroke width.
     * 
     * Parameters:
     * 
     * value - Numeric representation of the stroke width.
     */
    setStrokeWidth(value) {
        if (this.compressed) {
            if (this.state.strokeWidth == value) {
                return;
            }

            super.setStrokeWidth(value);
        }

        var elem = this.createElement('strokewidth');
        elem.setAttribute('width', this.format(value));
        this.root.appendChild(elem);
    };

    /**
     * Function: setDashed
     * 
     * Enables or disables dashed lines.
     * 
     * Parameters:
     * 
     * value - Boolean that specifies if dashed lines should be enabled.
     * value - Boolean that specifies if the stroke width should be ignored
     * for the dash pattern. Default is false.
     */
    setDashed(value, fixDash) {
        if (this.compressed) {
            if (this.state.dashed == value) {
                return;
            }
            super.setDashed(value, fixDash);
        }

        var elem = this.createElement('dashed');
        elem.setAttribute('dashed', (value) ? '1' : '0');

        if (fixDash != null) {
            elem.setAttribute('fixDash', (fixDash) ? '1' : '0');
        }

        this.root.appendChild(elem);
    };

    /**
     * Function: setDashPattern
     * 
     * Sets the current dash pattern. Default is '3 3'.
     * 
     * Parameters:
     * 
     * value - String that represents the dash pattern, which is a sequence of
     * numbers defining the length of the dashes and the length of the spaces
     * between the dashes. The lengths are relative to the line width - a length
     * of 1 is equals to the line width.
     */
    setDashPattern(value) {
        if (this.compressed) {
            if (this.state.dashPattern == value) {
                return;
            }
            super.setDashPattern(value);
        }

        var elem = this.createElement('dashpattern');
        elem.setAttribute('pattern', value);
        this.root.appendChild(elem);
    };

    /**
     * Function: setLineCap
     * 
     * Sets the line cap. Default is 'flat' which corresponds to 'butt' in SVG.
     * 
     * Parameters:
     * 
     * value - String that represents the line cap. Possible values are flat, round
     * and square.
     */
    setLineCap(value) {
        if (this.compressed) {
            if (this.state.lineCap == value) {
                return;
            }

            super.setLineCap(value);
        }

        var elem = this.createElement('linecap');
        elem.setAttribute('cap', value);
        this.root.appendChild(elem);
    };

    /**
     * Function: setLineJoin
     * 
     * Sets the line join. Default is 'miter'.
     * 
     * Parameters:
     * 
     * value - String that represents the line join. Possible values are miter,
     * round and bevel.
     */
    setLineJoin(value) {
        if (this.compressed) {
            if (this.state.lineJoin == value) {
                return;
            }

            super.setLineJoin(value);
        }

        var elem = this.createElement('linejoin');
        elem.setAttribute('join', value);
        this.root.appendChild(elem);
    };

    /**
     * Function: setMiterLimit
     * 
     * Sets the miter limit. Default is 10.
     * 
     * Parameters:
     * 
     * value - Number that represents the miter limit.
     */
    setMiterLimit(value) {
        if (this.compressed) {
            if (this.state.miterLimit == value) {
                return;
            }

            mxAbstractCanvas2D.setMiterLimit.apply(this, arguments);
        }

        var elem = this.createElement('miterlimit');
        elem.setAttribute('limit', value);
        this.root.appendChild(elem);
    };

    /**
     * Function: setFontColor
     * 
     * Sets the current font color. Default is '#000000'.
     * 
     * Parameters:
     * 
     * value - Hexadecimal representation of the color or 'none'.
     */
    setFontColor(value) {
        if (this.textEnabled) {
            if (value == mxConstants.NONE) {
                value = null;
            }

            if (this.compressed) {
                if (this.state.fontColor == value) {
                    return;
                }

                super.setFontColor(value);
            }

            var elem = this.createElement('fontcolor');
            elem.setAttribute('color', (value != null) ? value : mxConstants.NONE);
            this.root.appendChild(elem);
        }
    };

    /**
     * Function: setFontBackgroundColor
     * 
     * Sets the current font background color.
     * 
     * Parameters:
     * 
     * value - Hexadecimal representation of the color or 'none'.
     */
    setFontBackgroundColor(value) {
        if (this.textEnabled) {
            if (value == mxConstants.NONE) {
                value = null;
            }

            if (this.compressed) {
                if (this.state.fontBackgroundColor == value) {
                    return;
                }
                super.setFontBackgroundColor(value);
            }

            var elem = this.createElement('fontbackgroundcolor');
            elem.setAttribute('color', (value != null) ? value : mxConstants.NONE);
            this.root.appendChild(elem);
        }
    };

    /**
     * Function: setFontBorderColor
     * 
     * Sets the current font border color.
     * 
     * Parameters:
     * 
     * value - Hexadecimal representation of the color or 'none'.
     */
    setFontBorderColor(value) {
        if (this.textEnabled) {
            if (value == mxConstants.NONE) {
                value = null;
            }

            if (this.compressed) {
                if (this.state.fontBorderColor == value) {
                    return;
                }
                super.setFontBorderColor(value);
            }

            var elem = this.createElement('fontbordercolor');
            elem.setAttribute('color', (value != null) ? value : mxConstants.NONE);
            this.root.appendChild(elem);
        }
    };

    /**
     * Function: setFontSize
     * 
     * Sets the current font size. Default is <mxConstants.DEFAULT_FONTSIZE>.
     * 
     * Parameters:
     * 
     * value - Numeric representation of the font size.
     */
    setFontSize(value) {
        if (this.textEnabled) {
            if (this.compressed) {
                if (this.state.fontSize == value) {
                    return;
                }
                super.setFontSize(value);
            }

            var elem = this.createElement('fontsize');
            elem.setAttribute('size', value);
            this.root.appendChild(elem);
        }
    };

    /**
     * Function: setFontFamily
     * 
     * Sets the current font family. Default is <mxConstants.DEFAULT_FONTFAMILY>.
     * 
     * Parameters:
     * 
     * value - String representation of the font family. This handles the same
     * values as the CSS font-family property.
     */
    setFontFamily(value) {
        if (this.textEnabled) {
            if (this.compressed) {
                if (this.state.fontFamily == value) {
                    return;
                }

                super.setFontFamily(value);
            }

            var elem = this.createElement('fontfamily');
            elem.setAttribute('family', value);
            this.root.appendChild(elem);
        }
    };

    /**
     * Function: setFontStyle
     * 
     * Sets the current font style.
     * 
     * Parameters:
     * 
     * value - Numeric representation of the font family. This is the sum of the
     * font styles from <mxConstants>.
     */
    setFontStyle(value) {
        if (this.textEnabled) {
            if (value == null) {
                value = 0;
            }

            if (this.compressed) {
                if (this.state.fontStyle == value) {
                    return;
                }
                super.setFontStyle(value);
            }

            var elem = this.createElement('fontstyle');
            elem.setAttribute('style', value);
            this.root.appendChild(elem);
        }
    };

    /**
     * Function: setShadow
     * 
     * Enables or disables shadows.
     * 
     * Parameters:
     * 
     * value - Boolean that specifies if shadows should be enabled.
     */
    setShadow(value) {
        if (this.compressed) {
            if (this.state.shadow == value) {
                return;
            }

            super.setShadow(value);
        }

        var elem = this.createElement('shadow');
        elem.setAttribute('enabled', (value) ? '1' : '0');
        this.root.appendChild(elem);
    };

    /**
     * Function: setShadowColor
     * 
     * Sets the current shadow color. Default is <mxConstants.SHADOWCOLOR>.
     * 
     * Parameters:
     * 
     * value - Hexadecimal representation of the color or 'none'.
     */
    setShadowColor(value) {
        if (this.compressed) {
            if (value == mxConstants.NONE) {
                value = null;
            }

            if (this.state.shadowColor == value) {
                return;
            }

            super.setShadowColor(value);
        }

        var elem = this.createElement('shadowcolor');
        elem.setAttribute('color', (value != null) ? value : mxConstants.NONE);
        this.root.appendChild(elem);
    };

    /**
     * Function: setShadowAlpha
     * 
     * Sets the current shadows alpha. Default is <mxConstants.SHADOW_OPACITY>.
     * 
     * Parameters:
     * 
     * value - Number that represents the new alpha. Possible values are between
     * 1 (opaque) and 0 (transparent).
     */
    setShadowAlpha(value) {
        if (this.compressed) {
            if (this.state.shadowAlpha == value) {
                return;
            }

            super.setShadowAlpha(value);
        }

        var elem = this.createElement('shadowalpha');
        elem.setAttribute('alpha', value);
        this.root.appendChild(elem);

    };

    /**
     * Function: setShadowOffset
     * 
     * Sets the current shadow offset.
     * 
     * Parameters:
     * 
     * dx - Number that represents the horizontal offset of the shadow.
     * dy - Number that represents the vertical offset of the shadow.
     */
    setShadowOffset(dx, dy) {
        if (this.compressed) {
            if (this.state.shadowDx == dx && this.state.shadowDy == dy) {
                return;
            }
            super.setShadowOffset(dx, dy);
        }

        var elem = this.createElement('shadowoffset');
        elem.setAttribute('dx', dx);
        elem.setAttribute('dy', dy);
        this.root.appendChild(elem);

    };

    /**
     * Function: rect
     * 
     * Puts a rectangle into the drawing buffer.
     * 
     * Parameters:
     * 
     * x - Number that represents the x-coordinate of the rectangle.
     * y - Number that represents the y-coordinate of the rectangle.
     * w - Number that represents the width of the rectangle.
     * h - Number that represents the height of the rectangle.
     */
    rect(x, y, w, h) {
        var elem = this.createElement('rect');
        elem.setAttribute('x', this.format(x));
        elem.setAttribute('y', this.format(y));
        elem.setAttribute('w', this.format(w));
        elem.setAttribute('h', this.format(h));
        this.root.appendChild(elem);
    };

    /**
     * Function: roundrect
     * 
     * Puts a rounded rectangle into the drawing buffer.
     * 
     * Parameters:
     * 
     * x - Number that represents the x-coordinate of the rectangle.
     * y - Number that represents the y-coordinate of the rectangle.
     * w - Number that represents the width of the rectangle.
     * h - Number that represents the height of the rectangle.
     * dx - Number that represents the horizontal rounding.
     * dy - Number that represents the vertical rounding.
     */
    roundrect(x, y, w, h, dx, dy) {
        var elem = this.createElement('roundrect');
        elem.setAttribute('x', this.format(x));
        elem.setAttribute('y', this.format(y));
        elem.setAttribute('w', this.format(w));
        elem.setAttribute('h', this.format(h));
        elem.setAttribute('dx', this.format(dx));
        elem.setAttribute('dy', this.format(dy));
        this.root.appendChild(elem);
    };

    /**
     * Function: ellipse
     * 
     * Puts an ellipse into the drawing buffer.
     * 
     * Parameters:
     * 
     * x - Number that represents the x-coordinate of the ellipse.
     * y - Number that represents the y-coordinate of the ellipse.
     * w - Number that represents the width of the ellipse.
     * h - Number that represents the height of the ellipse.
     */
    ellipse(x, y, w, h) {
        var elem = this.createElement('ellipse');
        elem.setAttribute('x', this.format(x));
        elem.setAttribute('y', this.format(y));
        elem.setAttribute('w', this.format(w));
        elem.setAttribute('h', this.format(h));
        this.root.appendChild(elem);
    };

    /**
     * Function: image
     * 
     * Paints an image.
     * 
     * Parameters:
     * 
     * x - Number that represents the x-coordinate of the image.
     * y - Number that represents the y-coordinate of the image.
     * w - Number that represents the width of the image.
     * h - Number that represents the height of the image.
     * src - String that specifies the URL of the image.
     * aspect - Boolean indicating if the aspect of the image should be preserved.
     * flipH - Boolean indicating if the image should be flipped horizontally.
     * flipV - Boolean indicating if the image should be flipped vertically.
     */
    image(x, y, w, h, src, aspect, flipH, flipV) {
        src = this.converter.convert(src);

        // LATER: Add option for embedding images as base64.
        var elem = this.createElement('image');
        elem.setAttribute('x', this.format(x));
        elem.setAttribute('y', this.format(y));
        elem.setAttribute('w', this.format(w));
        elem.setAttribute('h', this.format(h));
        elem.setAttribute('src', src);
        elem.setAttribute('aspect', (aspect) ? '1' : '0');
        elem.setAttribute('flipH', (flipH) ? '1' : '0');
        elem.setAttribute('flipV', (flipV) ? '1' : '0');
        this.root.appendChild(elem);
    };

    /**
     * Function: begin
     * 
     * Starts a new path and puts it into the drawing buffer.
     */
    begin() {
        this.root.appendChild(this.createElement('begin'));
        this.lastX = 0;
        this.lastY = 0;
    };

    /**
     * Function: moveTo
     * 
     * Moves the current path the given point.
     * 
     * Parameters:
     * 
     * x - Number that represents the x-coordinate of the point.
     * y - Number that represents the y-coordinate of the point.
     */
    moveTo(x, y) {
        var elem = this.createElement('move');
        elem.setAttribute('x', this.format(x));
        elem.setAttribute('y', this.format(y));
        this.root.appendChild(elem);
        this.lastX = x;
        this.lastY = y;
    };

    /**
     * Function: lineTo
     * 
     * Draws a line to the given coordinates.
     * 
     * Parameters:
     * 
     * x - Number that represents the x-coordinate of the endpoint.
     * y - Number that represents the y-coordinate of the endpoint.
     */
    lineTo(x, y) {
        var elem = this.createElement('line');
        elem.setAttribute('x', this.format(x));
        elem.setAttribute('y', this.format(y));
        this.root.appendChild(elem);
        this.lastX = x;
        this.lastY = y;
    };

    /**
     * Function: quadTo
     * 
     * Adds a quadratic curve to the current path.
     * 
     * Parameters:
     * 
     * x1 - Number that represents the x-coordinate of the control point.
     * y1 - Number that represents the y-coordinate of the control point.
     * x2 - Number that represents the x-coordinate of the endpoint.
     * y2 - Number that represents the y-coordinate of the endpoint.
     */
    quadTo(x1, y1, x2, y2) {
        var elem = this.createElement('quad');
        elem.setAttribute('x1', this.format(x1));
        elem.setAttribute('y1', this.format(y1));
        elem.setAttribute('x2', this.format(x2));
        elem.setAttribute('y2', this.format(y2));
        this.root.appendChild(elem);
        this.lastX = x2;
        this.lastY = y2;
    };

    /**
     * Function: curveTo
     * 
     * Adds a bezier curve to the current path.
     * 
     * Parameters:
     * 
     * x1 - Number that represents the x-coordinate of the first control point.
     * y1 - Number that represents the y-coordinate of the first control point.
     * x2 - Number that represents the x-coordinate of the second control point.
     * y2 - Number that represents the y-coordinate of the second control point.
     * x3 - Number that represents the x-coordinate of the endpoint.
     * y3 - Number that represents the y-coordinate of the endpoint.
     */
    curveTo(x1, y1, x2, y2, x3, y3) {
        var elem = this.createElement('curve');
        elem.setAttribute('x1', this.format(x1));
        elem.setAttribute('y1', this.format(y1));
        elem.setAttribute('x2', this.format(x2));
        elem.setAttribute('y2', this.format(y2));
        elem.setAttribute('x3', this.format(x3));
        elem.setAttribute('y3', this.format(y3));
        this.root.appendChild(elem);
        this.lastX = x3;
        this.lastY = y3;
    };

    /**
     * Function: close
     * 
     * Closes the current path.
     */
    close() {
        this.root.appendChild(this.createElement('close'));
    };

    /**
     * Function: text
     * 
     * Paints the given text. Possible values for format are empty string for
     * plain text and html for HTML markup. Background and border color as well
     * as clipping is not available in plain text labels for VML. HTML labels
     * are not available as part of shapes with no foreignObject support in SVG
     * (eg. IE9, IE10).
     * 
     * Parameters:
     * 
     * x - Number that represents the x-coordinate of the text.
     * y - Number that represents the y-coordinate of the text.
     * w - Number that represents the available width for the text or 0 for automatic width.
     * h - Number that represents the available height for the text or 0 for automatic height.
     * str - String that specifies the text to be painted.
     * align - String that represents the horizontal alignment.
     * valign - String that represents the vertical alignment.
     * wrap - Boolean that specifies if word-wrapping is enabled. Requires w > 0.
     * format - Empty string for plain text or 'html' for HTML markup.
     * overflow - Specifies the overflow behaviour of the label. Requires w > 0 and/or h > 0.
     * clip - Boolean that specifies if the label should be clipped. Requires w > 0 and/or h > 0.
     * rotation - Number that specifies the angle of the rotation around the anchor point of the text.
     * dir - Optional string that specifies the text direction. Possible values are rtl and lrt.
     */
    text(x, y, w, h, str, align, valign, wrap, format, overflow, clip, rotation, dir) {
        if (this.textEnabled && str != null) {
            if (mxUtils.isNode(str)) {
                str = mxUtils.getOuterHtml(str);
            }

            var elem = this.createElement('text');
            elem.setAttribute('x', this.format(x));
            elem.setAttribute('y', this.format(y));
            elem.setAttribute('w', this.format(w));
            elem.setAttribute('h', this.format(h));
            elem.setAttribute('str', str);

            if (align != null) {
                elem.setAttribute('align', align);
            }

            if (valign != null) {
                elem.setAttribute('valign', valign);
            }

            elem.setAttribute('wrap', (wrap) ? '1' : '0');

            if (format == null) {
                format = '';
            }

            elem.setAttribute('format', format);

            if (overflow != null) {
                elem.setAttribute('overflow', overflow);
            }

            if (clip != null) {
                elem.setAttribute('clip', (clip) ? '1' : '0');
            }

            if (rotation != null) {
                elem.setAttribute('rotation', rotation);
            }

            if (dir != null) {
                elem.setAttribute('dir', dir);
            }

            this.root.appendChild(elem);
        }
    };

    /**
     * Function: stroke
     * 
     * Paints the outline of the current drawing buffer.
     */
    stroke() {
        this.root.appendChild(this.createElement('stroke'));
    };

    /**
     * Function: fill
     * 
     * Fills the current drawing buffer.
     */
    fill() {
        this.root.appendChild(this.createElement('fill'));
    };

    /**
     * Function: fillAndStroke
     * 
     * Fills the current drawing buffer and its outline.
     */
    fillAndStroke() {
        this.root.appendChild(this.createElement('fillstroke'));
    };


};


console.log('graph/util/mxXmlCanvas2D.js');