
import { ThUtils } from "../util/ThUtils"


import { ThCellRenderer } from './ThCellRenderer';
import { ThGraphModel } from './../model/ThGraphModel';
import { ThConstants } from '../util/ThConstants';
import { ThEventSource } from './../event/ThEventSource';
import { ThGraphSelectionModel } from './ThGraphSelectionModel'
import { ThStylesheet } from './ThStylesheet';
import { ThEvent } from "../event/ThEvent";


export class ThGraph extends ThEventSource {
    /**
     * Variable: mouseListeners
     *
     * Holds the mouse event listeners. See <fireMouseEvent>.
     */
    mouseListeners: any[] = [];

    /**
     * Variable: renderHint
     *
     * RenderHint as it was passed to the constructor.
     */
    renderHint: string;


    /**
     * Variable: dialect
     *
     * Dialect to be used for drawing the graph. Possible values are all
     * constants in <ThConstants> with a DIALECT-prefix.
     */
    dialect: string;


    /**
     * Variable: model
     *
     * Holds the <ThGraphModel> that contains the cells to be displayed.
     */
    model: Optional<ThGraphModel>;

    /**
     * Variable: multiplicities
     *
     * An array of <mxMultiplicities> describing the allowed
     * connections in a graph.
     */
    multiplicities: any[] = [];

    /**
     * Variable: imageBundles
     *
     * Holds the list of image bundles.
     */
    imageBundles: any[] = [];

    /**
     * Variable: cellRenderer
     *
     * Holds the <mxCellRenderer> for rendering the cells in the graph.
     */
    cellRenderer: ThCellRenderer;

    selectionModel!: ThGraphSelectionModel;
    stylesheet!: ThStylesheet;
    view: any;


    graphModelChangeListener = (evt) => {
        this.graphModelChanged(evt.getProperty('edit').changes);
    }
    selectionCellsHandler: any;
    graphHandler: any;

    constructor(container: HTMLElement, model?: ThGraphModel, renderHint?: string, stylesheet?: ThStylesheet) {
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
        this.setStylesheet(
            stylesheet ?? this.createStylesheet(),
        );
        this.view = this.createGraphView();

        // Adds a graph model listener to update the view
        this.graphModelChangeListener = ThUtils.bind(this, function (sender, evt) {
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
     * Function: createHandlers
     *
     * Creates the tooltip-, panning-, connection- and graph-handler (in this
     * order). This is called in the constructor before <init> is called.
     */
    createHandlers() {
        // TODO!
        // this.tooltipHandler = this.createTooltipHandler();
        // this.tooltipHandler.setEnabled(false);
        this.selectionCellsHandler = this.createSelectionCellsHandler();
        // this.connectionHandler = this.createConnectionHandler();
        // this.connectionHandler.setEnabled(false);
        this.graphHandler = this.createGraphHandler();
        // this.panningHandler = this.createPanningHandler();
        // this.panningHandler.panningEnabled = false;
        // this.popupMenuHandler = this.createPopupMenuHandler();
    }

    /**
     * Function: createGraphHandler
     *
     * Creates and returns a new <mxGraphHandler> to be used in this graph.
     */
    createGraphHandler() {
        return new mxGraphHandler(this);
    }

    /**
     * Function: createSelectionCellsHandler
     *
     * Creates and returns a new <mxTooltipHandler> to be used in this graph.
     */
    createSelectionCellsHandler() {
        return new mxSelectionCellsHandler(this);
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
    graphModelChanged(changes: any[]) {
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
        else if (
            change instanceof mxTerminalChange ||
            change instanceof mxGeometryChange
        ) {
            // Checks if the geometry has changed to avoid unnessecary revalidation
            if (
                change instanceof mxTerminalChange ||
                (change.previous == null && change.geometry != null) ||
                (change.previous != null && !change.previous.equals(change.geometry))
            ) {
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
    createCellRenderer(): ThCellRenderer {
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
    setSelectionModel(selectionModel: ThGraphSelectionModel) {
        this.selectionModel = selectionModel;
    }

    /**
     * Function: setStylesheet
     *
     * Sets the <ThStylesheet> that defines the style.
     */
    setStylesheet(stylesheet: ThStylesheet) {
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