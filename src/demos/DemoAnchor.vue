
<script setup>
import { ref, onMounted } from 'vue';
import { mxRubberband } from '../../graph/handler/mxRubberband';
import { mxPolyline } from '../../graph/shape/mxPolyline';
import { mxShape } from '../../graph/shape/mxShape';
import { mxPoint } from '../../graph/util/mxPoint';
import { mxConnectionConstraint } from '../../graph/view/mxConnectionConstraint';

import { mxEvent } from './../../graph/util/mxEvent';
import { mxGraph } from './../../graph/view/mxGraph';


onMounted(() => {
  main();
});

// Overridden to define per-shape connection points
mxGraph.prototype.getAllConnectionConstraints = function (terminal, source) {
  if (terminal != null && terminal.shape != null) {
    if (terminal.shape.stencil != null) {
      if (terminal.shape.stencil.constraints != null) {
        return terminal.shape.stencil.constraints;
      }
    } else if (terminal.shape.constraints != null) {
      return terminal.shape.constraints;
    }
  }

  return null;
};

// Defines the default constraints for all shapes
mxShape.prototype.constraints = [
  new mxConnectionConstraint(new mxPoint(0.25, 0), true),
  new mxConnectionConstraint(new mxPoint(0.5, 0), true),
  new mxConnectionConstraint(new mxPoint(0.75, 0), true),
  new mxConnectionConstraint(new mxPoint(0, 0.25), true),
  new mxConnectionConstraint(new mxPoint(0, 0.5), true),
  new mxConnectionConstraint(new mxPoint(0, 0.75), true),
  new mxConnectionConstraint(new mxPoint(1, 0.25), true),
  new mxConnectionConstraint(new mxPoint(1, 0.5), true),
  new mxConnectionConstraint(new mxPoint(1, 0.75), true),
  new mxConnectionConstraint(new mxPoint(0.25, 1), true),
  new mxConnectionConstraint(new mxPoint(0.5, 1), true),
  new mxConnectionConstraint(new mxPoint(0.75, 1), true),
];

// Edges have no connection points
mxPolyline.prototype.constraints = null;

function main() {
  // Disables the built-in context menu
  const container = document.getElementById('graphContainer');
  mxEvent.disableContextMenu(container);
  // Creates the graph inside the given container
  var graph = new mxGraph(container);
  graph.setConnectable(true);

  // Enables connect preview for the default edge style
  graph.connectionHandler.createEdgeState = function (me) {
    var edge = graph.createEdge(null, null, null, null, null);

    return new mxCellState(
      this.graph.view,
      edge,
      this.graph.getCellStyle(edge),
    );
  };

  // Specifies the default edge style
  graph.getStylesheet().getDefaultEdgeStyle()['edgeStyle'] =
    'orthogonalEdgeStyle';

  // Enables rubberband selection
  new mxRubberband(graph);

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  var parent = graph.getDefaultParent();

  // Adds cells to the model in a single step
  graph.getModel().beginUpdate();
  try {
    var v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
    var v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
    var e1 = graph.insertEdge(parent, null, '', v1, v2);
  } finally {
    // Updates the display
    graph.getModel().endUpdate();
  }
}
</script>

<template>
  <div id="graphContainer" style>test</div>
</template>

<style scoped>
a {
  color: #42b983;
}
#graphContainer {
  overflow: hidden;
  width: 600px;
  height: 400px;
  background: url('./../assets/images/grid.gif');
  cursor: default;
  border: 1px solid red;
}
</style>
