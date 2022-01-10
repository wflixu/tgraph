
<script setup>
import { ref, onMounted } from 'vue';

import {
  mxEvent,
  mxGraph,
  mxUtils,
  mxKeyHandler,
  mxParallelEdgeLayout,
  mxLayoutManager,
  mxRubberband,
  mxConstants,
  mxEdgeStyle
} from 'thgraph';

onMounted(() => {
  const container = document.getElementById('graphContainer');
  main(container);
});

function main(container) {
  // Creates the graph inside the DOM node.
  // Optionally you can enable panning, tooltips and connections
  // using graph.setPanning(), setTooltips() & setConnectable().
  // To enable rubberband selection and basic keyboard events,
  // use new mxRubberband(graph) and new mxKeyHandler(graph).
  var graph = new mxGraph(container);

  // Enables tooltips, new connections and panning
  graph.setPanning(true);
  graph.setTooltips(true);
  graph.setConnectable(true);

  // Automatically handle parallel edges
  var layout = new mxParallelEdgeLayout(graph);
  var layoutMgr = new mxLayoutManager(graph);

  layoutMgr.getLayout = function (cell) {
    if (cell.getChildCount() > 0) {
      return layout;
    }
  };

  // Enables rubberband (marquee) selection and a handler
  // for basic keystrokes (eg. return, escape during editing).
  var rubberband = new mxRubberband(graph);
  var keyHandler = new mxKeyHandler(graph);

  // Changes the default style for edges "in-place" and assigns
  // an alternate edge style which is applied in mxGraph.flip
  // when the user double clicks on the adjustment control point
  // of the edge. The ElbowConnector edge style switches to TopToBottom
  // if the horizontal style is true.
  var style = graph.getStylesheet().getDefaultEdgeStyle();
  style[mxConstants.STYLE_ROUNDED] = true;
  style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;

  graph.alternateEdgeStyle = 'elbow=vertical';

  // Installs a custom tooltip for cells
  graph.getTooltipForCell = function (cell) {
    return 'Doubleclick and right- or shiftclick';
  };

  // Installs a popupmenu handler using local function (see below).
  graph.popupMenuHandler.factoryMethod = function (menu, cell, evt) {
    return createPopupMenu(graph, menu, cell, evt);
  };

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  var parent = graph.getDefaultParent();

  // Adds cells to the model in a single step
  graph.getModel().beginUpdate();
  try {
    var v1 = graph.insertVertex(parent, null, 'Doubleclick', 20, 20, 80, 30);
    var v2 = graph.insertVertex(
      parent,
      null,
      'Right-/Shiftclick',
      200,
      150,
      120,
      30,
    );
    var v3 = graph.insertVertex(
      parent,
      null,
      'Connect/Reconnect',
      200,
      20,
      120,
      30,
    );
    var v4 = graph.insertVertex(parent, null, 'Control-Drag', 20, 150, 100, 30);
    var e1 = graph.insertEdge(parent, null, 'Tooltips', v1, v2);
    var e2 = graph.insertEdge(parent, null, '', v2, v3);
  } finally {
    // Updates the display
    graph.getModel().endUpdate();
  }
}

// Function to create the entries in the popupmenu
function createPopupMenu(graph, menu, cell, evt) {
  if (cell != null) {
    menu.addItem('Cell Item', 'editors/images/image.gif', function () {
      mxUtils.alert('MenuItem1');
    });
  } else {
    menu.addItem('No-Cell Item', 'editors/images/image.gif', function () {
      mxUtils.alert('MenuItem2');
    });
  }
  menu.addSeparator();
  menu.addItem('MenuItem3', '../src/images/warning.gif', function () {
    mxUtils.alert('MenuItem3: ' + graph.getSelectionCount() + ' selected');
  });
}
</script>

<template>
  <p>
    Editing example for mxGraph. This example demonstrates using the in-place
    editor trigger to specify the editing value and write the new value into a
    specific field of the user object. Wrapping and DOM nodes as labels are also
    demonstrated here.
  </p>
  <div id="graphContainer"></div>
</template>

<style  lang="less">
</style>