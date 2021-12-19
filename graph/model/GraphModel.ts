import { TMap } from "../types";
import { mxEvent } from "../util/mxEvent";
import { mxEventObject } from "../util/mxEventObject";
import { mxEventSource } from "../util/mxEventSource";
import { mxUndoableEdit } from "../util/mxUndoableEdit";
import { mxUtils } from "../util/mxUtils";
import { mxCell } from "./mxCell";



export class TGraphModel extends mxEventSource {
    currentEdit: any;
    updateLevel: number = 0;
    endingUpdate = false;
    root: any;
    /**
     * Variable: prefix
     * 
     * Defines the prefix of new Ids. Default is an empty string.
     */
    prefix: string = '';

    /**
     * Variable: postfix
     * 
     * Defines the postfix of new Ids. Default is an empty string.
     */
    postfix: string = '';

    /**
     * Variable: nextId
     * 
     * Specifies the next Id to be created. Initial value is 0.
     */
    nextId: number = 0;
    cells: TMap = {};
    createIds: boolean = true;

    constructor(root: mxCell | null) {
        super(null);
        this.currentEdit = this.createUndoableEdit();
        if (root) {
            this.setRoot(root)
        } else {
            this.clear()
        }

    }
    clear() {
        this.setRoot(this.createRoot());
    }
    createRoot(): any {
        var cell = new mxCell();
        cell.insert(new mxCell(), 0);
        return cell;
    }
    setRoot(root: any) {
        this.execute(new mxRootChange(this, root));

        return root;
    }

    /**
     * Function: getChildCount
     *
     * Returns the number of children in the given cell.
     *
     * Parameters:
     * 
     * cell - <mxCell> whose number of children should be returned.
     */
    getChildCount(cell: mxCell) {
        return cell?.getChildCount() ?? 0;
    }


    /**
     * TODO 
     * Function: getRoot
     * 
     * Returns the root of the model or the topmost parent of the given cell.
     *
     * Parameters:
     * 
     * cell - Optional <mxCell> that specifies the child.
     */
    getRoot(cell?: any) {
        var root = cell || this.root;

        if (cell != null) {
            while (cell != null) {
                root = cell;
                cell = this.getParent(cell);
            }
        }

        return root;
    }


    /**
     * Function: getEdgeCount
     * 
     * Returns the number of distinct edges connected to the given cell.
     *
     * Parameters:
     * 
     * cell - <mxCell> that represents the vertex.
     */
    getEdgeCount(cell: mxCell) {
        return cell?.getEdgeCount() ?? 0;
    };


    /**
     * Function: getEdgeAt
     * 
     * Returns the edge of cell at the given index.
     *
     * Parameters:
     * 
     * cell - <mxCell> that specifies the vertex.
     * index - Integer that specifies the index of the edge
     * to return.
     */
    getEdgeAt(cell: mxCell, index = 0) {
        return cell.getEdgeAt(index);
    };


    /**
     * Function: isVisible
     * 
     * Returns true if the given <mxCell> is visible.
     * 
     * Parameters:
     * 
     * cell - <mxCell> whose visible state should be returned.
     */
    isVisible(cell: mxCell) {
        return cell?.isVisible() ?? false;
    };

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
    getChildAt(cell: any, index = 0) {
        return (cell != null) ? cell.getChildAt(index) : null;
    }



    /**
     * Function: getParent
     * 
     * Returns the parent of the given cell.
     *
     * Parameters:
     * 
     * cell - <mxCell> whose parent should be returned.
     */
    getParent(cell: mxCell) {
        return (cell) ? cell.getParent() : null;
    }


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
    rootChanged(root: mxCell) {
        var oldRoot = this.root;
        this.root = root;

        // Resets counters and datastructures
        this.nextId = 0;
        this.cells = {};
        this.cellAdded(root);

        return oldRoot;
    }

    cellAdded(cell: mxCell) {
        if (cell != null) {
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

                    this.cells[cell.getId()] = cell;
                }
            }

