
/**
 * Class: mxLayoutManager
 *
 * Implements a layout manager that runs a given layout after any changes to the graph:
 *
 * Example:
 *
 * (code)
 * var layoutMgr = new mxLayoutManager(graph);
 * layoutMgr.getLayout (cell, eventName)
 * {
 *   return layout;
 * };
 * (end)
 *
 * See <getLayout> for a description of the possible eventNames.
 *
 * Event: mxEvent.LAYOUT_CELLS
 *
 * Fires between begin- and endUpdate after all cells have been layouted in
 * <layoutCells>. The <code>cells</code> property contains all cells that have
 * been passed to <layoutCells>.
 *
 * Constructor: mxLayoutManager
 *
 * Constructs a new automatic layout for the given graph.
 *
 * Arguments:
 *
 * graph - Reference to the enclosing graph.
 */

import { mxEventSource } from '../util/mxEventSource.js';
import { mxUtils, mxEvent, mxEventObject, mxRectangle, } from '../util/index.js';


import {
  mxRootChange,
  mxChildChange,
  mxTerminalChange,
  mxGeometryChange,
  mxVisibleChange,
  mxStyleChange,
} from '../model/index.js';

export class mxLayoutManager extends mxEventSource {


  /**
   * Variable: graph
   *
   * Reference to the enclosing <mxGraph>.
   */
  graph = null;

  /**
   * Variable: bubbling
   *
   * Specifies if the layout should bubble along
   * the cell hierarchy. Default is true.
   */
  bubbling = true;

  /**
   * Variable: enabled
   *
   * Specifies if event handling is enabled. Default is true.
   */
  enabled = true;

  /**
   * Variable: undoHandler
   *
   * Holds the function that handles the endUpdate event.
   */
  undoHandler = null;

  /**
   * Variable: moveHandler
   *
   * Holds the function that handles the move event.
   */
  moveHandler = null;

  /**
   * Variable: resizeHandler
   *
   * Holds the function that handles the resize event.
   */
  resizeHandler = null;


  constructor(graph) {
    super();
    // Executes the layout before the changes are dispatched
    this.undoHandler = mxUtils.bind(this, function (sender, evt) {
      if (this.isEnabled()) {
        this.beforeUndo(evt.getProperty('edit'));
      }
    });

    // Notifies the layout of a move operation inside a parent
    this.moveHandler = mxUtils.bind(this, function (sender, evt) {
      if (this.isEnabled()) {
        this.cellsMoved(evt.getProperty('cells'), evt.getProperty('event'));
      }
    });

    // Notifies the layout of a move operation inside a parent
    this.resizeHandler = mxUtils.bind(this, function (sender, evt) {
      if (this.isEnabled()) {
        this.cellsResized(
          evt.getProperty('cells'),
          evt.getProperty('bounds'),
          evt.getProperty('previous'),
        );
      }
    });

    this.setGraph(graph);
  }


  /**
   * Function: isEnabled
   *
   * Returns true if events are handled. This implementation
   * returns <enabled>.
   */
  isEnabled() {
    return this.enabled;
  };

  /**
   * Function: setEnabled
   *
   * Enables or disables event handling. This implementation
   * updates <enabled>.
   *
   * Parameters:
   *
   * enabled - Boolean that specifies the new enabled state.
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  };

  /**
   * Function: isBubbling
   *
   * Returns true if a layout should bubble, that is, if the parent layout
   * should be executed whenever a cell layout (layout of the children of
   * a cell) has been executed. This implementation returns <bubbling>.
   */
  isBubbling() {
    return this.bubbling;
  };

  /**
   * Function: setBubbling
   *
   * Sets <bubbling>.
   */
  setBubbling(value) {
    this.bubbling = value;
  };

  /**
   * Function: getGraph
   *
   * Returns the graph that this layout operates on.
   */
  getGraph() {
    return this.graph;
  };

