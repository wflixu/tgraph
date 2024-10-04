import { ThCell } from './ThCell';
import { ThEvent, ThEventObject, ThEventSource, ThRootChange } from "../event";
import { mxUndoableEdit } from "../util";
export class ThGraphModel extends ThEventSource {
    /**
     * Variable: currentEdit
     *
     * Holds the changes for the current transaction. If the transaction is
     * closed then a new object is created for this variable using
     * <createUndoableEdit>.
     */
    currentEdit = null;
    /**
     * Variable: root
     *
     * Holds the root cell, which in turn contains the cells that represent the
     * layers of the diagram as child cells. That is, the actual elements of the
     * diagram are supposed to live in the third generation of cells and below.
     */
    root;
    /**
     * Variable: updateLevel
     *
     * Counter for the depth of nested transactions. Each call to <beginUpdate>
     * will increment this number and each call to <endUpdate> will decrement
     * it. When the counter reaches 0, the transaction is closed and the
     * respective events are fired. Initial value is 0.
     */
    updateLevel = 0;
    /**
     * Variable: endingUpdate
     *
     * True if the program flow is currently inside endUpdate.
     */
    endingUpdate = false;
    /**
     * Variable: cells
     *
     * Maps from Ids to cells.
     */
    cells = {};
    /**
     * Variable: nextId
     *
     * Specifies the next Id to be created. Initial value is 0.
     */
    nextId = 0;
    /**
     * Variable: createIds
     *
     * Specifies if the model should automatically create Ids for new cells.
     * Default is true.
     */
    createIds = true;
    /**
     * Variable: prefix
     *
     * Defines the prefix of new Ids. Default is an empty string.
     */
    prefix = '';
    /**
     * Variable: postfix
     *
     * Defines the postfix of new Ids. Default is an empty string.
     */
    postfix = '';
    constructor(root) {
        super();
        // this.currentEdit = this.createUndoableEdit();
        if (root) {
            this.setRoot(root);
        }
        else {
            this.clear();
        }
    }
    /**
     * Function: clear
     *
     * Sets a new root using <createRoot>.
     */
    clear() {
        this.setRoot(this.createRoot());
    }
    ;
    /**
     * Function: createRoot
     *
     * Creates a new root cell with a default layer (child 0).
     */
    createRoot() {
        var cell = new ThCell();
        cell.insert(new ThCell());
        return cell;
    }
    ;
    /**
     * Function: setRoot
     *
     * Sets the <root> of the model using <mxRootChange> and adds the change to
     * the current transaction. This resets all datastructures in the model and
     * is the preferred way of clearing an existing model. Returns the new
     * root.
     *
     * Example:
     *
     * (code)
     * var root = new mxCell();
     * root.insert(new mxCell());
     * model.setRoot(root);
     * (end)
     *
     * Parameters:
     *
     * root - <mxCell> that specifies the new root.
     */
    setRoot(root) {
        this.execute(new ThRootChange(this, root));
        return root;
    }
    ;
    /**
     * Function: rootChanged
     *
     * Inner callback to change the root of the model and update the internal
     * datastructures, such as <cells> and <nextId>. Returns the previous root.
     *
     * Parameters:
     *
     * root - <mxCell> that specifies the new root.
     */
    rootChanged(root) {
        var oldRoot = this.root;
        this.root = root;
        // Resets counters and datastructures
        this.nextId = 0;
        this.cells = {};
        this.cellAdded(root);
        return oldRoot;
    }
    ;
    /**
     * Function: cellAdded
     *
     * Inner callback to update <cells> when a cell has been added. This
     * implementation resolves collisions by creating new Ids. To change the
     * ID of a cell after it was inserted into the model, use the following
     * code:
     *
     * (code
     * delete model.cells[cell.getId()];
     * cell.setId(newId);
     * model.cells[cell.getId()] = cell;
     * (end)
     *
     * If the change of the ID should be part of the command history, then the
     * cell should be removed from the model and a clone with the new ID should
     * be reinserted into the model instead.
     *
     * Parameters:
     *
     * cell - <mxCell> that specifies the cell that has been added.
     */
    cellAdded(cell) {
        if (cell) {
            // Creates an Id for the cell if not Id exists
            if (cell.getId() == null && this.createIds) {
                cell.setId(this.createId(cell));
            }
            if (cell.getId() != null) {
                var collision = this.getCell(cell.getId());
                if (collision != cell) {
                    // Creates new Id for the cell
                    // as long as there is a collision
                    while (collision != null) {
                        cell.setId(this.createId(cell));
                        collision = this.getCell(cell.getId());
                    }
                    // Lazily creates the cells dictionary
                    if (this.cells == null) {
                        this.cells = {};
                    }
                    this.cells[cell.getId()] = cell;
                }
            }
            // Recursively processes child cells
            var childCount = this.getChildCount(cell);
            for (var i = 0; i < childCount; i++) {
                let curCell = this.getChildAt(cell, i);
                if (curCell) {
                    this.cellAdded(curCell);
                }
            }
        }
    }
    ;
    /**
     * Function: getChildAt
     *
     * Returns the child of the given <mxCell> at the given index.
     *
     * Parameters:
     *
     * cell - <mxCell> that represents the parent.
     * index - Integer that specifies the index of the child to be returned.
     */
    getChildAt(cell, index) {
        return cell?.getChildAt(index);
    }
    ;
    getChildCount(cell) {
        return cell?.getChildCount() ?? 0;
    }
    ;
    /**
     * Function: getCell
     *
     * Returns the <mxCell> for the specified Id or null if no cell can be
     * found for the given Id.
     *
     * Parameters:
     *
     * id - A string representing the Id of the cell.
     */
    getCell(id) {
        return this.cells?.[id];
    }
    ;
    /**
     * Function: createId
     *
     * Hook method to create an Id for the specified cell. This implementation
     * concatenates <prefix>, id and <postfix> to create the Id and increments
     * <nextId>. The cell is ignored by this implementation, but can be used in
     * overridden methods to prefix the Ids with eg. the cell type.
     *
     * Parameters:
     *
     * cell - <mxCell> to create the Id for.
     */
    createId(cell) {
        var id = this.nextId;
        this.nextId++;
        return this.prefix + id + this.postfix;
    }
    ;
    /**
     * Function: execute
     *
     * Executes the given edit and fires events if required. The edit object
     * requires an execute function which is invoked. The edit is added to the
     * <currentEdit> between <beginUpdate> and <endUpdate> calls, so that
     * events will be fired if this execute is an individual transaction, that
     * is, if no previous <beginUpdate> calls have been made without calling
     * <endUpdate>. This implementation fires an <execute> event before
     * executing the given change.
     *
     * Parameters:
     *
     * change - Object that described the change.
     */
    execute(change) {
        change.execute();
        this.beginUpdate();
        this.currentEdit.add(change);
        this.fireEvent(new ThEventObject(ThEvent.EXECUTE, 'change', change));
        // New global executed event
        this.fireEvent(new ThEventObject(ThEvent.EXECUTED, 'change', change));
        this.endUpdate();
    }
    ;
    /**
     * Function: beginUpdate
     *
     * Increments the <updateLevel> by one. The event notification
     * is queued until <updateLevel> reaches 0 by use of
     * <endUpdate>.
     *
     * All changes on <mxGraphModel> are transactional,
     * that is, they are executed in a single undoable change
     * on the model (without transaction isolation).
     * Therefore, if you want to combine any
     * number of changes into a single undoable change,
     * you should group any two or more API calls that
     * modify the graph model between <beginUpdate>
     * and <endUpdate> calls as shown here:
     *
     * (code)
     * var model = graph.getModel();
     * var parent = graph.getDefaultParent();
     * var index = model.getChildCount(parent);
     * model.beginUpdate();
     * try
     * {
     *   model.add(parent, v1, index);
     *   model.add(parent, v2, index+1);
     * }
     * finally
     * {
     *   model.endUpdate();
     * }
     * (end)
     *
     * Of course there is a shortcut for appending a
     * sequence of cells into the default parent:
     *
     * (code)
     * graph.addCells([v1, v2]).
     * (end)
     */
    beginUpdate() {
        this.updateLevel++;
        this.fireEvent(new ThEventObject(ThEvent.BEGIN_UPDATE));
        if (this.updateLevel == 1) {
            this.fireEvent(new ThEventObject(ThEvent.START_EDIT));
        }
    }
    ;
    /**
     * Function: endUpdate
     *
     * Decrements the <updateLevel> by one and fires an <undo>
     * event if the <updateLevel> reaches 0. This function
     * indirectly fires a <change> event by invoking the notify
     * function on the <currentEdit> und then creates a new
     * <currentEdit> using <createUndoableEdit>.
     *
     * The <undo> event is fired only once per edit, whereas
     * the <change> event is fired whenever the notify
     * function is invoked, that is, on undo and redo of
     * the edit.
     */
    endUpdate() {
        this.updateLevel--;
        if (this.updateLevel == 0) {
            this.fireEvent(new ThEventObject(ThEvent.END_EDIT));
        }
        if (!this.endingUpdate) {
            this.endingUpdate = this.updateLevel == 0;
            this.fireEvent(new ThEventObject(ThEvent.END_UPDATE, 'edit', this.currentEdit));
            try {
                if (this.endingUpdate && !this.currentEdit.isEmpty()) {
                    this.fireEvent(new ThEventObject(ThEvent.BEFORE_UNDO, 'edit', this.currentEdit));
                    var tmp = this.currentEdit;
                    this.currentEdit = this.createUndoableEdit();
                    tmp.notify();
                    this.fireEvent(new ThEventObject(ThEvent.UNDO, 'edit', tmp));
                }
            }
            finally {
                this.endingUpdate = false;
            }
        }
    }
    ;
    /**
     * Function: createUndoableEdit
     *
     * Creates a new <mxUndoableEdit> that implements the
     * notify function to fire a <change> and <notify> event
     * through the <mxUndoableEdit>'s source.
     *
     * Parameters:
     *
     * significant - Optional boolean that specifies if the edit to be created is
     * significant. Default is true.
     */
    createUndoableEdit(significant) {
        var edit = new mxUndoableEdit(this, significant ?? true);
        edit.notify = function () {
            // LATER: Remove changes property (deprecated)
            edit.source.fireEvent(new ThEventObject(ThEvent.CHANGE, 'edit', edit, 'changes', edit.changes));
            edit.source.fireEvent(new ThEventObject(ThEvent.NOTIFY, 'edit', edit, 'changes', edit.changes));
        };
        return edit;
    }
    ;
}
