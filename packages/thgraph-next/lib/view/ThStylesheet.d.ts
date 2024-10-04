export declare class ThStylesheet {
    /**
     * Function: styles
     *
     * Maps from names to cell styles. Each cell style is a map of key,
     * value pairs.
     */
    styles: Record<string, Record<string, any>>;
    constructor();
    /**
     * Function: createDefaultVertexStyle
     *
     * Creates and returns the default vertex style.
     */
    createDefaultVertexStyle(): Record<string, any>;
    /**
     * Function: createDefaultEdgeStyle
     *
     * Creates and returns the default edge style.
     */
    createDefaultEdgeStyle(): Record<string, string>;
    /**
     * Function: putDefaultVertexStyle
     *
     * Sets the default style for vertices using defaultVertex as the
     * stylename.
     *
     * Parameters:
     * style - Key, value pairs that define the style.
     */
    putDefaultVertexStyle(style: Record<string, string>): void;
    /**
     * Function: putDefaultEdgeStyle
     *
     * Sets the default style for edges using defaultEdge as the stylename.
     */
    putDefaultEdgeStyle(style: Record<string, string>): void;
    /**
     * Function: getDefaultVertexStyle
     *
     * Returns the default style for vertices.
     */
    getDefaultVertexStyle(): Record<string, any>;
    /**
     * Function: getDefaultEdgeStyle
     *
     * Sets the default style for edges.
     */
    getDefaultEdgeStyle(): Record<string, any>;
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
    putCellStyle(name: string, style: string): void;
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
    getCellStyle(name: string, defaultStyle: Record<string, any>): Record<string, any>;
}
