

<script setup>
import { ref, onMounted } from 'vue';

import {
  mxEvent,
  mxGraph,
  mxRectangle,
  mxConnectionHandler,
  mxConstants,
  mxImage,
  mxConstraintHandler,
  mxGraphHandler,
  mxGuide,
  mxEdgeHandler,
  mxGraphView,
  mxEdgeSegmentHandler,
  mxCylinder,
  mxCellRenderer,
  mxEdgeStyle,
  mxStyleRegistry,
  mxCellHighlight,
  mxRubberband,
  mxKeyHandler,
  mxLog,
  mxClient,
  mxWindow,
  mxUtils,
} from '../../graph/index';

onMounted(() => {
  const container = document.getElementById('graphContainer');
  main(container);
});

function main(container) {
  // Creates the graph inside the given container
  var graph = new mxGraph(container);

  // Enables rubberband selection
  new mxRubberband(graph);

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  var parent = graph.getDefaultParent();

  var showOne = true;
  var showTwo = true;
  var showThree = true;

  // Overridden to implement dynamic conditions
  graph.isCellVisible = function (cell) {
    var result = mxGraph.prototype.isCellVisible.apply(this, arguments);

    if (result && cell.value != null) {
      result =
        (showOne && cell.value == '1') ||
        (showTwo && cell.value == '2') ||
        (showThree && cell.value == '3');
    }

    return result;
  };

  // Adds cells to the model in a single step
  var v1;
  graph.getModel().beginUpdate();
  try {
    v1 = graph.insertVertex(parent, null, '1', 20, 20, 80, 30);
    var v2 = graph.insertVertex(parent, null, '2', 200, 150, 80, 30);
    var e1 = graph.insertEdge(parent, null, '3', v1, v2);
  } finally {
    // Updates the display
    graph.getModel().endUpdate();
  }

  // Dynamic conditions (requires refresh)
  document.body.appendChild(
    mxUtils.button('Cond 1', function () {
      showOne = !showOne;
      graph.refresh();
    }),
  );
  document.body.appendChild(
    mxUtils.button('Cond 2', function () {
      showTwo = !showTwo;
      graph.refresh();
    }),
  );
  document.body.appendChild(
    mxUtils.button('Cond 3', function () {
      showThree = !showThree;
      graph.refresh();
    }),
  );

  // Explicit show/hide
  document.body.appendChild(
    mxUtils.button('Toggle cell', function () {
      graph.toggleCells(!graph.getModel().isVisible(v1), [v1], true);
    }),
  );

  // Explicit remove/add
  var removed = null;

  document.body.appendChild(
    mxUtils.button('Add/remove cell', function () {
      if (removed != null) {
        graph.addCells(removed);
        removed = null;
      } else {
        removed = graph.removeCells([v1]);
      }
    }),
  );
}
</script>

<template>
  <p>
    Visible example for mxGraph. This example demonstrates using various
    solutions for hiding and showing cells.
  </p>
  <div id="graphContainer"></div>
  <div id="tools"></div>
</template>

<style  scoped lang="less">
#tools {
  display: flex;
  margin-top: 20px;
}
</style>
