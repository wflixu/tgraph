
import { mxCellRenderer } from './mxCellRenderer';
import { mxRootChange, TGraphModel } from "../model/GraphModel";
import { mxConstants } from "../util/mxConstants";
import { mxGraphSelectionModel } from './mxGraphSelectionModel';
import { mxStylesheet } from './mxStylesheet';
import { mxGraphView } from './mxGraphView';
import { mxUtils } from '../util/mxUtils';
import { mxEvent } from '../util/mxEvent';
import { mxCellEditor } from './mxCellEditor';
import { mxCell } from '../model/mxCell';
import { mxGeometry } from '../model/mxGeometry';
import { mxEventObject } from '../util/mxEventObject';

export class TGraph {

    mouseListeners: any;
    renderHint: any;
    model: TGraphModel;
    multiplicities: any[];
    imageBundles: any[];
    dialect: string | number = mxConstants.DIALECT_SVG;

    cellRenderer: mxCellRenderer;
    selectionModel: any;
    stylesheet: mxStylesheet;
    view: mxGraphView;
    container!: HTMLElement | null;
    cellEditor: mxCellEditor | undefined;

    isMouseDown: boolean = false;
    defaultParent: mxCell | null = null;


    constructor(container?: HTMLElement | string, model?: TGraphModel, renderHint?: any,
        stylesheet?: mxStylesheet) {
        this.renderHint = renderHint ?? null;

        this.model = model ?? new TGraphModel(null);
        this.multiplicities = [];
        this.imageBundles = [];
        this.cellRenderer = this.createCellRenderer();
        this.setSelectionModel(this.createSelectionModel());
        this.stylesheet = new mxStylesheet();
        this.view = this.createGraphView();




        this.model.addListener(mxEvent.CHANGE, this.graphModelChangeListener);

        // Installs basic event handlers with disabled default settings.
        this.createHandlers();

        if (container) {
            if (typeof container == 'string') {
                this.container = document.querySelector(container);
            } else {
                this.container = container;
            }
            this.init(this.container!);
        }

        this.view.revalidate();
    }

    graphModelChangeListener(sender: any, evt: any) {
        this.graphModelChanged(evt.getProperty('edit').changes);
    }



    insertEdge(parent: mxCell | null, id: string = '1', value: any, source: mxCell, target: mxCell, style: string = '') {
        let edge = this.createEdge(parent, id, value, source, target, style);

        return this.addEdge(edge, parent, source, target);
    }


    /**
     * Function: isCellVisible
     * 
     * Returns true if the given cell is visible in this graph. This
     * implementation uses <mxGraphModel.isVisible>. Subclassers can override
     * this to implement specific visibility for cells in only one graph, that
     * is, without affecting the visible state of the cell.
     * 
     * When using dynamic filter expressions for cell visibility, then the
     * graph should be revalidated after the filter expression has changed.
     * 
     * Parameters:
     * 
     * cell - <mxCell> whose visible state should be returned.
     */
    isCellVisible(cell: mxCell) {
        return this.model.isVisible(cell);
    };

    /**
     * Function: createEdge
     * 
     * Hook method that creates the new edge for <insertEdge>. This
     * implementation does not set the source and target of the edge, these
     * are set when the edge is added to the model.
     * 
     */
    createEdge(parent: mxCell | null, id: string, value: any, source: mxCell, target: mxCell, style: string): mxCell {
        // Creates the edge
        var edge = new mxCell(value, new mxGeometry(0, 0, 0, 0), style);
        edge.setId(id);
        edge.setEdge(true);
        edge.geometry!.relative = true;

        return edge;
    }



    /**
     * Function: addEdge
     * 
     * Adds the edge to the parent and connects it to the given source and
     * target terminals. This is a shortcut method. Returns the edge that was
     * added.
     * 
     * Parameters:
     * 
     * edge - <mxCell> to be inserted into the given parent.
     * parent - <mxCell> that represents the new parent. If no parent is
     * given then the default parent is used.
     * source - Optional <mxCell> that represents the source terminal.
     * target - Optional <mxCell> that represents the target terminal.
     * index - Optional index to insert the cells at. Default is to append.
     */
    addEdge(edge: mxCell, parent: mxCell | null, source: mxCell | undefined,
        target: mxCell | undefined, index: number = 0) {
        return this.addCell(edge, parent!, index, source, target);
    }



