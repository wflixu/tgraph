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
export declare class ThCell {
    /**
     * Variable: id
     *
     * Holds the Id. Default is null.
     */
    id: string;
    /**
     * Variable: value
     *
     * Holds the user object. Default is null.
     */
    value: Optional<ThOjbect>;
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
    geometry: null;
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
    vertex: boolean;
    /**
     * Variable: edge
     *
     * Specifies whether the cell is an edge. Default is false.
     */
    edge: boolean;
    /**
     * Variable: connectable
     *
     * Specifies whether the cell is connectable. Default is true.
     */
    connectable: boolean;
    /**
     * Variable: visible
     *
     * Specifies whether the cell is visible. Default is true.
     */
    visible: boolean;
    /**
     * Variable: collapsed
     *
     * Specifies whether the cell is collapsed. Default is false.
     */
    collapsed: boolean;
    /**
     * Variable: parent
     *
     * Reference to the parent cell.
     */
    parent: Optional<ThCell>;
    /**
     * Variable: source
     *
     * Reference to the source terminal.
     */
    source: null;
    /**
     * Variable: target
     *
     * Reference to the target terminal.
     */
    target: null;
    /**
     * Variable: children
     *
     * Holds the child cells.
     */
    children: ThCell[];
    /**
     * Variable: edges
     *
     * Holds the edges.
     */
    edges: never[];
    /**
     * Variable: mxTransient
     *
     * List of members that should not be cloned inside <clone>. This field is
     * passed to <mxUtils.clone> and is not made persistent in <mxCellCodec>.
     * This is not a convention for all classes, it is only used in this class
     * to mark transient fields since transient modifiers are not supported by
     * the language.
     */
    mxTransient: string[];
    /**
     *
     * value - Optional object that represents the cell value.
     * geometry - Optional <mxGeometry> that specifies the geometry.
     * style - Optional formatted string that defines the style.
     * @param value
     * @param geometry
     * @param style
     */
    constructor(value?: ThOjbect, geometry?: any, style?: string);
    onInit(): void;
    /**
     * Sets the <mxGeometry> to be used as the <geometry>.
     * @param geometry
     */
    setGeometry(geometry: any): void;
    /**
     * Sets the string to be used as the <style>.
     * @param style
     */
    setStyle(style: Optional<string>): void;
    /**
     * Function: getId
     *
     * Returns the Id of the cell as a string.
     */
    getId(): string;
    /**
     * Function: setId
     *
     * Sets the Id of the cell to the given string.
     */
    setId(id: string): void;
    /**
     * Function: getChildCount
     *
     * Returns the number of child cells.
     */
    getChildCount(): number;
    /**
     * Function: getChildAt
     *
     * Returns the child at the specified index.
     *
     * Parameters:
     *
     * index - Integer that specifies the child to be returned.
     */
    getChildAt(index: number): Optional<ThCell>;
    /**
     * Function: insert
     *
     * Inserts the specified child into the child array at the specified index
     * and updates the parent reference of the child. If not childIndex is
     * specified then the child is appended to the child array. Returns the
     * inserted child.
     *
     * Parameters:
     *
     * child - <mxCell> to be inserted or appended to the child array.
     * index - Optional integer that specifies the index at which the child
     * should be inserted into the child array.
     */
    insert(child: ThCell, index?: number): ThCell;
    /**
   * Function: removeFromParent
   *
   * Removes the cell from its parent.
   */
    removeFromParent(): void;
    /**
     * Function: remove
     *
     * Removes the child at the specified index from the child array and
     * returns the child that was removed. Will remove the parent reference of
     * the child.
     *
     * Parameters:
     *
     * index - Integer that specifies the index of the child to be
     * removed.
     */
    remove(index: number): ThCell | null | undefined;
    /**
     * Function: setParent
     *
     * Sets the parent cell.
     *
     * Parameters:
     *
     * parent - <mxCell> that represents the new parent.
     */
    setParent(parent: Optional<ThCell>): void;
    /**
     * Function: getIndex
     *
     * Returns the index of the specified child in the child array.
     *
     * Parameters:
     *
     * child - Child whose index should be returned.
     */
    getIndex(child: ThCell): number;
    /**
     * Function: getParent
     *
     * Returns the cell's parent.
     */
    getParent(): Optional<ThCell>;
}
