import { ThGraph } from './ThGraph';
/**
 * Class: ThGraphView
 *
 * Extends <mxEventSource> to implement a view for a graph. This class is in
 * charge of computing the absolute coordinates for the relative child
 * geometries, the points for perimeters and edge styles and keeping them
 * cached in <mxCellStates> for faster retrieval. The states are updated
 * whenever the model or the view state (translate, scale) changes. The scale
 * and translate are honoured in the bounds.
 *
 * Event: ThEvent.UNDO
 *
 * Fires after the root was changed in <setCurrentRoot>. The <code>edit</code>
 * property contains the <mxUndoableEdit> which contains the
 * <mxCurrentRootChange>.
 *
 * Event: ThEvent.SCALE_AND_TRANSLATE
 *
 * Fires after the scale and translate have been changed in <scaleAndTranslate>.
 * The <code>scale</code>, <code>previousScale</code>, <code>translate</code>
 * and <code>previousTranslate</code> properties contain the new and previous
 * scale and translate, respectively.
 *
 * Event: ThEvent.SCALE
 *
 * Fires after the scale was changed in <setScale>. The <code>scale</code> and
 * <code>previousScale</code> properties contain the new and previous scale.
 *
 * Event: ThEvent.TRANSLATE
 *
 * Fires after the translate was changed in <setTranslate>. The
 * <code>translate</code> and <code>previousTranslate</code> properties contain
 * the new and previous value for translate.
 *
 * Event: ThEvent.DOWN and ThEvent.UP
 *
 * Fire if the current root is changed by executing an <mxCurrentRootChange>.
 * The event name depends on the location of the root in the cell hierarchy
 * with respect to the current root. The <code>root</code> and
 * <code>previous</code> properties contain the new and previous root,
 * respectively.
 *
 * Constructor: ThGraphView
 *
 * Constructs a new view for the given <mxGraph>.
 *
 * Parameters:
 *
 * graph - Reference to the enclosing <mxGraph>.
 */
import { ThEventSource } from '../event/ThEventSource.js';
import { ThPoint } from '../util/ThPoint';
import { ThRectangle } from '../util/ThRectangle';
export declare class ThGraphView extends ThEventSource {
    /**
     *
     */
    EMPTY_POINT: ThPoint;
    /**
     * Variable: doneResource
     *
     * Specifies the resource key for the status message after a long operation.
     * If the resource for this key does not exist then the value is used as
     * the status message. Default is 'done'.
     */
    doneResource: string;
    /**
     * Function: updatingDocumentResource
     *
     * Specifies the resource key for the status message while the document is
     * being updated. If the resource for this key does not exist then the
     * value is used as the status message. Default is 'updatingDocument'.
     */
    updatingDocumentResource: string;
    /**
     * Variable: allowEval
     *
     * Specifies if string values in cell styles should be evaluated using
     * <mxUtils.eval>. This will only be used if the string values can't be mapped
     * to objects using <mxStyleRegistry>. Default is false. NOTE: Enabling this
     * switch carries a possible security risk.
     */
    allowEval: boolean;
    /**
     * Variable: captureDocumentGesture
     *
     * Specifies if a gesture should be captured when it goes outside of the
     * graph container. Default is true.
     */
    captureDocumentGesture: boolean;
    /**
     * Variable: optimizeVmlReflows
     *
     * Specifies if the <canvas> should be hidden while rendering in IE8 standards
     * mode and quirks mode. This will significantly improve rendering performance.
     * Default is true.
     */
    optimizeVmlReflows: boolean;
    /**
     * Variable: rendering
     *
     * Specifies if shapes should be created, updated and destroyed using the
     * methods of <mxCellRenderer> in <graph>. Default is true.
     */
    rendering: boolean;
    /**
     * Variable: graph
     *
     * Reference to the enclosing <mxGraph>.
     */
    graph: ThGraph;
    /**
     * Variable: currentRoot
     *
     * <mxCell> that acts as the root of the displayed cell hierarchy.
     */
    currentRoot: null;
    /**
     * Variable: graphBounds
     *
     * <ThRectangle> that caches the scales, translated bounds of the current view.
     */
    graphBounds: ThRectangle;
    /**
     * Variable: scale
     *
     * Specifies the scale. Default is 1 (100%).
     */
    scale: number;
    /**
     * Variable: translate
     *
     * <ThPoint> that specifies the current translation. Default is a new
     * empty <ThPoint>.
     */
    translate: ThPoint;
    /**
     * Variable: states
     *
     * <mxDictionary> that maps from cell IDs to <mxCellStates>.
     */
    states: Map<string, any>;
    /**
     * Variable: updateStyle
     *
     * Specifies if the style should be updated in each validation step. If this
     * is false then the style is only updated if the state is created or if the
     * style of the cell was changed. Default is false.
     */
    updateStyle: boolean;
    /**
     * Variable: lastNode
     *
     * During validation, this contains the last DOM node that was processed.
     */
    lastNode: any;
    /**
     * Variable: lastHtmlNode
     *
     * During validation, this contains the last HTML DOM node that was processed.
     */
    lastHtmlNode: any;
    /**
     * Variable: lastForegroundNode
     *
     * During validation, this contains the last edge's DOM node that was processed.
     */
    lastForegroundNode: null;
    /**
     * Variable: lastForegroundHtmlNode
     *
     * During validation, this contains the last edge HTML DOM node that was processed.
     */
    lastForegroundHtmlNode: null;
    constructor(graph: ThGraph);
    /**
     * Function: getGraphBounds
     *
     * Returns <graphBounds>.
     */
    getGraphBounds(): ThRectangle;
    /**
     * Function: setGraphBounds
     *
     * Sets <graphBounds>.
     */
    setGraphBounds(value: ThRectangle): void;
}
