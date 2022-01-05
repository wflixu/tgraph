

<script setup>
import { ref, onMounted } from 'vue';

import {
  mxGraph,
  mxRubberband,
  mxConstants,
  mxPerimeter,
  mxRadialTreeLayout,
  mxRectangleShape,
} from 'thgraph';

onMounted(() => {
  var mxRectangleShapeIsHtmlAllowed = mxRectangleShape.prototype.isHtmlAllowed;
  mxRectangleShape.prototype.isHtmlAllowed = function () {
    return (
      mxRectangleShapeIsHtmlAllowed.apply(this, arguments) && this.state == null
    );
  };

  let mxRectangleShapePaintForeground =
    mxRectangleShape.prototype.paintForeground;
  mxRectangleShape.prototype.paintForeground = function (c, x, y, w, h) {
    if (
      this.state != null &&
      this.state.cell.geometry != null &&
      !this.state.cell.geometry.relative
    ) {
      c.setFontColor('#a0a0a0');
      c.text(x + 2, y, 0, 0, this.state.cell.id, 'left', 'top');
    }

    mxRectangleShapePaintForeground.apply(this, arguments);
  };
  const container = document.getElementById('graphContainer');
  main(container);
});

function main(container) {
  // Creates the graph inside the given container
  var graph = new mxGraph(container);

  // Adds rubberband selection
  new mxRubberband(graph);

  // Changes the default vertex style in-place
  var style = graph.getStylesheet().getDefaultVertexStyle();
  style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
  style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
  style[mxConstants.STYLE_PERIMETER_SPACING] = 6;
  style[mxConstants.STYLE_ROUNDED] = true;
  style[mxConstants.STYLE_SHADOW] = true;

  style = graph.getStylesheet().getDefaultEdgeStyle();
  style[mxConstants.STYLE_ROUNDED] = true;

  // Creates a layout algorithm to be used
  // with the graph
  var layout = new mxRadialTreeLayout(graph);

  var parent = graph.getDefaultParent();

  // Load cells and layouts the graph
  graph.getModel().beginUpdate();
  try {
    var v1 = graph.insertVertex(parent, null, '1', 500, 500, 80, 30);
    var v2 = graph.insertVertex(parent, null, '2.1', 0, 0, 80, 30);
    var v3 = graph.insertVertex(parent, null, '2.2', 0, 0, 80, 30);
    var v4 = graph.insertVertex(parent, null, '3.1', 0, 0, 80, 30);
    var v4_1 = graph.insertVertex(parent, null, '3.2', 0, 0, 80, 30);
    var v4_2 = graph.insertVertex(parent, null, '3.3', 0, 0, 80, 30);
    var v4_3 = graph.insertVertex(parent, null, '3.6', 0, 0, 80, 30);
    var v4_4 = graph.insertVertex(parent, null, '3.7', 0, 0, 80, 30);
    var v5 = graph.insertVertex(parent, null, '3.4', 0, 0, 80, 30);
    var v6 = graph.insertVertex(parent, null, '2.3', 0, 0, 80, 30);
    var v7 = graph.insertVertex(parent, null, '4.1', 0, 0, 80, 30);
    var v7_1 = graph.insertVertex(parent, null, '4.2', 0, 0, 80, 30);
    var v7_2 = graph.insertVertex(parent, null, '4.3', 0, 0, 80, 30);
    var v7_3 = graph.insertVertex(parent, null, '4.4', 0, 0, 80, 30);
    var v7_4 = graph.insertVertex(parent, null, '4.5', 0, 0, 80, 30);
    var v7_5 = graph.insertVertex(parent, null, '4.6', 0, 0, 80, 30);
    var v7_6 = graph.insertVertex(parent, null, '4.7', 0, 0, 80, 30);

    var e1 = graph.insertEdge(parent, null, '', v1, v2);
    var e2 = graph.insertEdge(parent, null, '', v1, v3);
    var e3 = graph.insertEdge(parent, null, '', v3, v4);
    var e3_1 = graph.insertEdge(parent, null, '', v3, v4_1);
    var e3_2 = graph.insertEdge(parent, null, '', v3, v4_2);
    var e3_3 = graph.insertEdge(parent, null, '', v3, v4_3);
    var e3_4 = graph.insertEdge(parent, null, '', v3, v4_4);
    var e4 = graph.insertEdge(parent, null, '', v2, v5);
    var e5 = graph.insertEdge(parent, null, '', v1, v6);
    var e6 = graph.insertEdge(parent, null, '', v4_3, v7);
    var e6_1 = graph.insertEdge(parent, null, '', v4_4, v7_4);
    var e6_2 = graph.insertEdge(parent, null, '', v4_4, v7_5);
    var e6_3 = graph.insertEdge(parent, null, '', v4_4, v7_6);
    var e6_1 = graph.insertEdge(parent, null, '', v4_3, v7_1);
    var e6_2 = graph.insertEdge(parent, null, '', v4_3, v7_2);
    var e6_3 = graph.insertEdge(parent, null, '', v4_3, v7_3);

    // Executes the layout
    layout.execute(parent);
  } finally {
    // Updates the display
    graph.getModel().endUpdate();
  }
}
</script>

<template>
  <p>
    Hierarchical Layout example for mxGraph. This example demonstrates the use
    of the hierarchical and organic layouts. Note that the hierarchical layout
    requires another script tag in the head of the page.
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
   width:1200px;
   height:800px;
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