  /**
   * Function: setGraph
   *
   * Sets the graph that the layouts operate on.
   */
  setGraph(graph) {
    if (this.graph != null) {
      var model = this.graph.getModel();
      model.removeListener(this.undoHandler);
      this.graph.removeListener(this.moveHandler);
      this.graph.removeListener(this.resizeHandler);
    }

    this.graph = graph;

    if (this.graph != null) {
      var model = this.graph.getModel();
      model.addListener(mxEvent.BEFORE_UNDO, this.undoHandler);
      this.graph.addListener(mxEvent.MOVE_CELLS, this.moveHandler);
      this.graph.addListener(mxEvent.RESIZE_CELLS, this.resizeHandler);
    }
  };

  /**
   * Function: hasLayout
   *
   * Returns true if the given cell has a layout. This implementation invokes
   * <getLayout> with <mxEvent.LAYOUT_CELLS> as the eventName. Override this
   * if creating layouts in <getLayout> is expensive and return true if
   * <getLayout> will return a layout for the given cell for
   * <mxEvent.BEGIN_UPDATE> or <mxEvent.END_UPDATE>.
   */
  hasLayout(cell) {
    return this.getLayout(cell, mxEvent.LAYOUT_CELLS);
  };

  /**
   * Function: getLayout
   *
   * Returns the layout for the given cell and eventName. Possible
   * event names are <mxEvent.MOVE_CELLS> and <mxEvent.RESIZE_CELLS>
   * when cells are moved or resized and <mxEvent.BEGIN_UPDATE> or
   * <mxEvent.END_UPDATE> for the bottom up and top down phases after
   * changes to the graph model. <mxEvent.LAYOUT_CELLS> is used to
   * check if a layout exists for the given cell. This is called
   * from <hasLayout>.
   */
  getLayout(cell, eventName) {
    return null;
  };

  /**
   * Function: beforeUndo
   *
   * Called from <undoHandler>.
   *
   * Parameters:
   *
   * cell - Array of <mxCells> that have been moved.
   * evt - Mouse event that represents the mousedown.
   */
  beforeUndo(undoableEdit) {
    this.executeLayoutForCells(this.getCellsForChanges(undoableEdit.changes));
  };

  /**
   * Function: cellsMoved
   *
   * Called from <moveHandler>.
   *
   * Parameters:
   *
   * cell - Array of <mxCells> that have been moved.
   * evt - Mouse event that represents the mousedown.
   */
  cellsMoved(cells, evt) {
    if (cells != null && evt != null) {
      var point = mxUtils.convertPoint(
        this.getGraph().container,
        mxEvent.getClientX(evt),
        mxEvent.getClientY(evt),
      );
      var model = this.getGraph().getModel();

      for (var i = 0; i < cells.length; i++) {
        var layout = this.getLayout(
          model.getParent(cells[i]),
          mxEvent.MOVE_CELLS,
        );

        if (layout != null) {
          layout.moveCell(cells[i], point.x, point.y);
        }
      }
    }
  };

  /**
   * Function: cellsResized
   *
   * Called from <resizeHandler>.
   *
   * Parameters:
   *
   * cell - Array of <mxCells> that have been resized.
   * bounds - <mxRectangle> taht represents the new bounds.
   */
  cellsResized(cells, bounds, prev) {
    if (cells != null && bounds != null) {
      var model = this.getGraph().getModel();

      for (var i = 0; i < cells.length; i++) {
        var layout = this.getLayout(
          model.getParent(cells[i]),
          mxEvent.RESIZE_CELLS,
        );

        if (layout != null) {
          layout.resizeCell(cells[i], bounds[i], prev[i]);
        }
      }
    }
  };

  /**
   * Function: getCellsForChanges
   *
   * Returns the cells for which a layout should be executed.
   */
  getCellsForChanges(changes) {
    var result = [];

    for (var i = 0; i < changes.length; i++) {
      var change = changes[i];

      if (change instanceof mxRootChange) {
        return [];
      } else {
        result = result.concat(this.getCellsForChange(change));
      }
    }

    return result;
  };

