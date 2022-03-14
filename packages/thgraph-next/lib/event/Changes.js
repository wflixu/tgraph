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
export class ThRootChange {
    model;
    root;
    previous;
    constructor(model, root) {
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
