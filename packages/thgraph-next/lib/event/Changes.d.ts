import { ThCell } from './../model/ThCell';
import { ThGraphModel } from './../model/ThGraphModel';
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
export declare class ThRootChange {
    model: ThGraphModel;
    root: ThCell;
    previous: ThCell;
    constructor(model: ThGraphModel, root: ThCell);
    /**
     * Function: execute
     *
     * Carries out a change of the root using
     * <mxGraphModel.rootChanged>.
     */
    execute(): void;
}