  /**
   * Function: getCellsForChange
   *
   * Executes all layouts which have been scheduled during the
   * changes.
   */
  getCellsForChange(change) {
    if (change instanceof mxChildChange) {
      return this.addCellsWithLayout(
        change.child,
        this.addCellsWithLayout(change.previous),
      );
    } else if (
      change instanceof mxTerminalChange ||
      change instanceof mxGeometryChange
    ) {
      return this.addCellsWithLayout(change.cell);
    } else if (
      change instanceof mxVisibleChange ||
      change instanceof mxStyleChange
    ) {
      return this.addCellsWithLayout(change.cell);
    }

    return [];
  };

  /**
   * Function: addCellsWithLayout
   *
   * Adds all ancestors of the given cell that have a layout.
   */
  addCellsWithLayout(cell, result) {
    return this.addDescendantsWithLayout(
      cell,
      this.addAncestorsWithLayout(cell, result),
    );
  };

  /**
   * Function: addAncestorsWithLayout
   *
   * Adds all ancestors of the given cell that have a layout.
   */
  addAncestorsWithLayout(cell, result) {
    result = result != null ? result : [];

    if (cell != null) {
      var layout = this.hasLayout(cell);

      if (layout != null) {
        result.push(cell);
      }

      if (this.isBubbling()) {
        var model = this.getGraph().getModel();
        this.addAncestorsWithLayout(model.getParent(cell), result);
      }
    }

    return result;
  };

  /**
   * Function: addDescendantsWithLayout
   *
   * Adds all descendants of the given cell that have a layout.
   */
  addDescendantsWithLayout(cell, result) {
    result = result != null ? result : [];

    if (cell != null && this.hasLayout(cell)) {
      var model = this.getGraph().getModel();

      for (var i = 0; i < model.getChildCount(cell); i++) {
        var child = model.getChildAt(cell, i);

        if (this.hasLayout(child)) {
          result.push(child);
          this.addDescendantsWithLayout(child, result);
        }
      }
    }

    return result;
  };

  /**
   * Function: executeLayoutForCells
   *
   * Executes all layouts for the given cells in two phases: In the first phase
   * layouts for child cells are executed before layouts for parent cells with
   * <mxEvent.BEGIN_UPDATE>, in the second phase layouts for parent cells are
   * executed before layouts for child cells with <mxEvent.END_UPDATE>.
   */
  executeLayoutForCells(cells) {
    var sorted = mxUtils.sortCells(cells, false);
    this.layoutCells(sorted, true);
    this.layoutCells(sorted.reverse(), false);
  };

  /**
   * Function: layoutCells
   *
   * Executes all layouts which have been scheduled during the changes.
   */
  layoutCells(cells, bubble) {
    if (cells.length > 0) {
      // Invokes the layouts while removing duplicates
      var model = this.getGraph().getModel();

      model.beginUpdate();
      try {
        var last = null;

        for (var i = 0; i < cells.length; i++) {
          if (cells[i] != model.getRoot() && cells[i] != last) {
            this.executeLayout(cells[i], bubble);
            last = cells[i];
          }
        }

        this.fireEvent(new mxEventObject(mxEvent.LAYOUT_CELLS, 'cells', cells));
      } finally {
        model.endUpdate();
      }
    }
  };

  /**
   * Function: executeLayout
   *
   * Executes the given layout on the given parent.
   */
  executeLayout(cell, bubble) {
    var layout = this.getLayout(
      cell,
      bubble ? mxEvent.BEGIN_UPDATE : mxEvent.END_UPDATE,
    );

    if (layout != null) {
      layout.execute(cell);
    }
  };

  /**
   * Function: destroy
   *
   * Removes all handlers from the <graph> and deletes the reference to it.
   */
  destroy() {
    this.setGraph(null);
  };

}


console.log('graph/view/mxLayoutManager.js');