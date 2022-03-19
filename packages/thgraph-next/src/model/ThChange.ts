

export class ThChange {
    model: any;
    constructor(model: any) {
        this.model = model;
    }
}

/**
 * Class: ThRootChange
 *
 * Action to change the root in a model.
 *
 * Constructor: ThRootChange
 *
 * Constructs a change of the root in the
 * specified model.
 */
export class ThRootChange extends ThChange {
    root: any;
    previous: any;
    constructor(model: any, root: any) {
        super(model);
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
        this.previous = this.model.rootChanged(this.previous);
    }
}



/**
 * Class: ThChildChange
 *
 * Action to add or remove a child in a model.
 *
 * Constructor: ThChildChange
 *
 * Constructs a change of a child in the
 * specified model.
 */
export class ThChildChange extends ThChange {
    parent: any;
    previous: any;
    child: any;
    index: any;
    previousIndex: any;
    constructor(model: any, parent: any, child: any, index: number) {
        super(model);
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
            var tmp2 = tmp != null ? tmp.getIndex(this.child) : 0;

            if (this.previous == null) {
                this.connect(this.child, false);
            }

            tmp = this.model.parentForCellChanged(
                this.child,
                this.previous,
                this.previousIndex,
            );

            if (this.previous != null) {
                this.connect(this.child, true);
            }

            this.parent = this.previous;
            this.previous = tmp;
            this.index = this.previousIndex;
            this.previousIndex = tmp2;
        }
    }

    /**
     * Function: disconnect
     *
     * Disconnects the given cell recursively from its
     * terminals and stores the previous terminal in the
     * cell's terminals.
     */
    connect(cell: any, isConnect: any) {
        isConnect = isConnect != null ? isConnect : true;

        var source = cell.getTerminal(true);
        var target = cell.getTerminal(false);

        if (source != null) {
            if (isConnect) {
                this.model.terminalForCellChanged(cell, source, true);
            } else {
                this.model.terminalForCellChanged(cell, null, true);
            }
        }

        if (target != null) {
            if (isConnect) {
                this.model.terminalForCellChanged(cell, target, false);
            } else {
                this.model.terminalForCellChanged(cell, null, false);
            }
        }

        cell.setTerminal(source, true);
        cell.setTerminal(target, false);

        var childCount = this.model.getChildCount(cell);

        for (var i = 0; i < childCount; i++) {
            this.connect(this.model.getChildAt(cell, i), isConnect);
        }
    }
}

/**
 * Class: ThTerminalChange
 *
 * Action to change a terminal in a model.
 *
 * Constructor: ThTerminalChange
 *
 * Constructs a change of a terminal in the
 * specified model.
 */
export class ThTerminalChange extends ThChange {
    cell: any;
    terminal: any;
    previous: any;
    source: any;
    constructor(model: any, cell: any, terminal: any, source: any) {
        super(model);
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
                this.cell,
                this.previous,
                this.source,
            );
        }
    }
}

/**
 * Class: ThValueChange
 *
 * Action to change a user object in a model.
 *
 * Constructor: ThValueChange
 *
 * Constructs a change of a user object in the
 * specified model.
 */
export class ThValueChange extends ThChange {
    cell: any;
    value: any;
    previous: any;
    constructor(model: any, cell: any, value: any) {
        super(model);
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
            this.previous = this.model.valueForCellChanged(this.cell, this.previous);
        }
    }
}

/**
 * Class: ThStyleChange
 *
 * Action to change a cell's style in a model.
 *
 * Constructor: ThStyleChange
 *
 * Constructs a change of a style in the
 * specified model.
 */
export class ThStyleChange extends ThChange {
    cell: any;
    style: any;
    previous: any;
    constructor(model: any, cell: any, style: any) {
        super(model);
        this.cell = cell;
        this.style = style;
        this.previous = style;
    }

    /**
     * Function: execute
     *
     * Changes the style of <cell> to <previous> using
     * <mxGraphModel.styleForCellChanged>.
     */
    execute() {
        if (this.cell != null) {
            this.style = this.previous;
            this.previous = this.model.styleForCellChanged(this.cell, this.previous);
        }
    }
}

/**
 * Class: ThGeometryChange
 *
 * Action to change a cell's geometry in a model.
 *
 * Constructor: ThGeometryChange
 *
 * Constructs a change of a geometry in the
 * specified model.
 */
export class ThGeometryChange  extends ThChange{
    cell: any;
    geometry: any;
    previous: any;
    constructor(model: any, cell: any, geometry: any) {
        super(model);
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
                this.cell,
                this.previous,
            );
        }
    }
}

/**
 * Class: ThCollapseChange
 *
 * Action to change a cell's collapsed state in a model.
 *
 * Constructor: ThCollapseChange
 *
 * Constructs a change of a collapsed state in the
 * specified model.
 */
export class ThCollapseChange extends ThChange {
    cell: any;
    collapsed: any;
    previous: any;
    constructor(model: any, cell: any, collapsed: any) {
        super(model);
        this.cell = cell;
        this.collapsed = collapsed;
        this.previous = collapsed;
    }

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
                this.cell,
                this.previous,
            );
        }
    }
}

/**
 * Class: ThVisibleChange
 *
 * Action to change a cell's visible state in a model.
 *
 * Constructor: ThVisibleChange
 *
 * Constructs a change of a visible state in the
 * specified model.
 */
export class ThVisibleChange  extends ThChange{
    cell: any;
    visible: any;
    previous: any;
    constructor(model: any, cell: any, visible: any) {
        super(model);
        this.cell = cell;
        this.visible = visible;
        this.previous = visible;
    }

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
                this.cell,
                this.previous,
            );
        }
    }
}

/**
 * Class: ThCellAttributeChange
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
 *   var edit = new ThCellAttributeChange(
 *     cell, attributeName, attributeValue);
 *   model.execute(edit);
 * }
 * finally
 * {
 *   model.endUpdate();
 * }
 * (end)
 *
 * Constructor: ThCellAttributeChange
 *
 * Constructs a change of a attribute of the DOM node
 * stored as the value of the given <mxCell>.
 */
export class ThCellAttributeChange {
    cell: any;
    attribute: any;
    value: any;
    previous: any;
    constructor(cell: any, attribute: any, value: any) {
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
            } else {
                this.cell.setAttribute(this.attribute, this.previous);
            }

            this.previous = tmp;
        }
    }
}
