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
 export class ThRootChange {
    model: ThGraphModel;
     root: ThCell;
     previous: ThCell;
    constructor(model:ThGraphModel, root:ThCell) {
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