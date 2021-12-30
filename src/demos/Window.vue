

<script setup>
import { ref, onMounted, reactive } from 'vue';
import MxWindow from '../../graph/components/MxWindow.vue';

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
  // Note that we're using the container scrollbars for the graph so that the
  // container extends to the parent div inside the window
//   var wnd = new mxWindow(
//     'Scrollable, resizable, given height',
//     container,
//     50,
//     50,
//     220,
//     224,
//     true,
//     true,
//   );

  // Creates the graph inside the given container
  var graph = new mxGraph(container);

  // Adds rubberband selection and keystrokes
  graph.setTooltips(true);
  graph.setPanning(true);
  var rubberband = new mxRubberband(graph);
  new mxKeyHandler(graph);

  mxEvent.disableContextMenu(container);

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

//   wnd.setMaximizable(true);
//   wnd.setResizable(true);
//   wnd.setVisible(true);

//   var lorem =
//     'Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ';
//   var content = document.createElement('div');
//   mxUtils.write(content, lorem + lorem + lorem);

//   wnd = new mxWindow(
//     'Scrollable, resizable, auto height',
//     content,
//     300,
//     50,
//     200,
//     null,
//     true,
//     true,
//   );
//   wnd.setMaximizable(true);
//   wnd.setScrollable(true);
//   wnd.setResizable(true);
//   wnd.setVisible(true);

//   content = content.cloneNode(true);
//   content.style.width = '400px';

//   wnd = new mxWindow(
//     'Scrollable, resizable, fixed content',
//     content,
//     520,
//     50,
//     220,
//     200,
//     true,
//     true,
//   );
//   wnd.setMaximizable(true);
//   wnd.setScrollable(true);
//   wnd.setResizable(true);
//   wnd.setVisible(true);

//   mxLog.show();

}

const css  =reactive({
	color:'red'
})
</script>

<template>
  <p class="desc">
    Windows example for mxGraph. This example demonstrates using the mxWindow
    class for displaying windows.
  </p>
  <mx-window title="Scrollable, resizable, auto height">
    <div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit ab quam
      incidunt vel repellat nemo nihil veritatis. Corporis repellendus sapiente
      amet, esse, mollitia vero voluptatibus corrupti quasi, debitis rem nobis.
    </div>
  </mx-window>
  <div id="graphContainer"></div>
  <div id="tools"></div>
</template>

<style   lang="less">
#tools {
  display: flex;
  margin-top: 20px;
}
.desc {
  color:v-bind("css.color");
}
</style>
