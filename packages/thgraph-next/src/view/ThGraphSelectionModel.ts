import { ThCell } from './../model/ThCell';
import { ThGraph } from './ThGraph';

export class ThGraphSelectionModel {
    cells:ThCell[] = [];
    graph: ThGraph;
    constructor(graph:ThGraph){
      this.graph = graph;
    }
}