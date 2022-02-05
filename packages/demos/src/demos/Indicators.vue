

<script setup>
import { ref, onMounted } from 'vue';

import {
  mxGraph,
  mxKeyHandler,
  mxConstants,
  mxEdgeStyle,
  

} from 'thgraph';

onMounted(() => {
  const container = document.getElementById('graphContainer');
  main(container);
});

function main(container) {
  // Creates the graph inside the given container
  var graph = new mxGraph(container);
  graph.setConnectable(true);
  new mxKeyHandler(graph);

  // Enables moving of vertex labels
  graph.vertexLabelsMovable = true;

  // Creates a style with an indicator
  var style = graph.getStylesheet().getDefaultVertexStyle();

  style[mxConstants.STYLE_SHAPE] = 'label';
  style[mxConstants.STYLE_VERTICAL_ALIGN] = 'bottom';
  style[mxConstants.STYLE_INDICATOR_SHAPE] = 'ellipse';
  style[mxConstants.STYLE_INDICATOR_WIDTH] = 34;
  style[mxConstants.STYLE_INDICATOR_HEIGHT] = 34;
  style[mxConstants.STYLE_IMAGE_VERTICAL_ALIGN] = 'top'; // indicator v-alignment
  style[mxConstants.STYLE_IMAGE_ALIGN] = 'center';
  style[mxConstants.STYLE_INDICATOR_COLOR] = 'green';
  delete style[mxConstants.STYLE_STROKECOLOR]; // transparent
  delete style[mxConstants.STYLE_FILLCOLOR]; // transparent

  // Creates a style with an indicator
  var style = graph.getStylesheet().getDefaultEdgeStyle();

  style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
  style[mxConstants.STYLE_ELBOW] = mxConstants.ELBOW_VERTICAL;
  style[mxConstants.STYLE_ROUNDED] = true;

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  var parent = graph.getDefaultParent();

  // Adds cells to the model in a single step
  graph.getModel().beginUpdate();
  try {
    graph.insertVertex(parent, null, 'Bottom Label', 80, 80, 80, 60);
    graph.insertVertex(
      parent,
      null,
      'Top Label',
      200,
      80,
      60,
      60,
      'indicatorShape=actor;indicatorWidth=28;indicatorColor=blue;imageVerticalAlign=bottom;verticalAlign=top',
    );
    graph.insertVertex(
      parent,
      null,
      'Right Label',
      300,
      80,
      120,
      60,
      'indicatorShape=cloud;indicatorWidth=40;indicatorColor=#00FFFF;imageVerticalAlign=center;verticalAlign=middle;imageAlign=left;align=left;spacingLeft=44',
    );
  } finally {
    // Updates the display
    graph.getModel().endUpdate();
  }
}
</script>

<template>
  <p class="demo-desc">
    <span class="em">basic</span>
    Indicators example for mxGraph. This example demonstrates the use of
    indicators, which are small subshapes inside a parent shape, typically an
    mxLabel.
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