            // Makes sure IDs of deleted cells are not reused
            if (mxUtils.isNumeric(cell.getId())) {
                this.nextId = Math.max(this.nextId, cell.getId());
            }

            // Recursively processes child cells
            var childCount = this.getChildCount(cell);

            for (var i = 0; i < childCount; i++) {
                this.cellAdded(this.getChildAt(cell, i));
            }
        }
    }

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
    getCell(id: string) {
        return this.cells[id];
    };

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
    createId(cell: mxCell) {
        var id = this.nextId;
        this.nextId++;

        return this.prefix + id + this.postfix;
    };


    execute(change: mxRootChange) {
        change.execute();
        this.beginUpdate();
        debugger;
        this.currentEdit.add(change);
        this.fireEvent(new mxEventObject(mxEvent.EXECUTE, 'change', change));
        // New global executed event
        this.fireEvent(new mxEventObject(mxEvent.EXECUTED, 'change', change));
        this.endUpdate();
    }

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
        this.fireEvent(new mxEventObject(mxEvent.BEGIN_UPDATE));

        if (this.updateLevel == 1) {
            this.fireEvent(new mxEventObject(mxEvent.START_EDIT));
        }
    };

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
            this.fireEvent(new mxEventObject(mxEvent.END_EDIT));
        }

        if (!this.endingUpdate) {
            this.endingUpdate = this.updateLevel == 0;
            this.fireEvent(new mxEventObject(mxEvent.END_UPDATE, 'edit', this.currentEdit));

            try {
                if (this.endingUpdate && !this.currentEdit.isEmpty()) {
                    this.fireEvent(new mxEventObject(mxEvent.BEFORE_UNDO, 'edit', this.currentEdit));
                    var tmp = this.currentEdit;
                    this.currentEdit = this.createUndoableEdit();
                    tmp.notify();
                    this.fireEvent(new mxEventObject(mxEvent.UNDO, 'edit', tmp));
                }
            }
            finally {
                this.endingUpdate = false;
            }
        }
    };

    createUndoableEdit(significant: boolean = true): any {
        let edit = new mxUndoableEdit(this, significant);

        edit.notify = function () {
            // LATER: Remove changes property (deprecated)
            edit.source.fireEvent(new mxEventObject(mxEvent.CHANGE,
                'edit', edit, 'changes', edit.changes));
            edit.source.fireEvent(new mxEventObject(mxEvent.NOTIFY,
                'edit', edit, 'changes', edit.changes));
        };

        return edit;
    }
}


/**
 * Class: mxRootChange
 * 
 * Action to change the root in a model.
 *
 * Constructor: mxRootChange
 * 
 * Constructs a change of the root in the
 * specified model.
 */
export class mxRootChange {
    model: any;
    root: any;
    previous: any;
    constructor(model: any, root: any) {
        this.model = model;
        this.root = root;
        this.previous = root;
    }

    /**
     * Function: execute
     * 
     * Carries out a change of the root using
     * <mxGraphModel.rootChanged>.
     */
    execute() {
        this.root = this.previous;
        this.previous = this.model?.rootChanged(this.previous);
    };
};



/**
 * Class: mxChildChange
 * 
 * Action to add or remove a child in a model.
 *
 * Constructor: mxChildChange
 * 
 * Constructs a change of a child in the
 * specified model.
 */
export class mxChildChange {
    model: any;
    parent: any;
    previous: any;
    child: any;
    index: any;
    previousIndex: any;
    constructor(model: any, parent: any, child: any, index: any) {
        this.model = model;
        this.parent = parent;
        this.previous = parent;
        this.child = child;
        this.index = index;
        this.previousIndex = index;
    }


