export declare class ThChange {
    model: any;
    constructor(model: any);
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
export declare class ThRootChange extends ThChange {
    root: any;
    previous: any;
    constructor(model: any, root: any);
    /**
     * Function: execute
     *
     * Carries out a change of the root using
     * <mxGraphModel.rootChanged>.
     */
    execute(): void;
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
export declare class ThChildChange extends ThChange {
    parent: any;
    previous: any;
    child: any;
    index: any;
    previousIndex: any;
    constructor(model: any, parent: any, child: any, index: number);
    /**
     * Function: execute
     *
     * Changes the parent of <child> using
     * <mxGraphModel.parentForCellChanged> and
     * removes or restores the cell's
     * connections.
     */
    execute(): void;
    /**
     * Function: disconnect
     *
     * Disconnects the given cell recursively from its
     * terminals and stores the previous terminal in the
     * cell's terminals.
     */
    connect(cell: any, isConnect: any): void;
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
export declare class ThTerminalChange extends ThChange {
    cell: any;
    terminal: any;
    previous: any;
    source: any;
    constructor(model: any, cell: any, terminal: any, source: any);
    /**
     * Function: execute
     *
     * Changes the terminal of <cell> to <previous> using
     * <mxGraphModel.terminalForCellChanged>.
     */
    execute(): void;
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
export declare class ThValueChange extends ThChange {
    cell: any;
    value: any;
    previous: any;
    constructor(model: any, cell: any, value: any);
    /**
     * Function: execute
     *
     * Changes the value of <cell> to <previous> using
     * <mxGraphModel.valueForCellChanged>.
     */
    execute(): void;
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
export declare class ThStyleChange extends ThChange {
    cell: any;
    style: any;
    previous: any;
    constructor(model: any, cell: any, style: any);
    /**
     * Function: execute
     *
     * Changes the style of <cell> to <previous> using
     * <mxGraphModel.styleForCellChanged>.
     */
    execute(): void;
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
export declare class ThGeometryChange extends ThChange {
    cell: any;
    geometry: any;
    previous: any;
    constructor(model: any, cell: any, geometry: any);
    /**
     * Function: execute
     *
     * Changes the geometry of <cell> ro <previous> using
     * <mxGraphModel.geometryForCellChanged>.
     */
    execute(): void;
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
export declare class ThCollapseChange extends ThChange {
    cell: any;
    collapsed: any;
    previous: any;
    constructor(model: any, cell: any, collapsed: any);
    /**
     * Function: execute
     *
     * Changes the collapsed state of <cell> to <previous> using
     * <mxGraphModel.collapsedStateForCellChanged>.
     */
    execute(): void;
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
export declare class ThVisibleChange extends ThChange {
    cell: any;
    visible: any;
    previous: any;
    constructor(model: any, cell: any, visible: any);
    /**
     * Function: execute
     *
     * Changes the visible state of <cell> to <previous> using
     * <mxGraphModel.visibleStateForCellChanged>.
     */
    execute(): void;
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
export declare class ThCellAttributeChange {
    cell: any;
    attribute: any;
    value: any;
    previous: any;
    constructor(cell: any, attribute: any, value: any);
    /**
     * Function: execute
     *
     * Changes the attribute of the cell's user object by
     * using <mxCell.setAttribute>.
     */
    execute(): void;
}
