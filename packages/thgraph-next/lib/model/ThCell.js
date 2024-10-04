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
    id = '';
    /**
     * Variable: value
     *
     * Holds the user object. Default is null.
     */
    value;
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
    style;
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
    parent;
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
    children = [];
    /**
     * Variable: edges
     *
     * Holds the edges.
     */
    edges = [];
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
    constructor(value, geometry, style) {
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
    setGeometry(geometry) {
        this.geometry = geometry;
    }
    /**
     * Sets the string to be used as the <style>.
     * @param style
     */
    setStyle(style) {
        this.style = style;
    }
    /**
     * Function: getId
     *
     * Returns the Id of the cell as a string.
     */
    getId() {
        return this.id;
    }
    /**
     * Function: setId
     *
     * Sets the Id of the cell to the given string.
     */
    setId(id) {
        this.id = id;
    }
    /**
     * Function: getChildCount
     *
     * Returns the number of child cells.
     */
    getChildCount() {
        return this.children?.length ?? 0;
    }
    /**
     * Function: getChildAt
     *
     * Returns the child at the specified index.
     *
     * Parameters:
     *
     * index - Integer that specifies the child to be returned.
     */
    getChildAt(index) {
        return this.children[index];
    }
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
    insert(child, index) {
        if (child) {
            if (index == null) {
                index = this.getChildCount();
                if (child.getParent() == this) {
                    index--;
                }
            }
            child.removeFromParent();
            child.setParent(this);
            if (this.children == null) {
                this.children = [];
                this.children.push(child);
            }
            else {
                this.children.splice(index, 0, child);
            }
        }
        return child;
    }
    /**
   * Function: removeFromParent
   *
   * Removes the cell from its parent.
   */
    removeFromParent() {
        if (this.parent != null) {
            var index = this.parent.getIndex(this);
            this.parent.remove(index);
        }
    }
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
    remove(index) {
        var child = null;
        if (this.children != null && index >= 0) {
            child = this.getChildAt(index);
            if (child != null) {
                this.children.splice(index, 1);
                child.setParent(undefined);
            }
        }
        return child;
    }
    /**
     * Function: setParent
     *
     * Sets the parent cell.
     *
     * Parameters:
     *
     * parent - <mxCell> that represents the new parent.
     */
    setParent(parent) {
        this.parent = parent;
    }
    /**
     * Function: getIndex
     *
     * Returns the index of the specified child in the child array.
     *
     * Parameters:
     *
     * child - Child whose index should be returned.
     */
    getIndex(child) {
        return this.children.findIndex(item => item == child);
    }
    /**
     * Function: getParent
     *
     * Returns the cell's parent.
     */
    getParent() {
        return this.parent;
    }
}