    /**
     * Function: init
     * 
     * Initializes the <container> and creates the respective datastructures.
     * 
     * Parameters:
     * 
     * container - DOM node that will contain the graph display.
     */
    init(container: HTMLElement) {


        // Initializes the in-place editor
        this.cellEditor = this.createCellEditor();

        // Initializes the container using the view
        this.view.init();

        // Updates the size of the container for the current graph
        // this.sizeDidChange();

        // // Hides tooltips and resets tooltip timer if mouse leaves container
        // mxEvent.addListener(container, 'mouseleave', mxUtils.bind(this, function (evt) {
        //     if (this.tooltipHandler != null && this.tooltipHandler.div != null &&
        //         this.tooltipHandler.div != evt.relatedTarget) {
        //         this.tooltipHandler.hide();
        //     }
        // }));

    }

    createCellEditor() {
        return new mxCellEditor(this);
    }

    /**
     * Function: setDefaultParent
     * 
     * Sets the <defaultParent> to the given cell. Set this to null to return
     * the first child of the root in getDefaultParent.
     */
    setDefaultParent(cell: mxCell|null) {
        this.defaultParent = cell;
    }


    /**
     * Function: getDefaultParent
     * 
     * Returns <defaultParent> or <mxGraphView.currentRoot> or the first child
     * child of <mxGraphModel.root> if both are null. The value returned by
     * this function should be used as the parent for new cells (aka default
     * layer).
     */
    getDefaultParent() {
        let parent = this.getCurrentRoot();

        if (parent == null) {
            parent = this.defaultParent;

            if (parent == null) {
                var root = this.model.getRoot(null);
                parent = this.model.getChildAt(root, 0);
            }
        }

        return parent;
    }



    /**
     * Function: getModel
     * 
     * Returns the <mxGraphModel> that contains the cells.
     */
    getModel() {
        return this.model;
    }


    /**
     * Function: getCurrentRoot
     * 
     * Returns the current root of the displayed cell hierarchy. This is a
     * shortcut to <mxGraphView.currentRoot> in <view>.
     */
    getCurrentRoot() {
        return this.view.currentRoot;
    }


    /**
     * Function: insertVertex
     * 
     * Adds a new vertex into the given parent <mxCell> using value as the user
     * object and the given coordinates as the <mxGeometry> of the new vertex.
     * The id and style are used for the respective properties of the new
     * <mxCell>, which is returned.
     *
     * When adding new vertices from a mouse event, one should take into
     * account the offset of the graph container and the scale and translation
     * of the view in order to find the correct unscaled, untranslated
     * coordinates using <mxGraph.getPointForEvent> as follows:
     * 
     * (code)
     * var pt = graph.getPointForEvent(evt);
     * var parent = graph.getDefaultParent();
     * graph.insertVertex(parent, null,
     * 			'Hello, World!', x, y, 220, 30);
     * (end)
     * 
     * For adding image cells, the style parameter can be assigned as
     * 
     * (code)
     * stylename;image=imageUrl
     * (end)
     * 
     * See <mxGraph> for more information on using images.
     *
     * Parameters:
     * 
     * parent - <mxCell> that specifies the parent of the new vertex.
     * id - Optional string that defines the Id of the new vertex.
     * value - Object to be used as the user object.
     * x - Integer that defines the x coordinate of the vertex.
     * y - Integer that defines the y coordinate of the vertex.
     * width - Integer that defines the width of the vertex.
     * height - Integer that defines the height of the vertex.
     * style - Optional string that defines the cell style.
     * relative - Optional boolean that specifies if the geometry is relative.
     * Default is false.
     */
    insertVertex(parent: mxCell, id: string | null, value: any,
        x: number, y: number, width: number, height: number, style?: string, relative?: boolean) {
        var vertex = this.createVertex(parent, id, value, x, y, width, height, style, relative);

        return this.addCell(vertex, parent);
    }

    /**
     * Function: addCell
     * 
     * Adds the cell to the parent and connects it to the given source and
     * target terminals. This is a shortcut method. Returns the cell that was
     * added.
     * 
     * Parameters:
     * 
     * cell - <mxCell> to be inserted into the given parent.
     * parent - <mxCell> that represents the new parent. If no parent is
     * given then the default parent is used.
     * index - Optional index to insert the cells at. Default is to append.
     * source - Optional <mxCell> that represents the source terminal.
     * target - Optional <mxCell> that represents the target terminal.
     */
    addCell(cell: mxCell, parent: mxCell, index?: number, source?: mxCell, target?: mxCell) {
        return this.addCells([cell], parent, index, source, target, undefined)[0];
    }


