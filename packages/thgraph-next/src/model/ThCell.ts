
/**
 * Class: mxCell
 *
 * Cells are the elements of the graph model. They represent the state
 * of the groups, vertices and edges in a graph.
 *
 * Custom attributes:
 *
 * For custom attributes we recommend using an XML node as the value of a cell.
 * The following code can be used to create a cell with an XML node as the
 * value:
 *
 * ```ts
 * var doc = mxUtils.createXmlDocument();
 * var node = doc.createElement('MyNode')
 * node.setAttribute('label', 'MyLabel');
 * node.setAttribute('attribute1', 'value1');
 * graph.insertVertex(graph.getDefaultParent(), null, node, 40, 40, 80, 30);
 * ```
 *
 * For the label to work, <mxGraph.convertValueToString> and
 * <mxGraph.cellLabelChanged> should be overridden as follows:
 *
 * ```ts
 * graph.convertValueToString = function(cell)
 * {
 *   if (mxUtils.isNode(cell.value))
 *   {
 *     return cell.getAttribute('label', '')
 *   }
 * };
 *
 * var cellLabelChanged = graph.cellLabelChanged;
 * graph.cellLabelChanged = function(cell, newValue, autoSize)
 * {
 *   if (mxUtils.isNode(cell.value))
 *   {
 *     // Clones the value for correct undo/redo
 *     var elt = cell.value.cloneNode(true);
 *     elt.setAttribute('label', newValue);
 *     newValue = elt;
 *   }
 *
 *   cellLabelChanged.apply(this, arguments);
 * };
 * ```
 *
 * Callback: onInit
 *
 * Called from within the constructor.
 *
 * Constructor: mxCell
 *
 * Constructs a new cell to be used in a graph model.
 * This method invokes <onInit> upon completion.
 *
 * Parameters:
 *
 * value - Optional object that represents the cell value.
 * geometry - Optional <mxGeometry> that specifies the geometry.
 * style - Optional formatted string that defines the style.
 */
export class ThCell {

    /**
     * Variable: id
     *
     * Holds the Id. Default is null.
     */
    id = null;

    /**
     * Variable: value
     *
     * Holds the user object. Default is null.
     */
    value : Optional<ThOjbect>;
    /**
     * 
     * @param value Optional object that represents the cell value.
     * @param geometry Optional <mxGeometry> that specifies the geometry.
     * @param style Optional formatted string that defines the style.
     */



    /**
     * Variable: geometry
     *
     * Holds the <mxGeometry>. Default is null.
     */
    geometry = null;

    /**
     * Variable: style
     *
     * Holds the style as a string of the form [(stylename|key=value);]. Default is
     * null.
     */
    style: Optional<string>;

    /**
     * Variable: vertex
     *
     * Specifies whether the cell is a vertex. Default is false.
     */
    vertex = false;

    /**
     * Variable: edge
     *
     * Specifies whether the cell is an edge. Default is false.
     */
    edge = false;

    /**
     * Variable: connectable
     *
     * Specifies whether the cell is connectable. Default is true.
     */
    connectable = true;

    /**
     * Variable: visible
     *
     * Specifies whether the cell is visible. Default is true.
     */
    visible = true;

    /**
     * Variable: collapsed
     *
     * Specifies whether the cell is collapsed. Default is false.
     */
    collapsed = false;

    /**
     * Variable: parent
     *
     * Reference to the parent cell.
     */
    parent = null;

    /**
     * Variable: source
     *
     * Reference to the source terminal.
     */
    source = null;

    /**
     * Variable: target
     *
     * Reference to the target terminal.
     */
    target = null;

    /**
     * Variable: children
     *
     * Holds the child cells.
     */
    children = null;

    /**
     * Variable: edges
     *
     * Holds the edges.
     */
    edges = null;

    /**
     * Variable: mxTransient
     *
     * List of members that should not be cloned inside <clone>. This field is
     * passed to <mxUtils.clone> and is not made persistent in <mxCellCodec>.
     * This is not a convention for all classes, it is only used in this class
     * to mark transient fields since transient modifiers are not supported by
     * the language.
     */
    mxTransient = [
        'id',
        'value',
        'parent',
        'source',
        'target',
        'children',
        'edges',
    ];

    /**
     * 
     * value - Optional object that represents the cell value.
     * geometry - Optional <mxGeometry> that specifies the geometry.
     * style - Optional formatted string that defines the style.
     * @param value 
     * @param geometry 
     * @param style 
     */
    constructor(value?: ThOjbect, geometry?: any, style?: string) {
        this.value = value;
        this.setGeometry(geometry);
        this.setStyle(style);
        if (this.onInit) {
            this.onInit();
        }
    }
    onInit() {

    }
    /**
     * Sets the <mxGeometry> to be used as the <geometry>.
     * @param geometry 
     */
    setGeometry(geometry: any) {
        this.geometry = geometry;
    }
    /**
     * Sets the string to be used as the <style>.
     * @param style 
     */
    setStyle(style: Optional<string>) {
        this.style = style
    }
}