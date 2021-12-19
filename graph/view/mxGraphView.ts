import { mxCell } from './../model/mxCell';
import { mxClient, mxResources } from '../mxClient';
import { mxConstants } from '../util/mxConstants';
import { mxDictionary } from '../util/mxDictionary';
import { mxEventSource } from '../util/mxEventSource';
import { mxPoint } from '../util/mxPoint';
import { mxRectangle } from '../util/mxRectangle';
import { TGraph } from './mxGraph';
import { TGraphModel } from '../model/GraphModel';
import { mxCellState } from './mxCellState';

export class mxGraphView extends mxEventSource {


    graph: TGraph | undefined;
    translate: mxPoint;
    graphBounds: mxRectangle;
    states: mxDictionary;
    canvas!: Element;
    backgroundPane!: Element;
    drawPane!: Element;
    overlayPane!: Element;
    decoratorPane!: Element;
    currentRoot!: mxCell | null;
    updateStyle: any;
    /**
     * Function: updatingDocumentResource
     *
     * Specifies the resource key for the status message while the document is
     * being updated. If the resource for this key does not exist then the
     * value is used as the status message. Default is 'updatingDocument'.
     */
    updatingDocumentResource = (mxClient.language != 'none') ? 'updatingDocument' : '';
    lastNode: any;
    lastHtmlNode: any;
    lastForegroundNode: any;
    lastForegroundHtmlNode: any;

    scale: number = 1;


    constructor(graph?: TGraph) {
        super('mxGraphView');
        this.graph = graph;
        this.translate = new mxPoint();
        this.graphBounds = new mxRectangle();
        this.states = new mxDictionary();
    }

    revalidate() {
        this.invalidate();
        this.validate();
    }
    /**
     * Function: validate
     * 
     * Calls <validateCell> and <validateCellState> and updates the <graphBounds>
     * using <getBoundingBox>. Finally the background is validated using
     * <validateBackground>.
     * 
     * Parameters:
     * 
     * cell - Optional <mxCell> to be used as the root of the validation.
     * Default is <currentRoot> or the root of the model.
     */
    validate(cell?: mxCell) {
        // var t0 = mxLog.enter('mxGraphView.validate');
        window.status = mxResources.get(this.updatingDocumentResource) ||
            this.updatingDocumentResource;

        this.resetValidationState();


        var graphBounds = this.getBoundingBox(this.validateCellState(
            this.validateCell(cell || (this.currentRoot ?? this.graph?.getModel().getRoot()))));
        this.setGraphBounds(graphBounds ?? this.getEmptyBounds());
        this.validateBackground();

        this.resetValidationState();

        // window.status = mxResources.get(this.doneResource) ||
        //     this.doneResource;
        // mxLog.leave('mxGraphView.validate', t0);
    }

    /**
     * Function: validateBackground
     *
     * Calls <validateBackgroundImage> and <validateBackgroundPage>.
     */
    validateBackground() {
        // TODO
        // this.validateBackgroundImage();
        // this.validateBackgroundPage();
    };


    /**
     * Function: setGraphBounds
     *
     * Sets <graphBounds>.
     */
    setGraphBounds(value: any) {
        this.graphBounds = value;
    };


    /**
     * Function: getEmptyBounds
     * 
     * Returns the bounds for an empty graph. This returns a rectangle at
     * <translate> with the size of 0 x 0.
     */
    getEmptyBounds() {
        return new mxRectangle(this.translate.x * this.scale, this.translate.y * this.scale);
    };



    /**
     * Function: getBoundingBox
     * 
     * Returns the bounding box of the shape and the label for the given
     * <mxCellState> and its children if recurse is true.
     * 
     * Parameters:
     * 
     * state - <mxCellState> whose bounding box should be returned.
     * recurse - Optional boolean indicating if the children should be included.
     * Default is true.
     */
    getBoundingBox(state: any, recurse = true): any {
        recurse = (recurse != null) ? recurse : true;
        var bbox = null;

        if (state) {
            if (state.shape != null && state.shape.boundingBox != null) {
                bbox = state.shape.boundingBox.clone();
            }

            // Adds label bounding box to graph bounds
            if (state.text != null && state.text.boundingBox != null) {
                if (bbox != null) {
                    bbox.add(state.text.boundingBox);
                }
                else {
                    bbox = state.text.boundingBox.clone();
                }
            }

            if (recurse) {
                var model = this.graph?.getModel();
                if (model) {
                    var childCount = model.getChildCount(state.cell);

                    for (var i = 0; i < childCount; i++) {
                        var bounds = this.getBoundingBox(this.getState(model.getChildAt(state.cell, i)));

                        if (bounds != null) {
                            if (bbox == null) {
                                bbox = bounds;
                            }
                            else {
                                bbox.add(bounds);
                            }
                        }
                    }
                }

            }
        }

        return bbox;
    }