    /**
     * Function: execute
     * 
     * Changes the parent of <child> using
     * <mxGraphModel.parentForCellChanged> and
     * removes or restores the cell's
     * connections.
     */
    execute() {
        if (this.child != null) {
            var tmp = this.model.getParent(this.child);
            var tmp2 = (tmp != null) ? tmp.getIndex(this.child) : 0;

            if (this.previous == null) {
                this.connect(this.child, false);
            }

            tmp = this.model.parentForCellChanged(
                this.child, this.previous, this.previousIndex);

            if (this.previous != null) {
                this.connect(this.child, true);
            }

            this.parent = this.previous;
            this.previous = tmp;
            this.index = this.previousIndex;
            this.previousIndex = tmp2;
        }
    };

    /**
     * Function: disconnect
     * 
     * Disconnects the given cell recursively from its
     * terminals and stores the previous terminal in the
     * cell's terminals.
     */
    connect(cell: any, isConnect = true) {

        var source = cell.getTerminal(true);
        var target = cell.getTerminal(false);

        if (source != null) {
            if (isConnect) {
                this.model.terminalForCellChanged(cell, source, true);
            }
            else {
                this.model.terminalForCellChanged(cell, null, true);
            }
        }

        if (target != null) {
            if (isConnect) {
                this.model.terminalForCellChanged(cell, target, false);
            }
            else {
                this.model.terminalForCellChanged(cell, null, false);
            }
        }

        cell.setTerminal(source, true);
        cell.setTerminal(target, false);

        var childCount = this.model.getChildCount(cell);

        for (var i = 0; i < childCount; i++) {
            this.connect(this.model.getChildAt(cell, i), isConnect);
        }
    };
};




/**
 * Class: mxTerminalChange
 * 
 * Action to change a terminal in a model.
 *
 * Constructor: mxTerminalChange
 * 
 * Constructs a change of a terminal in the 
 * specified model.
 */
export class mxTerminalChange {
    model: any;
    cell: any;
    terminal: any;
    previous: any;
    source: any;
    constructor(model: any, cell: any, terminal: any, source: any) {
        this.model = model;
        this.cell = cell;
        this.terminal = terminal;
        this.previous = terminal;
        this.source = source;
    }
    /**
     * Function: execute
     * 
     * Changes the terminal of <cell> to <previous> using
     * <mxGraphModel.terminalForCellChanged>.
     */
    execute() {
        if (this.cell != null) {
            this.terminal = this.previous;
            this.previous = this.model.terminalForCellChanged(
                this.cell, this.previous, this.source);
        }
    };

}



/**
 * Class: mxCollapseChange
 * 
 * Action to change a cell's collapsed state in a model.
 *
 * Constructor: mxCollapseChange
 * 
 * Constructs a change of a collapsed state in the
 * specified model.
 */
export class mxCollapseChange {
    model: any;
    cell: any;
    collapsed: any;
    previous: any;
    constructor(model?: any, cell?: any, collapsed?: any) {
        this.model = model;
        this.cell = cell;
        this.collapsed = collapsed;
        this.previous = collapsed;
    };

    /**
     * Function: execute
     * 
     * Changes the collapsed state of <cell> to <previous> using
     * <mxGraphModel.collapsedStateForCellChanged>.
     */
    execute() {
        if (this.cell != null) {
            this.collapsed = this.previous;
            this.previous = this.model.collapsedStateForCellChanged(
                this.cell, this.previous);
        }
    };

}



/**
 * Class: mxValueChange
 * 
 * Action to change a user object in a model.
 *
 * Constructor: mxValueChange
 * 
 * Constructs a change of a user object in the 
 * specified model.
 */
export class mxValueChange {
    model: any;
    cell: any;
    value: any;
    previous: any;
    constructor(model: any, cell: any, value: any) {
        this.model = model;
        this.cell = cell;
        this.value = value;
        this.previous = value;
    }
    /**
     * Function: execute
     * 
     * Changes the value of <cell> to <previous> using
     * <mxGraphModel.valueForCellChanged>.
     */
    execute() {
        if (this.cell != null) {
            this.value = this.previous;
            this.previous = this.model.valueForCellChanged(
                this.cell, this.previous);
        }
    };
};



