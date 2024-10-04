/**
 * Class: ThGraph
 *
 * Extends <mxEventSource> to implement a graph component for
 * the browser. This is the main class of the package. To activate
 * panning and connections use <setPanning> and <setConnectable>.
 * For rubberband selection you must create a new instance of
 * <mxRubberband>. The following listeners are added to
 * <mouseListeners> by default:
 *
 * - <tooltipHandler>: <mxTooltipHandler> that displays tooltips
 * - <panningHandler>: <mxPanningHandler> for panning and popup menus
 * - <connectionHandler>: <mxConnectionHandler> for creating connections
 * - <graphHandler>: <mxGraphHandler> for moving and cloning cells
 *
 * These listeners will be called in the above order if they are enabled.
 *
 * Background Images:
 *
 * To display a background image, set the image, image width and
 * image height using <setBackgroundImage>. If one of the
 * above values has changed then the <view>'s <mxGraphView.validate>
 * should be invoked.
 *
 * Cell Images:
 *
 * To use images in cells, a shape must be specified in the default
 * vertex style (or any named style). Possible shapes are
 * <ThConstants.SHAPE_IMAGE> and <ThConstants.SHAPE_LABEL>.
 * The code to change the shape used in the default vertex style,
 * the following code is used:
 *
 * (code)
 * var style = graph.getStylesheet().getDefaultVertexStyle();
 * style[ThConstants.STYLE_SHAPE] = ThConstants.SHAPE_IMAGE;
 * (end)
 *
 * For the default vertex style, the image to be displayed can be
 * specified in a cell's style using the <ThConstants.STYLE_IMAGE>
 * key and the image URL as a value, for example:
 *
 * (code)
 * image=http://www.example.com/image.gif
 * (end)
 *
 * For a named style, the the stylename must be the first element
 * of the cell style:
 *
 * (code)
 * stylename;image=http://www.example.com/image.gif
 * (end)
 *
 * A cell style can have any number of key=value pairs added, divided
 * by a semicolon as follows:
 *
 * (code)
 * [stylename;|key=value;]
 * (end)
 *
 * Labels:
 *
 * The cell labels are defined by <getLabel> which uses <convertValueToString>
 * if <labelsVisible> is true. If a label must be rendered as HTML markup, then
 * <isHtmlLabel> should return true for the respective cell. If all labels
 * contain HTML markup, <htmlLabels> can be set to true. NOTE: Enabling HTML
 * labels carries a possible security risk (see the section on security in
 * the manual).
 *
 * If wrapping is needed for a label, then <isHtmlLabel> and <isWrapping> must
 * return true for the cell whose label should be wrapped. See <isWrapping> for
 * an example.
 *
 * If clipping is needed to keep the rendering of a HTML label inside the
 * bounds of its vertex, then <isClipping> should return true for the
 * respective cell.
 *
 * By default, edge labels are movable and vertex labels are fixed. This can be
 * changed by setting <edgeLabelsMovable> and <vertexLabelsMovable>, or by
 * overriding <isLabelMovable>.
 *
 * In-place Editing:
 *
 * In-place editing is started with a doubleclick or by typing F2.
 * Programmatically, <edit> is used to check if the cell is editable
 * (<isCellEditable>) and call <startEditingAtCell>, which invokes
 * <mxCellEditor.startEditing>. The editor uses the value returned
 * by <getEditingValue> as the editing value.
 *
 * After in-place editing, <labelChanged> is called, which invokes
 * <ThGraphModel.setValue>, which in turn calls
 * <ThGraphModel.valueForCellChanged> via <mxValueChange>.
 *
 * The event that triggers in-place editing is passed through to the
 * <cellEditor>, which may take special actions depending on the type of the
 * event or mouse location, and is also passed to <getEditingValue>. The event
 * is then passed back to the event processing functions which can perform
 * specific actions based on the trigger event.
 *
 * Tooltips:
 *
 * Tooltips are implemented by <getTooltip>, which calls <getTooltipForCell>
 * if a cell is under the mousepointer. The default implementation checks if
 * the cell has a getTooltip function and calls it if it exists. Hence, in order
 * to provide custom tooltips, the cell must provide a getTooltip function, or
 * one of the two above functions must be overridden.
 *
 * Typically, for custom cell tooltips, the latter function is overridden as
 * follows:
 *
 * (code)
 * graph.getTooltipForCell = function(cell)
 * {
 *   var label = this.convertValueToString(cell);
 *   return 'Tooltip for '+label;
 * }
 * (end)
 *
 * When using a config file, the function is overridden in the ThGraph section
 * using the following entry:
 *
 * (code)
 * <add as="getTooltipForCell"><![CDATA[
 *   function(cell)
 *   {
 *     var label = this.convertValueToString(cell);
 *     return 'Tooltip for '+label;
 *   }
 * ]]></add>
 * (end)
 *
 * "this" refers to the graph in the implementation, so for example to check if
 * a cell is an edge, you use this.getModel().isEdge(cell)
 *
 * For replacing the default implementation of <getTooltipForCell> (rather than
 * replacing the function on a specific instance), the following code should be
 * used after loading the JavaScript files, but before creating a new ThGraph
 * instance using <ThGraph>:
 *
 * (code)
 * getTooltipForCell = function(cell)
 * {
 *   var label = this.convertValueToString(cell);
 *   return 'Tooltip for '+label;
 * }
 * (end)
 *
 * Shapes & Styles:
 *
 * The implementation of new shapes is demonstrated in the examples. We'll assume
 * that we have implemented a custom shape with the name BoxShape which we want
 * to use for drawing vertices. To use this shape, it must first be registered in
 * the cell renderer as follows:
 *
 * (code)
 * mxCellRenderer.registerShape('box', BoxShape);
 * (end)
 *
 * The code registers the BoxShape constructor under the name box in the cell
 * renderer of the graph. The shape can now be referenced using the shape-key in
 * a style definition. (The cell renderer contains a set of additional shapes,
 * namely one for each constant with a SHAPE-prefix in <ThConstants>.)
 *
 * Styles are a collection of key, value pairs and a stylesheet is a collection
 * of named styles. The names are referenced by the cellstyle, which is stored
 * in <mxCell.style> with the following format: [stylename;|key=value;]. The
 * string is resolved to a collection of key, value pairs, where the keys are
 * overridden with the values in the string.
 *
 * When introducing a new shape, the name under which the shape is registered
 * must be used in the stylesheet. There are three ways of doing this:
 *
 *   - By changing the default style, so that all vertices will use the new
 * 		shape
 *   - By defining a new style, so that only vertices with the respective
 * 		cellstyle will use the new shape
 *   - By using shape=box in the cellstyle's optional list of key, value pairs
 * 		to be overridden
 *
 * In the first case, the code to fetch and modify the default style for
 * vertices is as follows:
 *
 * (code)
 * var style = graph.getStylesheet().getDefaultVertexStyle();
 * style[ThConstants.STYLE_SHAPE] = 'box';
 * (end)
 *
 * The code takes the default vertex style, which is used for all vertices that
 * do not have a specific cellstyle, and modifies the value for the shape-key
 * in-place to use the new BoxShape for drawing vertices. This is done by
 * assigning the box value in the second line, which refers to the name of the
 * BoxShape in the cell renderer.
 *
 * In the second case, a collection of key, value pairs is created and then
 * added to the stylesheet under a new name. In order to distinguish the
 * shapename and the stylename we'll use boxstyle for the stylename:
 *
 * (code)
 * var style = new Object();
 * style[ThConstants.STYLE_SHAPE] = 'box';
 * style[ThConstants.STYLE_STROKECOLOR] = '#000000';
 * style[ThConstants.STYLE_FONTCOLOR] = '#000000';
 * graph.getStylesheet().putCellStyle('boxstyle', style);
 * (end)
 *
 * The code adds a new style with the name boxstyle to the stylesheet. To use
 * this style with a cell, it must be referenced from the cellstyle as follows:
 *
 * (code)
 * var vertex = graph.insertVertex(parent, null, 'Hello, World!', 20, 20, 80, 20,
 * 				'boxstyle');
 * (end)
 *
 * To summarize, each new shape must be registered in the <mxCellRenderer> with
 * a unique name. That name is then used as the value of the shape-key in a
 * default or custom style. If there are multiple custom shapes, then there
 * should be a separate style for each shape.
 *
 * Inheriting Styles:
 *
 * For fill-, stroke-, gradient-, font- and indicatorColors special keywords
 * can be used. The inherit keyword for one of these colors will inherit the
 * color for the same key from the parent cell. The swimlane keyword does the
 * same, but inherits from the nearest swimlane in the ancestor hierarchy.
 * Finally, the indicated keyword will use the color of the indicator as the
 * color for the given key.
 *
 * Scrollbars:
 *
 * The <containers> overflow CSS property defines if scrollbars are used to
 * display the graph. For values of 'auto' or 'scroll', the scrollbars will
 * be shown. Note that the <resizeContainer> flag is normally not used
 * together with scrollbars, as it will resize the container to match the
 * size of the graph after each change.
 *
 * Multiplicities and Validation:
 *
 * To control the possible connections in ThGraph, <getEdgeValidationError> is
 * used. The default implementation of the function uses <multiplicities>,
 * which is an array of <mxMultiplicity>. Using this class allows to establish
 * simple multiplicities, which are enforced by the graph.
 *
 * The <mxMultiplicity> uses <mxCell.is> to determine for which terminals it
 * applies. The default implementation of <mxCell.is> works with DOM nodes (XML
 * nodes) and checks if the given type parameter matches the nodeName of the
 * node (case insensitive). Optionally, an attributename and value can be
 * specified which are also checked.
 *
 * <getEdgeValidationError> is called whenever the connectivity of an edge
 * changes. It returns an empty string or an error message if the edge is
 * invalid or null if the edge is valid. If the returned string is not empty
 * then it is displayed as an error message.
 *
 * <mxMultiplicity> allows to specify the multiplicity between a terminal and
 * its possible neighbors. For example, if any rectangle may only be connected
 * to, say, a maximum of two circles you can add the following rule to
 * <multiplicities>:
 *
 * (code)
 * graph.multiplicities.push(new mxMultiplicity(
 *   true, 'rectangle', null, null, 0, 2, ['circle'],
 *   'Only 2 targets allowed',
 *   'Only shape targets allowed'));
 * (end)
 *
 * This will display the first error message whenever a rectangle is connected
 * to more than two circles and the second error message if a rectangle is
 * connected to anything but a circle.
 *
 * For certain multiplicities, such as a minimum of 1 connection, which cannot
 * be enforced at cell creation time (unless the cell is created together with
 * the connection), ThGraph offers <validate> which checks all multiplicities
 * for all cells and displays the respective error messages in an overlay icon
 * on the cells.
 *
 * If a cell is collapsed and contains validation errors, a respective warning
 * icon is attached to the collapsed cell.
 *
 * Auto-Layout:
 *
 * For automatic layout, the <getLayout> hook is provided in <mxLayoutManager>.
 * It can be overridden to return a layout algorithm for the children of a
 * given cell.
 *
 * Unconnected edges:
 *
 * The default values for all switches are designed to meet the requirements of
 * general diagram drawing applications. A very typical set of settings to
 * avoid edges that are not connected is the following:
 *
 * (code)
 * graph.setAllowDanglingEdges(false);
 * graph.setDisconnectOnMove(false);
 * (end)
 *
 * Setting the <cloneInvalidEdges> switch to true is optional. This switch
 * controls if edges are inserted after a copy, paste or clone-drag if they are
 * invalid. For example, edges are invalid if copied or control-dragged without
 * having selected the corresponding terminals and allowDanglingEdges is
 * false, in which case the edges will not be cloned if the switch is false.
 *
 * Output:
 *
 * To produce an XML representation for a diagram, the following code can be
 * used.
 *
 * (code)
 * var enc = new mxCodec(mxUtils.createXmlDocument());
 * var node = enc.encode(graph.getModel());
 * (end)
 *
 * This will produce an XML node than can be handled using the DOM API or
 * turned into a string representation using the following code:
 *
 * (code)
 * var xml = mxUtils.getXml(node);
 * (end)
 *
 * To obtain a formatted string, mxUtils.getPrettyXml can be used instead.
 *
 * This string can now be stored in a local persistent storage (for example
 * using Google Gears) or it can be passed to a backend using mxUtils.post as
 * follows. The url variable is the URL of the Java servlet, PHP page or HTTP
 * handler, depending on the server.
 *
 * (code)
 * var xmlString = encodeURIComponent(mxUtils.getXml(node));
 * mxUtils.post(url, 'xml='+xmlString, function(req)
 * {
 *   // Process server response using req of type mxXmlRequest
 * });
 * (end)
 *
 * Input:
 *
 * To load an XML representation of a diagram into an existing graph object
 * mxUtils.load can be used as follows. The url variable is the URL of the Java
 * servlet, PHP page or HTTP handler that produces the XML string.
 *
 * (code)
 * var xmlDoc = mxUtils.load(url).getXml();
 * var node = xmlDoc.documentElement;
 * var dec = new mxCodec(node.ownerDocument);
 * dec.decode(node, graph.getModel());
 * (end)
 *
 * For creating a page that loads the client and a diagram using a single
 * request please refer to the deployment examples in the backends.
 *
 * Functional dependencies:
 *
 * (see images/callgraph.png)
 *
 * Resources:
 *
 * resources/graph - Language resources for ThGraph
 *
 * Group: Events
 *
 * Event: ThEvent.ROOT
 *
 * Fires if the root in the model has changed. This event has no properties.
 *
 * Event: ThEvent.ALIGN_CELLS
 *
 * Fires between begin- and endUpdate in <alignCells>. The <code>cells</code>
 * and <code>align</code> properties contain the respective arguments that were
 * passed to <alignCells>.
 *
 * Event: ThEvent.FLIP_EDGE
 *
 * Fires between begin- and endUpdate in <flipEdge>. The <code>edge</code>
 * property contains the edge passed to <flipEdge>.
 *
 * Event: ThEvent.ORDER_CELLS
 *
 * Fires between begin- and endUpdate in <orderCells>. The <code>cells</code>
 * and <code>back</code> properties contain the respective arguments that were
 * passed to <orderCells>.
 *
 * Event: ThEvent.CELLS_ORDERED
 *
 * Fires between begin- and endUpdate in <cellsOrdered>. The <code>cells</code>
 * and <code>back</code> arguments contain the respective arguments that were
 * passed to <cellsOrdered>.
 *
 * Event: ThEvent.GROUP_CELLS
 *
 * Fires between begin- and endUpdate in <groupCells>. The <code>group</code>,
 * <code>cells</code> and <code>border</code> arguments contain the respective
 * arguments that were passed to <groupCells>.
 *
 * Event: ThEvent.UNGROUP_CELLS
 *
 * Fires between begin- and endUpdate in <ungroupCells>. The <code>cells</code>
 * property contains the array of cells that was passed to <ungroupCells>.
 *
 * Event: ThEvent.REMOVE_CELLS_FROM_PARENT
 *
 * Fires between begin- and endUpdate in <removeCellsFromParent>. The
 * <code>cells</code> property contains the array of cells that was passed to
 * <removeCellsFromParent>.
 *
 * Event: ThEvent.ADD_CELLS
 *
 * Fires between begin- and endUpdate in <addCells>. The <code>cells</code>,
 * <code>parent</code>, <code>index</code>, <code>source</code> and
 * <code>target</code> properties contain the respective arguments that were
 * passed to <addCells>.
 *
 * Event: ThEvent.CELLS_ADDED
 *
 * Fires between begin- and endUpdate in <cellsAdded>. The <code>cells</code>,
 * <code>parent</code>, <code>index</code>, <code>source</code>,
 * <code>target</code> and <code>absolute</code> properties contain the
 * respective arguments that were passed to <cellsAdded>.
 *
 * Event: ThEvent.REMOVE_CELLS
 *
 * Fires between begin- and endUpdate in <removeCells>. The <code>cells</code>
 * and <code>includeEdges</code> arguments contain the respective arguments
 * that were passed to <removeCells>.
 *
 * Event: ThEvent.CELLS_REMOVED
 *
 * Fires between begin- and endUpdate in <cellsRemoved>. The <code>cells</code>
 * argument contains the array of cells that was removed.
 *
 * Event: ThEvent.SPLIT_EDGE
 *
 * Fires between begin- and endUpdate in <splitEdge>. The <code>edge</code>
 * property contains the edge to be splitted, the <code>cells</code>,
 * <code>newEdge</code>, <code>dx</code> and <code>dy</code> properties contain
 * the respective arguments that were passed to <splitEdge>.
 *
 * Event: ThEvent.TOGGLE_CELLS
 *
 * Fires between begin- and endUpdate in <toggleCells>. The <code>show</code>,
 * <code>cells</code> and <code>includeEdges</code> properties contain the
 * respective arguments that were passed to <toggleCells>.
 *
 * Event: ThEvent.FOLD_CELLS
 *
 * Fires between begin- and endUpdate in <foldCells>. The
 * <code>collapse</code>, <code>cells</code> and <code>recurse</code>
 * properties contain the respective arguments that were passed to <foldCells>.
 *
 * Event: ThEvent.CELLS_FOLDED
 *
 * Fires between begin- and endUpdate in cellsFolded. The
 * <code>collapse</code>, <code>cells</code> and <code>recurse</code>
 * properties contain the respective arguments that were passed to
 * <cellsFolded>.
 *
 * Event: ThEvent.UPDATE_CELL_SIZE
 *
 * Fires between begin- and endUpdate in <updateCellSize>. The
 * <code>cell</code> and <code>ignoreChildren</code> properties contain the
 * respective arguments that were passed to <updateCellSize>.
 *
 * Event: ThEvent.RESIZE_CELLS
 *
 * Fires between begin- and endUpdate in <resizeCells>. The <code>cells</code>
 * and <code>bounds</code> properties contain the respective arguments that
 * were passed to <resizeCells>.
 *
 * Event: ThEvent.CELLS_RESIZED
 *
 * Fires between begin- and endUpdate in <cellsResized>. The <code>cells</code>
 * and <code>bounds</code> properties contain the respective arguments that
 * were passed to <cellsResized>.
 *
 * Event: ThEvent.MOVE_CELLS
 *
 * Fires between begin- and endUpdate in <moveCells>. The <code>cells</code>,
 * <code>dx</code>, <code>dy</code>, <code>clone</code>, <code>target</code>
 * and <code>event</code> properties contain the respective arguments that
 * were passed to <moveCells>.
 *
 * Event: ThEvent.CELLS_MOVED
 *
 * Fires between begin- and endUpdate in <cellsMoved>. The <code>cells</code>,
 * <code>dx</code>, <code>dy</code> and <code>disconnect</code> properties
 * contain the respective arguments that were passed to <cellsMoved>.
 *
 * Event: ThEvent.CONNECT_CELL
 *
 * Fires between begin- and endUpdate in <connectCell>. The <code>edge</code>,
 * <code>terminal</code> and <code>source</code> properties contain the
 * respective arguments that were passed to <connectCell>.
 *
 * Event: ThEvent.CELL_CONNECTED
 *
 * Fires between begin- and endUpdate in <cellConnected>. The
 * <code>edge</code>, <code>terminal</code> and <code>source</code> properties
 * contain the respective arguments that were passed to <cellConnected>.
 *
 * Event: ThEvent.REFRESH
 *
 * Fires after <refresh> was executed. This event has no properties.
 *
 * Event: ThEvent.CLICK
 *
 * Fires in <click> after a click event. The <code>event</code> property
 * contains the original mouse event and <code>cell</code> property contains
 * the cell under the mouse or null if the background was clicked.
 *
 * Event: ThEvent.DOUBLE_CLICK
 *
 * Fires in <dblClick> after a double click. The <code>event</code> property
 * contains the original mouse event and the <code>cell</code> property
 * contains the cell under the mouse or null if the background was clicked.
 *
 * Event: ThEvent.GESTURE
 *
 * Fires in <fireGestureEvent> after a touch gesture. The <code>event</code>
 * property contains the original gesture end event and the <code>cell</code>
 * property contains the optional cell associated with the gesture.
 *
 * Event: ThEvent.TAP_AND_HOLD
 *
 * Fires in <tapAndHold> if a tap and hold event was detected. The <code>event</code>
 * property contains the initial touch event and the <code>cell</code> property
 * contains the cell under the mouse or null if the background was clicked.
 *
 * Event: ThEvent.FIRE_MOUSE_EVENT
 *
 * Fires in <fireMouseEvent> before the mouse listeners are invoked. The
 * <code>eventName</code> property contains the event name and the
 * <code>event</code> property contains the <mxMouseEvent>.
 *
 * Event: ThEvent.SIZE
 *
 * Fires after <sizeDidChange> was executed. The <code>bounds</code> property
 * contains the new graph bounds.
 *
 * Event: ThEvent.START_EDITING
 *
 * Fires before the in-place editor starts in <startEditingAtCell>. The
 * <code>cell</code> property contains the cell that is being edited and the
 * <code>event</code> property contains the optional event argument that was
 * passed to <startEditingAtCell>.
 *
 * Event: ThEvent.EDITING_STARTED
 *
 * Fires after the in-place editor starts in <startEditingAtCell>. The
 * <code>cell</code> property contains the cell that is being edited and the
 * <code>event</code> property contains the optional event argument that was
 * passed to <startEditingAtCell>.
 *
 * Event: ThEvent.EDITING_STOPPED
 *
 * Fires after the in-place editor stops in <stopEditing>.
 *
 * Event: ThEvent.LABEL_CHANGED
 *
 * Fires between begin- and endUpdate in <cellLabelChanged>. The
 * <code>cell</code> property contains the cell, the <code>value</code>
 * property contains the new value for the cell, the <code>old</code> property
 * contains the old value and the optional <code>event</code> property contains
 * the mouse event that started the edit.
 *
 * Event: ThEvent.ADD_OVERLAY
 *
 * Fires after an overlay is added in <addCellOverlay>. The <code>cell</code>
 * property contains the cell and the <code>overlay</code> property contains
 * the <mxCellOverlay> that was added.
 *
 * Event: ThEvent.REMOVE_OVERLAY
 *
 * Fires after an overlay is removed in <removeCellOverlay> and
 * <removeCellOverlays>. The <code>cell</code> property contains the cell and
 * the <code>overlay</code> property contains the <mxCellOverlay> that was
 * removed.
 *
 * Constructor: ThGraph
 *
 * Constructs a new ThGraph in the specified container. Model is an optional
 * ThGraphModel. If no model is provided, a new ThGraphModel instance is
 * used as the model. The container must have a valid owner document prior
 * to calling this function in Internet Explorer. RenderHint is a string to
 * affect the display performance and rendering in IE, but not in SVG-based
 * browsers. The parameter is mapped to <dialect>, which may
 * be one of <ThConstants.DIALECT_SVG> for SVG-based browsers,
 * <ThConstants.DIALECT_STRICTHTML> for fastest display mode,
 * <ThConstants.DIALECT_PREFERHTML> for faster display mode,
 * <ThConstants.DIALECT_MIXEDHTML> for fast and <ThConstants.DIALECT_VML>
 * for exact display mode (slowest). The dialects are defined in ThConstants.
 * The default values are DIALECT_SVG for SVG-based browsers and
 * DIALECT_MIXED for IE.
 *
 * The possible values for the renderingHint parameter are explained below:
 *
 * fast - The parameter is based on the fact that the display performance is
 * highly improved in IE if the VML is not contained within a VML group
 * element. The lack of a group element only slightly affects the display while
 * panning, but improves the performance by almost a factor of 2, while keeping
 * the display sufficiently accurate. This also allows to render certain shapes as HTML
 * if the display accuracy is not affected, which is implemented by
 * <mxShape.isMixedModeHtml>. This is the default setting and is mapped to
 * DIALECT_MIXEDHTML.
 * faster - Same as fast, but more expensive shapes are avoided. This is
 * controlled by <mxShape.preferModeHtml>. The default implementation will
 * avoid gradients and rounded rectangles, but more significant shapes, such
 * as rhombus, ellipse, actor and cylinder will be rendered accurately. This
 * setting is mapped to DIALECT_PREFERHTML.
 * fastest - Almost anything will be rendered in Html. This allows for
 * rectangles, labels and images. This setting is mapped to
 * DIALECT_STRICTHTML.
 * exact - If accurate panning is required and if the diagram is small (up
 * to 100 cells), then this value should be used. In this mode, a group is
 * created that contains the VML. This allows for accurate panning and is
 * mapped to DIALECT_VML.
 *
 * Example:
 *
 * To create a graph inside a DOM node with an id of graph:
 * (code)
 * var container = document.getElementById('graph');
 * var graph = new ThGraph(container);
 * (end)
 *
 * Parameters:
 *
 * container - Optional DOM node that acts as a container for the graph.
 * If this is null then the container can be initialized later using
 * <init>.
 * model - Optional <ThGraphModel> that constitutes the graph data.
 * renderHint - Optional string that specifies the display accuracy and
 * performance. Default is ThConstants.DIALECT_MIXEDHTML (for IE).
 * stylesheet - Optional <ThStylesheet> to be used in the graph.
 *
 * @constructor
 */