    /**
     * Function: validateCellState
     * 
     * Validates and repaints the <mxCellState> for the given <mxCell>.
     * 
     * Parameters:
     * 
     * cell - <mxCell> whose <mxCellState> should be validated.
     * recurse - Optional boolean indicating if the children of the cell should be
     * validated. Default is true.
     */
    validateCellState(cell: mxCell | null, recurse = true) {
        var state = null;

        if (cell) {
            state = this.getState(cell);

            if (state != null) {
                var model = this.graph?.getModel();
                if (!model) {
                    return;
                }
                //  TODO:
                if (state.invalid) {
                    state.invalid = false;

                    if (state.style == null || state.invalidStyle) {
                        state.style = this.graph?.getCellStyle(state.cell);
                        state.invalidStyle = false;
                    }

                    if (cell != this.currentRoot) {
                        this.validateCellState(model.getParent(cell), false);
                    }

                    // state.setVisibleTerminalState(this.validateCellState(this.getVisibleTerminal(cell, true), false), true);
                    // state.setVisibleTerminalState(this.validateCellState(this.getVisibleTerminal(cell, false), false), false);

                    // this.updateCellState(state);

                    // // Repaint happens immediately after the cell is validated
                    // if (cell != this.currentRoot && !state.invalid) {
                    //     this.graph.cellRenderer.redraw(state, false, this.isRendering());

                    //     // Handles changes to invertex paintbounds after update of rendering shape
                    //     state.updateCachedBounds();
                    // }
                }

                if (recurse && !state.invalid) {
                    // Updates order in DOM if recursively traversing
                    if (state.shape != null) {
                        // this.stateValidated(state);
                    }

                    var childCount = model.getChildCount(cell);

                    for (var i = 0; i < childCount; i++) {
                        this.validateCellState(model.getChildAt(cell, i));
                    }
                }
            }
        }

        return state;
    };


    /**
     * Function: validateCell
     * 
     * Recursively creates the cell state for the given cell if visible is true and
     * the given cell is visible. If the cell is not visible but the state exists
     * then it is removed using <removeState>.
     * 
     * Parameters:
     * 
     * cell - <mxCell> whose <mxCellState> should be created.
     * visible - Optional boolean indicating if the cell should be visible. Default
     * is true.
     */
    validateCell(cell: mxCell, visible = true) {

        if (cell) {
            visible = visible && this.graph.isCellVisible(cell);
            var state = this.getState(cell, visible);

            if (state && !visible) {
                this.removeState(cell);
            }
            else {
                var model = this.graph.getModel();
                var childCount = model.getChildCount(cell);

                for (var i = 0; i < childCount; i++) {
                    this.validateCell(model.getChildAt(cell, i), visible &&
                        (!this.isCellCollapsed(cell) || cell == this.currentRoot));
                }
            }
        }

        return cell;
    }

    /**
     * Function: isCellCollapsed
     * 
     * Returns true if the children of the given cell should not be visible in the
     * view. This implementation uses <mxGraph.isCellVisible> but it can be
     * overidden to use a separate condition.
     */
    isCellCollapsed(cell: mxCell) {
        return cell?.isCollapsed() ?? false;
    }


    /**
     * Function: removeState
     *
     * Removes and returns the <mxCellState> for the given cell.
     * 
     * Parameters:
     * 
     * cell - <mxCell> for which the <mxCellState> should be removed.
     */
    removeState(cell: mxCell) {
        var state = null;

        if (cell) {
            state = this.states.remove(cell);
            // TODO:
            // if (state != null) {
            //     this.graph.cellRenderer.destroy(state);
            //     state.invalid = true;
            //     state.destroy();
            // }
        }

        return state;
    };