    /**
     * Function: addCells
     * 
     * Adds the cells to the parent at the given index, connecting each cell to
     * the optional source and target terminal. The change is carried out using
     * <cellsAdded>. This method fires <mxEvent.ADD_CELLS> while the
     * transaction is in progress. Returns the cells that were added.
     * 
     * Parameters:
     * 
     * cells - Array of <mxCells> to be inserted.
     * parent - <mxCell> that represents the new parent. If no parent is
     * given then the default parent is used.
     * index - Optional index to insert the cells at. Default is to append.
     * source - Optional source <mxCell> for all inserted cells.
     * target - Optional target <mxCell> for all inserted cells.
     * absolute - Optional boolean indicating of cells should be kept at
     * their absolute position. Default is false.
     */
    addCells(cells: mxCell[], parent: mxCell | null, index: number | undefined,
        source: mxCell | undefined, target: mxCell | undefined, absolute: boolean = false) {
        if (parent == null) {
            parent = this.getDefaultParent();
        }

        if (index == null) {
            index = parent?.getChildCount() ?? 0;
        }

        this.model.beginUpdate();
        try {
            this.cellsAdded(cells, parent, index, source, target, absolute ?? false, true);
            // this.fireEvent(new mxEventObject(mxEvent.ADD_CELLS, 'cells', cells,
            //     'parent', parent, 'index', index, 'source', source, 'target', target));
        }
        finally {
            this.model.endUpdate();
        }

        return cells;
    }


    /**
     * Function: cellsAdded
     * 
     * Adds the specified cells to the given parent. This method fires
     * <mxEvent.CELLS_ADDED> while the transaction is in progress.
     */
    cellsAdded(cells: mxCell[], parent: mxCell | null, index: number, source: mxCell | undefined, target: mxCell | undefined, absolute: boolean, constrain: boolean, extend?: undefined) {
        // TODO 
        // if (cells != null && parent != null && index != null) {
        //     this.model.beginUpdate();
        //     try {
        //         var parentState = (absolute) ? this.view.getState(parent) : null;
        //         var o1 = (parentState != null) ? parentState.origin : null;
        //         var zero = new mxPoint(0, 0);

        //         for (var i = 0; i < cells.length; i++) {
        //             if (cells[i] == null) {
        //                 index--;
        //             }
        //             else {
        //                 var previous = this.model.getParent(cells[i]);

        //                 // Keeps the cell at its absolute location
        //                 if (o1 != null && cells[i] != parent && parent != previous) {
        //                     var oldState = this.view.getState(previous);
        //                     var o2 = (oldState != null) ? oldState.origin : zero;
        //                     var geo = this.model.getGeometry(cells[i]);

        //                     if (geo != null) {
        //                         var dx = o2.x - o1.x;
        //                         var dy = o2.y - o1.y;

        //                         // FIXME: Cells should always be inserted first before any other edit
        //                         // to avoid forward references in sessions.
        //                         geo = geo.clone();
        //                         geo.translate(dx, dy);

        //                         if (!geo.relative && this.model.isVertex(cells[i]) &&
        //                             !this.isAllowNegativeCoordinates()) {
        //                             geo.x = Math.max(0, geo.x);
        //                             geo.y = Math.max(0, geo.y);
        //                         }

        //                         this.model.setGeometry(cells[i], geo);
        //                     }
        //                 }

        //                 // Decrements all following indices
        //                 // if cell is already in parent
        //                 if (parent == previous && index + i > this.model.getChildCount(parent)) {
        //                     index--;
        //                 }

        //                 this.model.add(parent, cells[i], index + i);

        //                 if (this.autoSizeCellsOnAdd) {
        //                     this.autoSizeCell(cells[i], true);
        //                 }

        //                 // Extends the parent or constrains the child
        //                 if ((extend == null || extend) &&
        //                     this.isExtendParentsOnAdd(cells[i]) && this.isExtendParent(cells[i])) {
        //                     this.extendParent(cells[i]);
        //                 }

        //                 // Additionally constrains the child after extending the parent
        //                 if (constrain == null || constrain) {
        //                     this.constrainChild(cells[i]);
        //                 }

        //                 // Sets the source terminal
        //                 if (source != null) {
        //                     this.cellConnected(cells[i], source, true);
        //                 }

        //                 // Sets the target terminal
        //                 if (target != null) {
        //                     this.cellConnected(cells[i], target, false);
        //                 }
        //             }
        //         }

        //         this.fireEvent(new mxEventObject(mxEvent.CELLS_ADDED, 'cells', cells,
        //             'parent', parent, 'index', index, 'source', source, 'target', target,
        //             'absolute', absolute));
        //     }
        //     finally {
        //         this.model.endUpdate();
        //     }
        // }
    }


