

<script setup>
import { ref, onMounted } from 'vue';
import collapsed from './../assets/images/collapsed.gif';
import expanded from './../assets/images/expanded.gif';
import {
  mxCylinder,
  mxCellRenderer,
  mxGraphView,
  mxGraph,
  mxImage,
  mxClient,
  mxConstants,
  mxEdgeStyle,
  mxKeyHandler,
  mxCompactTreeLayout,
  mxLayoutManager,
  mxRectangle,
  mxPoint,
} from 'thgraph';

onMounted(() => {
  const container = document.getElementById('graphContainer');
  main(container);
});

function main(container) {
  // Creates the graph inside the given container
  var graph = new mxGraph(container);

  // Disables basic selection and cell handling
  graph.setEnabled(false);

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  var parent = graph.getDefaultParent();
  var v1, v2, e1;

  // Adds cells to the model in a single step
  graph.getModel().beginUpdate();
  try {
    v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
    v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
    e1 = graph.insertEdge(parent, null, '', v1, v2);
  } finally {
    // Updates the display
    graph.getModel().endUpdate();
  }

  // Function to switch the overlay every 5 secs
  var f = function () {
    var overlays = graph.getCellOverlays(v1);

    if (overlays == null) {
      graph.removeCellOverlays(v2);
      graph.setCellWarning(v1, 'Tooltip');
    } else {
      graph.removeCellOverlays(v1);
      graph.setCellWarning(v2, 'Tooltip');
    }
  };

  window.setInterval(f, 1000);
  f();
}
</script>

<template>
  <p>
    Thread example for mxGraph. This example demonstrates setting overlays in
    mxGraph from within a timed function.
  </p>
  <div id="graphContainer"></div>
  <div id="toolbar"></div>
</template>

<style  scoped lang="less">
#tools {
  display: flex;
  margin-top: 20px;
}
</style>
