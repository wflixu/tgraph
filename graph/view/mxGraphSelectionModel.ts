import { TGraph } from "./mxGraph";

export class mxGraphSelectionModel {
    graph: TGraph;
    cells: any[];
    constructor(graph: TGraph) {
        this.graph = graph;
        this.cells = [];
    }
}