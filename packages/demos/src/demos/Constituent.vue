
<script setup>
import { ref, onMounted } from 'vue';

import {
  mxCellRenderer,
  mxEvent,
  mxGraph,
  mxGraphHandler,
  mxCellOverlay,
  mxImage,
  mxHierarchicalLayout,
  mxEdgeHandler,
  mxMorphing,
} from 'thgraph';

import { mxRubberband } from '../../graph/handler/mxRubberband';

/**
 * Redirects start drag to parent.
 */
var graphHandlerGetInitialCellForEvent =
  mxGraphHandler.prototype.getInitialCellForEvent;
mxGraphHandler.prototype.getInitialCellForEvent = function (me) {
  var cell = graphHandlerGetInitialCellForEvent.apply(this, arguments);

  if (this.graph.isPart(cell)) {
    cell = this.graph.getModel().getParent(cell);
  }

  return cell;
};

onMounted(() => {
  const container = document.getElementById('graphContainer');
  main(container);
});

function main(container) {
  // Disables the built-in context menu
  mxEvent.disableContextMenu(container);

  // Creates the graph inside the given container
  var graph = new mxGraph(container);
  graph.foldingEnabled = false;
  graph.recursiveResize = true;

  // Helper method to mark parts with constituent=1 in the style
  graph.isPart = function (cell) {
    return this.getCurrentCellStyle(cell)['constituent'] == '1';
  };

  // Redirects selection to parent
  graph.selectCellForEvent = function (cell) {
    if (this.isPart(cell)) {
      cell = this.model.getParent(cell);
    }

    mxGraph.prototype.selectCellForEvent.apply(this, arguments);
  };

  // Enables rubberband selection
  new mxRubberband(graph);

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  var parent = graph.getDefaultParent();

  // Adds cells to the model in a single step
  graph.getModel().beginUpdate();
  try {
    var v1 = graph.insertVertex(parent, null, '', 20, 20, 120, 70);
    var v2 = graph.insertVertex(
      v1,
      null,
      'Constituent',
      20,
      20,
      80,
      30,
      'constituent=1;',
    );
  } finally {
    // Updates the display
    graph.getModel().endUpdate();
  }
}
</script>

<template>
  <div id="graphContainer"></div>
</template>

<style  lang="less">
</style>
