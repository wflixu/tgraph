import { ThConstants } from "../util/ThConstants";
import { ThUtils } from "../util/ThUtils";
import { ThPerimeter } from "./ThPerimeter";

export class ThStylesheet {
    /**
     * Function: styles
     *
     * Maps from names to cell styles. Each cell style is a map of key,
     * value pairs.
     */
    styles: Record<string, Record<string,any>> = {};

    constructor() {


        this.putDefaultVertexStyle(this.createDefaultVertexStyle());
        this.putDefaultEdgeStyle(this.createDefaultEdgeStyle());
    }


    /**
     * Function: createDefaultVertexStyle
     *
     * Creates and returns the default vertex style.
     */
    createDefaultVertexStyle() {
        let style : Record<string,any> = {};

        style[ThConstants.STYLE_SHAPE] = ThConstants.SHAPE_RECTANGLE;
        style[ThConstants.STYLE_PERIMETER] = ThPerimeter.RectanglePerimeter;
        style[ThConstants.STYLE_VERTICAL_ALIGN] = ThConstants.ALIGN_MIDDLE;
        style[ThConstants.STYLE_ALIGN] = ThConstants.ALIGN_CENTER;
        style[ThConstants.STYLE_FILLCOLOR] = '#C3D9FF';
        style[ThConstants.STYLE_STROKECOLOR] = '#6482B9';
        style[ThConstants.STYLE_FONTCOLOR] = '#774400';

        return style;
    }

    /**
     * Function: createDefaultEdgeStyle
     *
     * Creates and returns the default edge style.
     */
    createDefaultEdgeStyle() {
        let style : Record<string,string> = {};

        style[ThConstants.STYLE_SHAPE] = ThConstants.SHAPE_CONNECTOR;
        style[ThConstants.STYLE_ENDARROW] = ThConstants.ARROW_CLASSIC;
        style[ThConstants.STYLE_VERTICAL_ALIGN] = ThConstants.ALIGN_MIDDLE;
        style[ThConstants.STYLE_ALIGN] = ThConstants.ALIGN_CENTER;
        style[ThConstants.STYLE_STROKECOLOR] = '#6482B9';
        style[ThConstants.STYLE_FONTCOLOR] = '#446299';

        return style;
    }

    /**
     * Function: putDefaultVertexStyle
     *
     * Sets the default style for vertices using defaultVertex as the
     * stylename.
     *
     * Parameters:
     * style - Key, value pairs that define the style.
     */
    putDefaultVertexStyle(style: Record<string,string>) {
        this.putCellStyle('defaultVertex', style);
    }

    /**
     * Function: putDefaultEdgeStyle
     *
     * Sets the default style for edges using defaultEdge as the stylename.
     */
    putDefaultEdgeStyle(style:Record<string,string>) {
        this.putCellStyle('defaultEdge', style);
    }

    /**
     * Function: getDefaultVertexStyle
     *
     * Returns the default style for vertices.
     */
    getDefaultVertexStyle() {
        return this.styles['defaultVertex'];
    }

    /**
     * Function: getDefaultEdgeStyle
     *
     * Sets the default style for edges.
     */
    getDefaultEdgeStyle() {
        return this.styles['defaultEdge'];
    }

    /**
     * Function: putCellStyle
     *
     * Stores the given map of key, value pairs under the given name in
     * <styles>.
     *
     * Example:
     *
     * The following example adds a new style called 'rounded' into an
     * existing stylesheet:
     *
     * (code)
     * var style = new Object();
     * style[ThConstants.STYLE_SHAPE] = ThConstants.SHAPE_RECTANGLE;
     * style[ThConstants.STYLE_PERIMETER] = ThPerimeter.RectanglePerimeter;
     * style[ThConstants.STYLE_ROUNDED] = true;
     * graph.getStylesheet().putCellStyle('rounded', style);
     * (end)
     *
     * In the above example, the new style is an object. The possible keys of
     * the object are all the constants in <ThConstants> that start with STYLE
     * and the values are either JavaScript objects, such as
     * <ThPerimeter.RightAngleRectanglePerimeter> (which is in fact a function)
     * or expressions, such as true. Note that not all keys will be
     * interpreted by all shapes (eg. the line shape ignores the fill color).
     * The final call to this method associates the style with a name in the
     * stylesheet. The style is used in a cell with the following code:
     *
     * (code)
     * model.setStyle(cell, 'rounded');
     * (end)
     *
     * Parameters:
     *
     * name - Name for the style to be stored.
     * style - Key, value pairs that define the style.
     */
    putCellStyle(name:string, style: string) {
        this.styles[name] = style;
    }

    /**
     * Function: getCellStyle
     *
     * Returns the cell style for the specified stylename or the given
     * defaultStyle if no style can be found for the given stylename.
     *
     * Parameters:
     *
     * name - String of the form [(stylename|key=value);] that represents the
     * style.
     * defaultStyle - Default style to be returned if no style can be found.
     */
    getCellStyle(name:string, defaultStyle:Record<string,any>) {
        let style = defaultStyle;

        if (name != null && name.length > 0) {
            var pairs = name.split(';');

            if (style != null && name.charAt(0) != ';') {
                style = ThUtils.clone(style);
            } else {
                style = {};
            }

            // Parses each key, value pair into the existing style
            for (var i = 0; i < pairs.length; i++) {
                var tmp = pairs[i];
                var pos = tmp.indexOf('=');

                if (pos >= 0) {
                    var key = tmp.substring(0, pos);
                    var value = tmp.substring(pos + 1);

                    if (value == ThConstants.NONE) {
                        delete style[key];
                    } else if (ThUtils.isNumeric(value)) {
                        style[key] = parseFloat(value);
                    } else {
                        style[key] = value;
                    }
                } else {
                    // Merges the entries from a named style
                    var tmpStyle = this.styles[tmp];

                    if (tmpStyle != null) {
                        for (var key in tmpStyle) {
                            style[key] = tmpStyle[key];
                        }
                    }
                }
            }
        }

        return style;
    }
}