

<script setup>
import { ref, onMounted } from 'vue';

import {
  mxGraph,
  mxRubberband,
  mxPoint,
  mxUtils,
  mxCodec,
  mxEditor,
  mxConstants,
  mxPerimeter,
  mxEdgeStyle,
  mxEvent,
  mxSwimlaneManager,
  mxStackLayout,
  mxLayoutManager,
  mxConnectionHandler,
  mxEdgeHandler,
  mxCellHighlight,
  mxVertexHandler,
  mxShape,
  mxCellRenderer,
  mxStencilRegistry,
  mxStencil,
  mxPopupMenu,
} from 'thgraph';

onMounted(() => {
  const container = document.getElementById('graphContainer');
  main(container);
});

function main(container) {
  // Disables built-in context menu
  mxEvent.disableContextMenu(document.body);

  // Changes some default colors
  mxConstants.HANDLE_FILLCOLOR = '#99ccff';
  mxConstants.HANDLE_STROKECOLOR = '#0088cf';
  mxConstants.VERTEX_SELECTION_COLOR = '#00a8ff';

  // Creates the graph inside the given container
  var graph = new mxGraph(container);

  // Enables rubberband selection
  var rubberband = new mxRubberband(graph);

  rubberband.isForceRubberbandEvent = function (me) {
    return (
      mxRubberband.prototype.isForceRubberbandEvent.apply(this, arguments) ||
      mxEvent.isPopupTrigger(me.getEvent())
    );
  };

  // Defines a new popup menu for region selection in the rubberband handler
  rubberband.popupMenu = new mxPopupMenu(function (menu, cell, evt) {
    var rect = new mxRectangle(
      rubberband.x,
      rubberband.y,
      rubberband.width,
      rubberband.height,
    );

    menu.addItem('Show this', null, function () {
      rubberband.popupMenu.hideMenu();
      var bounds = graph.getGraphBounds();
      mxUtils.show(
        graph,
        null,
        bounds.x - rubberband.x,
        bounds.y - rubberband.y,
        rubberband.width,
        rubberband.height,
      );
    });
  });

  var rubberbandMouseDown = rubberband.mouseDown;
  rubberband.mouseDown = function (sender, me) {
    this.popupMenu.hideMenu();
    rubberbandMouseDown.apply(this, arguments);
  };

  var rubberbandMouseUp = rubberband.mouseUp;
  rubberband.mouseUp = function (sender, me) {
    if (this.div != null && mxEvent.isPopupTrigger(me.getEvent())) {
      if (!graph.popupMenuHandler.isMenuShowing()) {
        var origin = mxUtils.getScrollOrigin();
        this.popupMenu.popup(
          me.getX() + origin.x + 1,
          me.getY() + origin.y + 1,
          null,
          me.getEvent(),
        );
        this.reset();
      }
    } else {
      rubberbandMouseUp.apply(this, arguments);
    }
  };

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
  <p>
    Showregion example for mxGraph. This example demonstrates using a custom
    rubberband handler to show the selected region in a new window.
  </p>
  <div id="graphContainer"></div>
  <div id="toolbar"></div>
</template>

<style  lang="less">
#tools {
  display: flex;
  margin-top: 20px;
}

body div.mxPopupMenu {
  -webkit-box-shadow: 3px 3px 6px #c0c0c0;
  -moz-box-shadow: 3px 3px 6px #c0c0c0;
  box-shadow: 3px 3px 6px #c0c0c0;
  background: white;
  position: absolute;
  border: 3px solid #e7e7e7;
  padding: 3px;
}
body table.mxPopupMenu {
  border-collapse: collapse;
  margin: 0px;
}
body tr.mxPopupMenuItem {
  color: black;
  cursor: default;
}
body td.mxPopupMenuItem {
  padding: 6px 60px 6px 30px;
  font-family: Arial;
  font-size: 10pt;
}
body td.mxPopupMenuIcon {
  background-color: white;
  padding: 0px;
}
body tr.mxPopupMenuItemHover {
  background-color: #eeeeee;
  color: black;
}
table.mxPopupMenu hr {
  border-top: solid 1px #cccccc;
}
table.mxPopupMenu tr {
  font-size: 4pt;
}
</style>