/**
 * Extends mxEventSource.
 */
import { ThCellRenderer } from './ThCellRenderer';
import { ThGraphModel } from './../model/ThGraphModel';
import { ThConstants } from '../util/ThConstants';
import { ThEventSource } from './../event/ThEventSource';
import { ThGraphSelectionModel } from './ThGraphSelectionModel';
import { ThStylesheet } from './ThStylesheet';
export class ThGraph extends ThEventSource {
    /**
     * Variable: mouseListeners
     *
     * Holds the mouse event listeners. See <fireMouseEvent>.
     */
    mouseListeners = [];
    /**
     * Variable: renderHint
     *
     * RenderHint as it was passed to the constructor.
     */
    renderHint;
    /**
     * Variable: dialect
     *
     * Dialect to be used for drawing the graph. Possible values are all
     * constants in <ThConstants> with a DIALECT-prefix.
     */
    dialect;
    /**
     * Variable: model
     *
     * Holds the <ThGraphModel> that contains the cells to be displayed.
     */
    model;
    /**
     * Variable: multiplicities
     *
     * An array of <mxMultiplicities> describing the allowed
     * connections in a graph.
     */
    multiplicities = [];
    /**
     * Variable: imageBundles
     *
     * Holds the list of image bundles.
     */
    imageBundles = [];
    /**
     * Variable: cellRenderer
     *
     * Holds the <mxCellRenderer> for rendering the cells in the graph.
     */
    cellRenderer;
    selectionModel;
    stylesheet;
    view;
    graphModelChangeListener = (sender, evt) => {
        this.graphModelChanged(evt.getProperty('edit').changes);
    };
    constructor(container, model, renderHint, stylesheet) {
        super();
        // Initializes the variable in case the prototype has been
        // modified to hold some listeners (which is possible because
        // the createHandlers call is executed regardless of the
        // arguments passed into the ctor).
        // Converts the renderHint into a dialect
        this.renderHint = renderHint ?? '';
        this.dialect = ThConstants.DIALECT_SVG;
        // Initializes the main members that do not require a container
        this.model = model ?? new ThGraphModel();
        this.cellRenderer = this.createCellRenderer();
        this.setSelectionModel(this.createSelectionModel());
        this.setStylesheet(stylesheet ?? this.createStylesheet());
        this.view = this.createGraphView();
        // Adds a graph model listener to update the view
        this.graphModelChangeListener = mxUtils.bind(this, function (sender, evt) {
            this.graphModelChanged(evt.getProperty('edit').changes);
        });
        this.model.addListener(ThEvent.CHANGE, this.graphModelChangeListener);
        // Installs basic event handlers with disabled default settings.
        this.createHandlers();
        // Initializes the display if a container was specified
        if (container) {
            this.init(container);
        }
        this.view.revalidate();
    }
    /**
     * Function: graphModelChanged
     *
     * Called when the graph model changes. Invokes <processChange> on each
     * item of the given array to update the view accordingly.
     *
     * Parameters:
     *
     * changes - Array that contains the individual changes.
     */
    graphModelChanged(changes) {
        for (var i = 0; i < changes.length; i++) {
            this.processChange(changes[i]);
        }
        this.updateSelection();
        this.view.validate();
        this.sizeDidChange();
    }
    /**
   * Function: processChange
   *
   * Processes the given change and invalidates the respective cached data
   * in <view>. This fires a <root> event if the root has changed in the
   * model.
   *
   * Parameters:
   *
   * change - Object that represents the change on the model.
   */
    processChange(change) {
        // Resets the view settings, removes all cells and clears
        // the selection if the root changes.
        if (change instanceof mxRootChange) {
            this.clearSelection();
            this.setDefaultParent(null);
            this.removeStateForCell(change.previous);
            if (this.resetViewOnRootChange) {
                this.view.scale = 1;
                this.view.translate.x = 0;
                this.view.translate.y = 0;
            }
            this.fireEvent(new mxEventObject(mxEvent.ROOT));
        }
        // Adds or removes a child to the view by online invaliding
        // the minimal required portions of the cache, namely, the
        // old and new parent and the child.
        else if (change instanceof mxChildChange) {
            var newParent = this.model.getParent(change.child);
            this.view.invalidate(change.child, true, true);
            if (!this.model.contains(newParent) || this.isCellCollapsed(newParent)) {
                this.view.invalidate(change.child, true, true);
                this.removeStateForCell(change.child);
                // Handles special case of current root of view being removed
                if (this.view.currentRoot == change.child) {
                    this.home();
                }
            }
            if (newParent != change.previous) {
                // Refreshes the collapse/expand icons on the parents
                if (newParent != null) {
                    this.view.invalidate(newParent, false, false);
                }
                if (change.previous != null) {
                    this.view.invalidate(change.previous, false, false);
                }
            }
        }
        // Handles two special cases where the shape does not need to be
        // recreated from scratch, it only needs to be invalidated.
        else if (change instanceof mxTerminalChange ||
            change instanceof mxGeometryChange) {
            // Checks if the geometry has changed to avoid unnessecary revalidation
            if (change instanceof mxTerminalChange ||
                (change.previous == null && change.geometry != null) ||
                (change.previous != null && !change.previous.equals(change.geometry))) {
                this.view.invalidate(change.cell);
            }
        }
        // Handles two special cases where only the shape, but no
        // descendants need to be recreated
        else if (change instanceof mxValueChange) {
            this.view.invalidate(change.cell, false, false);
        }
        // Requires a new mxShape in JavaScript
        else if (change instanceof mxStyleChange) {
            this.view.invalidate(change.cell, true, true);
            var state = this.view.getState(change.cell);
            if (state != null) {
                state.invalidStyle = true;
            }
        }
        // Removes the state from the cache by default
        else if (change.cell != null && change.cell instanceof mxCell) {
            this.removeStateForCell(change.cell);
        }
    }
    /**
     * Function: createGraphView
     *
     * Creates a new <mxGraphView> to be used in this graph.
     */
    createGraphView() {
        return new mxGraphView(this);
    }
    /**
     * Function: createCellRenderer
     *
     * Creates a new <ThCellRenderer> to be used in this graph.
     */
    createCellRenderer() {
        return new ThCellRenderer();
    }
    /**
     * Function: createSelectionModel
     *
     * Creates a new <ThGraphSelectionModel> to be used in this graph.
     */
    createSelectionModel() {
        return new ThGraphSelectionModel(this);
    }
    /**
     * Function: setSelectionModel
     *
     * Sets the <mxSelectionModel> that contains the selection.
     */
    setSelectionModel(selectionModel) {
        this.selectionModel = selectionModel;
    }
    /**
     * Function: setStylesheet
     *
     * Sets the <ThStylesheet> that defines the style.
     */
    setStylesheet(stylesheet) {
        this.stylesheet = stylesheet;
    }
    /**
     * Function: createStylesheet
     *
     * Creates a new <mxGraphSelectionModel> to be used in this graph.
     */
    createStylesheet() {
        return new ThStylesheet();
    }
}