/**
 * Class: mxStyleChange
 * 
 * Action to change a cell's style in a model.
 *
 * Constructor: mxStyleChange
 * 
 * Constructs a change of a style in the
 * specified model.
 */
export class mxStyleChange {
    model: any;
    cell: any;
    style: any;
    previous: any;
    constructor(model: any, cell: any, style: any) {
        this.model = model;
        this.cell = cell;
        this.style = style;
        this.previous = style;
    };

    /**
     * Function: execute
     * 
     * Changes the style of <cell> to <previous> using
     * <mxGraphModel.styleForCellChanged>.
     */
    execute() {
        if (this.cell != null) {
            this.style = this.previous;
            this.previous = this.model.styleForCellChanged(
                this.cell, this.previous);
        }
    };
}



/**
 * Class: mxGeometryChange
 * 
 * Action to change a cell's geometry in a model.
 *
 * Constructor: mxGeometryChange
 * 
 * Constructs a change of a geometry in the
 * specified model.
 */
export class mxGeometryChange {
    model: any;
    cell: any;
    geometry: any;
    previous: any;
    constructor(model?: any, cell?: any, geometry?: any) {
        this.model = model;
        this.cell = cell;
        this.geometry = geometry;
        this.previous = geometry;
    }
    /**
     * Function: execute
     * 
     * Changes the geometry of <cell> ro <previous> using
     * <mxGraphModel.geometryForCellChanged>.
     */
    execute() {
        if (this.cell != null) {
            this.geometry = this.previous;
            this.previous = this.model.geometryForCellChanged(
                this.cell, this.previous);
        }
    };

}


/**
 * Class: mxVisibleChange
 * 
 * Action to change a cell's visible state in a model.
 *
 * Constructor: mxVisibleChange
 * 
 * Constructs a change of a visible state in the
 * specified model.
 */
export class mxVisibleChange {
    model: any;
    cell: any;
    visible: any;
    previous: any;
    constructor(model?: any, cell?: any, visible?: any) {
        this.model = model;
        this.cell = cell;
        this.visible = visible;
        this.previous = visible;
    };

    /**
     * Function: execute
     * 
     * Changes the visible state of <cell> to <previous> using
     * <mxGraphModel.visibleStateForCellChanged>.
     */
    execute() {
        if (this.cell != null) {
            this.visible = this.previous;
            this.previous = this.model.visibleStateForCellChanged(
                this.cell, this.previous);
        }
    };
}



/**
 * Class: mxCellAttributeChange
 * 
 * Action to change the attribute of a cell's user object.
 * There is no method on the graph model that uses this
 * action. To use the action, you can use the code shown
 * in the example below.
 * 
 * Example:
 * 
 * To change the attributeName in the cell's user object
 * to attributeValue, use the following code:
 * 
 * (code)
 * model.beginUpdate();
 * try
 * {
 *   var edit = new mxCellAttributeChange(
 *     cell, attributeName, attributeValue);
 *   model.execute(edit);
 * }
 * finally
 * {
 *   model.endUpdate();
 * } 
 * (end)
 *
 * Constructor: mxCellAttributeChange
 * 
 * Constructs a change of a attribute of the DOM node
 * stored as the value of the given <mxCell>.
 */
export class mxCellAttributeChange {
    cell: any;
    attribute: any;
    value: any;
    previous: any;
    constructor(cell?: any, attribute?: any, value?: any) {
        this.cell = cell;
        this.attribute = attribute;
        this.value = value;
        this.previous = value;
    }

    /**
     * Function: execute
     * 
     * Changes the attribute of the cell's user object by
     * using <mxCell.setAttribute>.
     */
    execute() {
        if (this.cell != null) {
            var tmp = this.cell.getAttribute(this.attribute);

            if (this.previous == null) {
                this.cell.value.removeAttribute(this.attribute);
            }
            else {
                this.cell.setAttribute(this.attribute, this.previous);
            }

            this.previous = tmp;
        }
    };

}







