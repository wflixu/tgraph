
// <!--
//   Wrapping example for mxGraph. This example demonstrates using HTML markup and
//   word-wrapping in vertex and edge labels.
// -->

<script setup>
import { ref, onMounted } from 'vue';

import { mxEvent, mxGraph, mxUtils, mxRectangle } from './../../graph/index';

import { mxKeyHandler } from '../../graph/handler/mxKeyHandler';

onMounted(() => {
  const container = document.getElementById('graphContainer');
  main(container);
});

function main(container) {
  // Creates the graph inside the given container
  var graph = new mxGraph(container);

  // Enables HTML labels as wrapping is only available for those
  graph.setHtmlLabels(true);

  // Disables in-place editing for edges
  graph.isCellEditable = function (cell) {
    return !this.model.isEdge(cell);
  };

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  var parent = graph.getDefaultParent();

  // Adds cells to the model in a single step
  graph.getModel().beginUpdate();
  try {
    var v1 = graph.insertVertex(
      parent,
      null,
      'Cum Caesar vidisset, portum plenum esse, iuxta navigavit.',
      20,
      20,
      100,
      70,
      'whiteSpace=wrap;',
    );
    var v2 = graph.insertVertex(
      parent,
      null,
      'Cum Caesar vidisset, portum plenum esse, iuxta navigavit.',
      220,
      150,
      80,
      70,
      'whiteSpace=wrap;',
    );
    var e1 = graph.insertEdge(
      parent,
      null,
      'Cum Caesar vidisset, portum plenum esse, iuxta navigavit.',
      v1,
      v2,
      'whiteSpace=wrap;',
    );
    e1.geometry.width = 100;
  } finally {
    // Updates the display
    graph.getModel().endUpdate();
  }
}
</script>

<template>
 <p>
    Wrapping example for mxGraph. This example demonstrates using HTML markup
    and word-wrapping in vertex and edge labels.
  </p>
  <div id="graphContainer"></div>
 
</template>

<style  lang="less">
</style>