    /**
     * Function: createVertex
     * 
     * Hook method that creates the new vertex for <insertVertex>.
     */
    createVertex(parent: mxCell, id: string | null, value: any,
        x: number, y: number, width: number, height: number, style: string | undefined, relative: boolean | null | undefined) {
        // Creates the geometry for the vertex
        var geometry = new mxGeometry(x, y, width, height);
        geometry.relative = (relative != null) ? relative : false;

        // Creates the vertex
        var vertex = new mxCell(value, geometry, style);
        vertex.setId(id);
        vertex.setVertex(true);
        vertex.setConnectable(true);

        return vertex;
    }

    /**
     * Function: createHandlers
     * 
     * Creates the tooltip-, panning-, connection- and graph-handler (in this
     * order). This is called in the constructor before <init> is called.
     */
    createHandlers() {
        // this.tooltipHandler = this.createTooltipHandler();
        // this.tooltipHandler.setEnabled(false);
        // this.selectionCellsHandler = this.createSelectionCellsHandler();
        // this.connectionHandler = this.createConnectionHandler();
        // this.connectionHandler.setEnabled(false);
        // this.graphHandler = this.createGraphHandler();
        // this.panningHandler = this.createPanningHandler();
        // this.panningHandler.panningEnabled = false;
        // this.popupMenuHandler = this.createPopupMenuHandler();
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
    graphModelChanged(changes: any) {
        for (var i = 0; i < changes.length; i++) {
            // TODO
            this.processChange(changes[i]);
        }



        this.updateSelection();
        this.view.validate();
        // this.sizeDidChange();
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
        else if (change instanceof mxTerminalChange || change instanceof mxGeometryChange) {
            // Checks if the geometry has changed to avoid unnessecary revalidation
            if (change instanceof mxTerminalChange || ((change.previous == null && change.geometry != null) ||
                (change.previous != null && !change.previous.equals(change.geometry)))) {
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
    };

    /**
     * Function: clearSelection
     * 
     * Clears the selection using <mxGraphSelectionModel.clear>.
     */
    clearSelection() {
        return this.getSelectionModel().clear();
    };

    /**
     * Function: getSelectionModel
     * 
     * Returns the <mxGraphSelectionModel> that contains the selection.
     */
    getSelectionModel() {
        return this.selectionModel;
    };



    /**
     * Function: getCellStyle
     * 
     * Returns an array of key, value pairs representing the cell style for the
     * given cell. If no string is defined in the model that specifies the
     * style, then the default style for the cell is returned or an empty object,
     * if no style can be found. Note: You should try and get the cell state
     * for the given cell and use the cached style in the state before using
     * this method.
     * 
     * Parameters:
     * 
     * cell - <mxCell> whose style should be returned as an array.
     */
    getCellStyle(cell: mxCell) {
        // var stylename = this.model.getStyle(cell);
        var style = null;

        // // Gets the default style for the cell
        // if (this.model.isEdge(cell)) {
        //     style = this.stylesheet.getDefaultEdgeStyle();
        // }
        // else {
        //     style = this.stylesheet.getDefaultVertexStyle();
        // }

        // // Resolves the stylename using the above as the default
        // if (stylename != null) {
        //     style = this.postProcessCellStyle(this.stylesheet.getCellStyle(stylename, style));
        // }

        // Returns a non-null value if no style can be found
        if (style == null) {
            style = new Object();
        }

        return style;
    };


    /**
     * Function: updateSelection
     * 
     * Removes selection cells that are not in the model from the selection.
     */
    updateSelection() {
        // var cells = this.getSelectionCells();
        // var removed = [];

        // for (var i = 0; i < cells.length; i++) {
        //     if (!this.model.contains(cells[i]) || !this.isCellVisible(cells[i])) {
        //         removed.push(cells[i]);
        //     }
        //     else {
        //         var par = this.model.getParent(cells[i]);

        //         while (par != null && par != this.view.currentRoot) {
        //             if (this.isCellCollapsed(par) || !this.isCellVisible(par)) {
        //                 removed.push(cells[i]);
        //                 break;
        //             }

        //             par = this.model.getParent(par);
        //         }
        //     }
        // }

        // this.removeSelectionCells(removed);
    };

    createCellRenderer() {
        return new mxCellRenderer();
    }

    setSelectionModel(val: mxGraphSelectionModel) {
        this.selectionModel = val;
    }
    createSelectionModel() {
        return new mxGraphSelectionModel(this)
    }
    setStylesheet(stylesheet: mxStylesheet) {
        this.stylesheet = stylesheet;
    }
    createStylesheet() {
        return new mxStylesheet();
    }
    createGraphView(): mxGraphView {
        return new mxGraphView(this);
    }
}