import { mxGraph, mxEvent, mxClient, mxCodec } from 'thgraph';

export function main(container) {
  // var obj = new Object();
  // obj.foo = "Foo";
  // obj.bar = "Bar";
  //  var enc = new mxCodec();
  //  var node = enc.encode(obj);
  //  console.log('#**@'.repeat(10));
  //  console.log(node);

  // Creates the graph inside the given container
  var graph = new mxGraph(container);

  // Enables rubberband selection
  // new mxRubberband(graph);

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  var parent = graph.getDefaultParent();

  // Adds cells to the model in a single step
  graph.getModel().beginUpdate();
  try {
    var v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
    // var v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
    // var e1 = graph.insertEdge(parent, null, '', v1, v2);
  } finally {
    // Updates the display
    graph.getModel().endUpdate();
  }

  console.log(graph, graph.getModel());
}
