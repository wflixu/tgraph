
/**
 *
 * Class: mxCellStatePreview
 * 
 * Implements a live preview for moving cells.
 * 
 * Constructor: mxCellStatePreview
 * 
 * Constructs a move preview for the given graph.
 * 
 * Parameters:
 * 
 * graph - Reference to the enclosing <mxGraph>.
 */

import { mxDictionary } from "../util/mxDictionary.js";
import { mxPoint } from "../util/mxPoint.js";
import { mxUtils } from "../util/mxUtils.js";

export class mxCellStatePreview {

    /**
     * Variable: graph
     * 
     * Reference to the enclosing <mxGraph>.
     */
    graph = null;

    /**
     * Variable: deltas
     * 
     * Reference to the enclosing <mxGraph>.
     */
    deltas = null;

    /**
     * Variable: count
     * 
     * Contains the number of entries in the map.
     */
    count = 0;

    constructor(graph) {
        this.deltas = new mxDictionary();
        this.graph = graph;
    }


    /**
     * Function: isEmpty
     * 
     * Returns true if this contains no entries.
     */
    isEmpty() {
        return this.count == 0;
    };

    /**
     * Function: moveState
     */
    moveState(state, dx, dy, add, includeEdges) {
        add = (add != null) ? add : true;
        includeEdges = (includeEdges != null) ? includeEdges : true;

        var delta = this.deltas.get(state.cell);

        if (delta == null) {
            // Note: Deltas stores the point and the state since the key is a string.
            delta = { point: new mxPoint(dx, dy), state: state };
            this.deltas.put(state.cell, delta);
            this.count++;
        }
        else if (add) {
            delta.point.x += dx;
            delta.point.y += dy;
        }
        else {
            delta.point.x = dx;
            delta.point.y = dy;
        }

        if (includeEdges) {
            this.addEdges(state);
        }

        return delta.point;
    };

    /**
     * Function: show
     */
    show(visitor) {
        this.deltas.visit((key, delta) => {
            this.translateState(delta.state, delta.point.x, delta.point.y);
        });

        this.deltas.visit((key, delta) => {
            this.revalidateState(delta.state, delta.point.x, delta.point.y, visitor);
        });
    };

    /**
     * Function: translateState
     */
    translateState(state, dx, dy) {
        if (state != null) {
            var model = this.graph.getModel();

            if (model.isVertex(state.cell)) {
                state.view.updateCellState(state);
                var geo = model.getGeometry(state.cell);

                // Moves selection cells and non-relative vertices in
                // the first phase so that edge terminal points will
                // be updated in the second phase
                if ((dx != 0 || dy != 0) && geo != null && (!geo.relative || this.deltas.get(state.cell) != null)) {
                    state.x += dx;
                    state.y += dy;
                }
            }

            var childCount = model.getChildCount(state.cell);

            for (var i = 0; i < childCount; i++) {
                this.translateState(state.view.getState(model.getChildAt(state.cell, i)), dx, dy);
            }
        }
    };

    /**
     * Function: revalidateState
     */
    revalidateState(state, dx, dy, visitor) {
        if (state != null) {
            var model = this.graph.getModel();

            // Updates the edge terminal points and restores the
            // (relative) positions of any (relative) children
            if (model.isEdge(state.cell)) {
                state.view.updateCellState(state);
            }

            var geo = this.graph.getCellGeometry(state.cell);
            var pState = state.view.getState(model.getParent(state.cell));

            // Moves selection vertices which are relative
            if ((dx != 0 || dy != 0) && geo != null && geo.relative &&
                model.isVertex(state.cell) && (pState == null ||
                    model.isVertex(pState.cell) || this.deltas.get(state.cell) != null)) {
                state.x += dx;
                state.y += dy;
            }

            this.graph.cellRenderer.redraw(state);

            // Invokes the visitor on the given state
            if (visitor != null) {
                visitor(state);
            }

            var childCount = model.getChildCount(state.cell);

            for (var i = 0; i < childCount; i++) {
                this.revalidateState(this.graph.view.getState(model.getChildAt(state.cell, i)), dx, dy, visitor);
            }
        }
    };

    /**
     * Function: addEdges
     */
    addEdges(state) {
        var model = this.graph.getModel();
        var edgeCount = model.getEdgeCount(state.cell);

        for (var i = 0; i < edgeCount; i++) {
            var s = state.view.getState(model.getEdgeAt(state.cell, i));

            if (s != null) {
                this.moveState(s, 0, 0);
            }
        }
    };

};

console.log('graph/view/mxCellStatePreview.js');