

<script setup>
import { ref, onMounted } from 'vue';

import {
  mxGraph,
  mxRubberband,
  mxUtils,
  mxGraphModel,
  mxPoint,
  mxCell,
} from 'thgraph';

onMounted(() => {
  const container = document.getElementById('graphContainer');
  main(container);
});

function main(container) {
  // Creates the graph inside the given container using a model
  // with a custom root and two layers. Layers can also be added
  // dynamically using var layer = model.add(root, new mxCell()).
  var root = new mxCell();
  var layer0 = root.insert(new mxCell());
  var layer1 = root.insert(new mxCell());
  var model = new mxGraphModel(root);

  var graph = new mxGraph(container, model);

  // Disables basic selection and cell handling
  graph.setEnabled(false);

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  var parent = graph.getDefaultParent();

  // Adds cells to the model in a single step
  model.beginUpdate();
  try {
    var v1 = graph.insertVertex(
      layer1,
      null,
      'Hello,',
      20,
      20,
      80,
      30,
      'fillColor=#C0C0C0',
    );
    var v2 = graph.insertVertex(
      layer1,
      null,
      'Hello,',
      200,
      20,
      80,
      30,
      'fillColor=#C0C0C0',
    );
    var v3 = graph.insertVertex(layer0, null, 'World!', 110, 150, 80, 30);
    var e1 = graph.insertEdge(layer1, null, '', v1, v3, 'strokeColor=#0C0C0C');
    e1.geometry.points = [new mxPoint(60, 165)];
    var e2 = graph.insertEdge(layer0, null, '', v2, v3);
    e2.geometry.points = [new mxPoint(240, 165)];
    var e3 = graph.insertEdge(
      layer0,
      null,
      '',
      v1,
      v2,
      'edgeStyle=topToBottomEdgeStyle',
    );
    e3.geometry.points = [new mxPoint(150, 30)];
    var e4 = graph.insertEdge(
      layer1,
      null,
      '',
      v2,
      v1,
      'strokeColor=#0C0C0C;edgeStyle=topToBottomEdgeStyle',
    );
    e4.geometry.points = [new mxPoint(150, 40)];
  } finally {
    // Updates the display
    model.endUpdate();
  }
  let toolbar = document.getElementById('toolbar')
  toolbar.appendChild(
    mxUtils.button('Layer 0', function () {
      model.setVisible(layer0, !model.isVisible(layer0));
    }),
  );

  toolbar.appendChild(
    mxUtils.button('Layer 1', function () {
      model.setVisible(layer1, !model.isVisible(layer1));
    }),
  );
}
</script>

<template>

  <p>
    <span class="sub-em">basic</span>
    Layers example for mxGraph. This example demonstrates using multiple layers
    to contain cells.
  </p>
  <div id="graphContainer"></div>
  <div id="toolbar"></div>
</template>

<style  lang="less" scoped>
#tools {
  display: flex;
  margin-top: 20px;
}

#graphContainer {
  width: 1200px;
  height: 800px;
}
</style>
