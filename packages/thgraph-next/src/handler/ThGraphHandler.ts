import { ThGraph } from "../view";
import { ThEvent } from '../event/ThEvent'

export class ThGraphHandler {
    /**
     * Variable: graph
     *
     * Reference to the enclosing <mxGraph>.
     */
    graph = null;
    suspended = false;
    livePreviewUsed: boolean = false;

    /**
     * Variable: maxCells
     *
     * Defines the maximum number of cells to paint subhandles
     * for. Default is 50 for Firefox and 20 for IE. Set this
     * to 0 if you want an unlimited number of handles to be
     * displayed. This is only recommended if the number of
     * cells in the graph is limited to a small number, eg.
     * 500.
     */
    maxCells = 50;
    refreshThread: any;

    refreshHandler = (sender, evt) => { };
    keyHandler = (e) => { };

    constructor(graph: ThGraph) {
        this.graph = graph;
        this.graph.addMouseListener(this);



        this.graph.addListener(ThEvent.PAN, this.panHandler);

        this.escapeHandler = (sender, evt) => {
            this.reset();
        };

        this.graph.addListener(ThEvent.ESCAPE, this.escapeHandler);

        // Updates the preview box for remote changes
        this.refreshHandler = (sender, evt) => {
            // Merges multiple pending calls
            if (this.refreshThread) {
                window?.clearTimeout(this.refreshThread);
            }

            // Waits for the states and handlers to be updated
            this.refreshThread = window?.setTimeout(
                () => {
                    this.refreshThread = null;

                    if (this.first != null && !this.suspended) {
                        // Updates preview with no translate to compute bounding box
                        var dx = this.currentDx;
                        var dy = this.currentDy;
                        this.currentDx = 0;
                        this.currentDy = 0;
                        this.updatePreview();
                        this.bounds = this.graph.getView().getBounds(this.cells);
                        this.pBounds = this.getPreviewBounds(this.cells);

                        if (this.pBounds == null && !this.livePreviewUsed) {
                            this.reset();
                        } else {
                            // Restores translate and updates preview
                            this.currentDx = dx;
                            this.currentDy = dy;
                            this.updatePreview();
                            this.updateHint();

                            if (this.livePreviewUsed) {
                                // Forces update to ignore last visible state
                                this.setHandlesVisibleForCells(
                                    this.graph.selectionCellsHandler.getHandledSelectionCells(),
                                    false,
                                    true,
                                );
                                this.updatePreview();
                            }
                        }
                    }
                },
                0,
            );
        };

        this.graph.getModel().addListener(ThEvent.CHANGE, this.refreshHandler);
        this.graph.addListener(ThEvent.REFRESH, this.refreshHandler);

        this.keyHandler = (e) => {
            if (
                this.graph.container != null &&
                this.graph.container.style.visibility != 'hidden' &&
                this.first != null &&
                !this.suspended
            ) {
                var clone =
                    this.graph.isCloneEvent(e) &&
                    this.graph.isCellsCloneable() &&
                    this.isCloneEnabled();

                if (clone != this.cloning) {
                    this.cloning = clone;
                    this.checkPreview();
                    this.updatePreview();
                }
            }
        };
        document.addEventListener('keydown', this.keyHandler);
        document.addEventListener('keyup', this.keyHandler);

    }


    /**
     * Function: reset
     *
     * Resets the state of this handler.
     */
    reset() {
        if (this.livePreviewUsed) {
            this.resetLivePreview();
            this.setHandlesVisibleForCells(
                this.graph.selectionCellsHandler.getHandledSelectionCells(),
                true,
            );
        }

        this.destroyShapes();
        this.removeHint();

        this.delayedSelection = false;
        this.livePreviewActive = null;
        this.livePreviewUsed = null;
        this.cellWasClicked = false;
        this.suspended = null;
        this.currentDx = null;
        this.currentDy = null;
        this.cellCount = null;
        this.cloning = false;
        this.allCells = null;
        this.pBounds = null;
        this.guides = null;
        this.target = null;
        this.first = null;
        this.cells = null;
        this.cell = null;
    };


    // Repaints the handler after autoscroll
    panHandler() {
        if (!this.suspended) {
            this.updatePreview();
            this.updateHint();
        }
    }

    // Handles escape keystrokes
    escapeHandler(sender, evt) {
        this.reset();
    };

    /**
     * Function: updatePreview
     *
     * Updates the bounds of the preview shape.
     */
    updatePreview(remote?: boolean) {
        if (this.livePreviewUsed && !remote) {
            if (this.cells != null) {
                this.setHandlesVisibleForCells(
                    this.graph.selectionCellsHandler.getHandledSelectionCells(),
                    false,
                );
                this.updateLivePreview(this.currentDx, this.currentDy);
            }
        } else {
            this.updatePreviewShape();
        }
    }

}