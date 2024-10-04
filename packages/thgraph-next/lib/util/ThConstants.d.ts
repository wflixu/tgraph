export declare class ThConstants {
    /**
     * Variable: DIALECT_SVG
     *
     * Defines the SVG display dialect name.
     */
    static DIALECT_SVG: string;
    /**
     * Variable: NS_SVG
     *
     * Defines the SVG namespace.
     */
    static NS_SVG: string;
    /**
    * Variable: STYLE_SHAPE
    *
    * Defines the key for the shape. Possible values are all constants with
    * a SHAPE-prefix or any newly defined shape names. Value is "shape".
    */
    static STYLE_SHAPE: string;
    /**
    * Variable: SHAPE_RECTANGLE
    *
    * Name under which <mxRectangleShape> is registered in <mxCellRenderer>.
    * Default is rectangle.
    */
    static SHAPE_RECTANGLE: string;
    /**
     * Variable: NONE
     *
     * Defines the value for none. Default is "none".
     */
    static NONE: string;
    /**
     * Variable: STYLE_PERIMETER
     *
     * Defines the key for the perimeter style. This is a function that defines
     * the perimeter around a particular shape. Possible values are the
     * functions defined in <mxPerimeter>. Alternatively, the constants in this
     * class that start with "PERIMETER_" may be used to access
     * perimeter styles in <mxStyleRegistry>. Value is "perimeter".
     */
    static STYLE_PERIMETER: string;
    /**
     * Variable: STYLE_FILLCOLOR
     *
     * Defines the key for the fill color. Possible values are all HTML color
     * names or HEX codes, as well as special keywords such as 'swimlane,
     * 'inherit' or 'indicated' to use the color code of a related cell or the
     * indicator shape. Value is "fillColor".
     */
    static STYLE_FILLCOLOR: string;
    /**
     * Variable: STYLE_STROKECOLOR
     *
     * Defines the key for the strokeColor style. Possible values are all HTML
     * color names or HEX codes, as well as special keywords such as 'swimlane,
     * 'inherit', 'indicated' to use the color code of a related cell or the
     * indicator shape or 'none' for no color. Value is "strokeColor".
     */
    static STYLE_STROKECOLOR: string;
    /**
     * Variable: STYLE_ALIGN
     *
     * Defines the key for the align style. Possible values are <ALIGN_LEFT>,
     * <ALIGN_CENTER> and <ALIGN_RIGHT>. This value defines how the lines of
     * the label are horizontally aligned. <ALIGN_LEFT> mean label text lines
     * are aligned to left of the label bounds, <ALIGN_RIGHT> to the right of
     * the label bounds and <ALIGN_CENTER> means the center of the text lines
     * are aligned in the center of the label bounds. Note this value doesn't
     * affect the positioning of the overall label bounds relative to the
     * vertex, to move the label bounds horizontally, use
     * <STYLE_LABEL_POSITION>. Value is "align".
     */
    static STYLE_ALIGN: string;
    /**
     * Variable: STYLE_VERTICAL_ALIGN
     *
     * Defines the key for the verticalAlign style. Possible values are
     * <ALIGN_TOP>, <ALIGN_MIDDLE> and <ALIGN_BOTTOM>. This value defines how
     * the lines of the label are vertically aligned. <ALIGN_TOP> means the
     * topmost label text line is aligned against the top of the label bounds,
     * <ALIGN_BOTTOM> means the bottom-most label text line is aligned against
     * the bottom of the label bounds and <ALIGN_MIDDLE> means there is equal
     * spacing between the topmost text label line and the top of the label
     * bounds and the bottom-most text label line and the bottom of the label
     * bounds. Note this value doesn't affect the positioning of the overall
     * label bounds relative to the vertex, to move the label bounds
     * vertically, use <STYLE_VERTICAL_LABEL_POSITION>. Value is "verticalAlign".
     */
    static STYLE_VERTICAL_ALIGN: string;
    /**
     * Variable: STYLE_ENDARROW
     *
     * Defines the key for the end arrow marker. Possible values are all
     * constants with an ARROW-prefix. This is only used in <mxConnector>.
     * Value is "endArrow".
     *
     * Example:
     * (code)
     * style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_CLASSIC;
     * (end)
     */
    static STYLE_ENDARROW: string;
    /**
     * Variable: STYLE_FONTCOLOR
     *
     * Defines the key for the fontColor style. Possible values are all HTML
     * color names or HEX codes. Value is "fontColor".
     */
    static STYLE_FONTCOLOR: string;
    /**
     * Variable: SHAPE_CONNECTOR
     *
     * Name under which <mxConnector> is registered in <mxCellRenderer>.
     * Default is connector.
     */
    static SHAPE_CONNECTOR: string;
    /**
     * Variable: ARROW_CLASSIC
     *
     * Constant for classic arrow markers.
     */
    static ARROW_CLASSIC: string;
    /**
     * Variable: ALIGN_CENTER
     *
     * Constant for center horizontal alignment. Default is center.
     */
    static ALIGN_CENTER: string;
    /**
     * Variable: ALIGN_RIGHT
     *
     * Constant for right horizontal alignment. Default is right.
     */
    static ALIGN_RIGHT: string;
    /**
     * Variable: ALIGN_MIDDLE
     *
     * Constant for middle vertical alignment. Default is middle.
     */
    static ALIGN_MIDDLE: string;
}