    /**
     * Function: resetValidationState
     *
     * Resets the current validation state.
     */
    resetValidationState() {
        this.lastNode = undefined;
        this.lastHtmlNode = undefined;
        this.lastForegroundNode = undefined;
        this.lastForegroundHtmlNode = undefined;
    }

    /**
     * Function: invalidate
     * 
     * Invalidates the state of the given cell, all its descendants and
     * connected edges.
     * 
     * Parameters:
     * 
     * cell - Optional <mxCell> to be invalidated. Default is the root of the
     * model.
     */
    invalidate(cell?: mxCell, recurse = true, includeEdges = true) {
        let model = this.graph.getModel();
        cell = cell || model.getRoot();

        let state = this.getState(cell);

        if (state) {
            state.invalid = true;
        }

        // Avoids infinite loops for invalid graphs
        if (cell && !cell.invalidating) {
            cell.invalidating = true;

            // Recursively invalidates all descendants
            if (recurse) {
                var childCount = model.getChildCount(cell);

                for (var i = 0; i < childCount; i++) {
                    var child = model.getChildAt(cell, i);
                    this.invalidate(child, recurse, includeEdges);
                }
            }

            // Propagates invalidation to all connected edges
            if (includeEdges) {
                var edgeCount = model.getEdgeCount(cell);

                for (var i = 0; i < edgeCount; i++) {
                    this.invalidate(model.getEdgeAt(cell, i), recurse, includeEdges);
                }
            }

            cell.invalidating = false;
        }
    }

    /**
     * Function: getState
     *
     * Returns the <mxCellState> for the given cell. If create is true, then
     * the state is created if it does not yet exist.
     * 
     * Parameters:
     * 
     * cell - <mxCell> for which the <mxCellState> should be returned.
     * create - Optional boolean indicating if a new state should be created
     * if it does not yet exist. Default is false.
     */
    getState(cell: mxCell | undefined, create = false): any {

        let state;

        if (cell) {
            state = this.states.get(cell);

            if (create && (!state || this.updateStyle) && this.graph?.isCellVisible(cell)) {
                if (!state) {
                    state = this.createState(cell);
                    this.states.put(cell, state);
                }
                else {
                    state.style = this.graph.getCellStyle(cell);
                }
            }
        }

        return state;
    }
    init() {
        // this.installListeners();

        // Creates the DOM nodes for the respective display dialect
        var graph = this.graph;
        if (!graph) {
            return;
        }

        if (graph.dialect == mxConstants.DIALECT_SVG) {
            this.createSvg();
        }
    }
    /**
     * Function: createState
     *
     * Creates and returns an <mxCellState> for the given cell and initializes
     * it using <mxCellRenderer.initialize>.
     * 
     * Parameters:
     * 
     * cell - <mxCell> for which a new <mxCellState> should be created.
     */
    createState(cell:mxCell) {
        return new mxCellState(this, cell, this.graph?.getCellStyle(cell));
    };

    createSvg() {

        var container = this.graph.container;
        this.canvas = document.createElementNS(mxConstants.NS_SVG, 'g');

        // For background image
        this.backgroundPane = document.createElementNS(mxConstants.NS_SVG, 'g');
        this.canvas.appendChild(this.backgroundPane);

        // Adds two layers (background is early feature)
        this.drawPane = document.createElementNS(mxConstants.NS_SVG, 'g');
        this.canvas.appendChild(this.drawPane);

        this.overlayPane = document.createElementNS(mxConstants.NS_SVG, 'g');
        this.canvas.appendChild(this.overlayPane);

        this.decoratorPane = document.createElementNS(mxConstants.NS_SVG, 'g');
        this.canvas.appendChild(this.decoratorPane);

        var root = document.createElementNS(mxConstants.NS_SVG, 'svg') as SVGElement;
        root.style.left = '0px';
        root.style.top = '0px';
        root.style.width = '100%';
        root.style.height = '100%';

        // NOTE: In standards mode, the SVG must have block layout
        // in order for the container DIV to not show scrollbars.
        root.style.display = 'block';
        root.appendChild(this.canvas);


        if (container) {
            container?.appendChild(root);
            this.updateContainerStyle(container);
        }

    }
    updateContainerStyle(container: HTMLElement) {

    }
}