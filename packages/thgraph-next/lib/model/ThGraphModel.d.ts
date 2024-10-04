import { ThCell } from './ThCell';
import { ThEventSource } from "../event";
import { mxUndoableEdit } from "../util";
export declare class ThGraphModel extends ThEventSource {
    /**
     * Variable: currentEdit
     *
     * Holds the changes for the current transaction. If the transaction is
     * closed then a new object is created for this variable using
     * <createUndoableEdit>.
     */
    currentEdit: any;
    /**
     * Variable: root
     *
     * Holds the root cell, which in turn contains the cells that represent the
     * layers of the diagram as child cells. That is, the actual elements of the
     * diagram are supposed to live in the third generation of cells and below.
     */
    root?: ThCell;
    /**
     * Variable: updateLevel
     *
     * Counter for the depth of nested transactions. Each call to <beginUpdate>
     * will increment this number and each call to <endUpdate> will decrement
     * it. When the counter reaches 0, the transaction is closed and the
     * respective events are fired. Initial value is 0.
     */
    updateLevel: number;
    /**
     * Variable: endingUpdate
     *
     * True if the program flow is currently inside endUpdate.
     */
    endingUpdate: boolean;
    /**
     * Variable: cells
     *
     * Maps from Ids to cells.
     */
    cells: ThOjbect;
    /**
     * Variable: nextId
     *
     * Specifies the next Id to be created. Initial value is 0.
     */
    nextId: number;
    /**
     * Variable: createIds
     *
     * Specifies if the model should automatically create Ids for new cells.
     * Default is true.
     */
    createIds: boolean;
    /**
     * Variable: prefix
     *
     * Defines the prefix of new Ids. Default is an empty string.
     */
    prefix: string;
    /**
     * Variable: postfix
     *
     * Defines the postfix of new Ids. Default is an empty string.
     */
    postfix: string;
    constructor(root?: any);
    /**
     * Function: clear
     *
     * Sets a new root using <createRoot>.
     */
    clear(): void;
    /**
     * Function: createRoot
     *
     * Creates a new root cell with a default layer (child 0).
     */
    createRoot(): ThCell;
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
    setRoot(root: ThCell): ThCell;
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
    rootChanged(root: ThCell): ThCell | undefined;
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
    cellAdded(cell: ThCell): void;
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
    getChildAt(cell: ThCell, index: number): Optional<ThCell>;
    getChildCount(cell: ThCell): number;
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
    getCell(id: string): any;
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
    createId(cell: ThCell): string;
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
    execute(change: any): void;
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
    beginUpdate(): void;
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
    endUpdate(): void;
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
    createUndoableEdit(significant?: boolean): mxUndoableEdit;
}
