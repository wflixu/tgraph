
<script setup>
import { ref, onMounted } from 'vue';

import {
  mxEvent,
  mxGraph,
  mxUtils,
  mxText,
  mxPerimeter,
  mxConstants,
  mxCodec
} from 'thgraph';


let requestId = 0;


onMounted(() => {
  const container = document.getElementById('graphContainer');
  main(container);
});

function main(container) {
  // Speedup the animation
  mxText.prototype.enableBoundingBox = false;

  // Creates the graph inside the given container
  var graph = new mxGraph(container);

  // Disables all built-in interactions
  graph.setEnabled(false);

  // Handles clicks on cells
  graph.addListener(mxEvent.CLICK, function (sender, evt) {
    var cell = evt.getProperty('cell');

    if (cell != null) {
      load(graph, cell);
    }
  });

  // Changes the default vertex style in-place
  var style = graph.getStylesheet().getDefaultVertexStyle();
  style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
  style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
  style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  var parent = graph.getDefaultParent();

  var cx = graph.container.clientWidth / 2;
  var cy = graph.container.clientHeight / 2;

  var cell = graph.insertVertex(parent, '0-0', '0-0', cx - 20, cy - 15, 60, 40);

  // Animates the changes in the graph model
  graph.getModel().addListener(mxEvent.CHANGE, function (sender, evt) {
    var changes = evt.getProperty('edit').changes;
    mxEffects.animateChanges(graph, changes);
  });

  load(graph, cell);
}

// Loads the links for the given cell into the given graph
// by requesting the respective data in the server-side
// (implemented for this demo using the server-function)
function load(graph, cell) {
  if (graph.getModel().isVertex(cell)) {
    var cx = graph.container.clientWidth / 2;
    var cy = graph.container.clientHeight / 2;

    // Gets the default parent for inserting new cells. This
    // is normally the first child of the root (ie. layer 0).
    var parent = graph.getDefaultParent();

    // Adds cells to the model in a single step
    graph.getModel().beginUpdate();
    try {
      var xml = server(cell.id);
      var doc = mxUtils.parseXml(xml);
      var dec = new mxCodec(doc);
      var model = dec.decode(doc.documentElement);

      // Removes all cells which are not in the response
      for (var key in graph.getModel().cells) {
        var tmp = graph.getModel().getCell(key);

        if (tmp != cell && graph.getModel().isVertex(tmp)) {
          graph.removeCells([tmp]);
        }
      }

      // Merges the response model with the client model
      graph.getModel().mergeChildren(model?.getRoot()?.getChildAt(0), parent);

      // Moves the given cell to the center
      var geo = graph.getModel().getGeometry(cell);

      if (geo != null) {
        geo = geo.clone();
        geo.x = cx - geo.width / 2;
        geo.y = cy - geo.height / 2;

        graph.getModel().setGeometry(cell, geo);
      }

      // Creates a list of the new vertices, if there is more
      // than the center vertex which might have existed
      // previously, then this needs to be changed to analyze
      // the target model before calling mergeChildren above
      var vertices = [];

      for (var key in graph.getModel().cells) {
        var tmp = graph.getModel().getCell(key);

        if (tmp != cell && model.isVertex(tmp)) {
          vertices.push(tmp);

          // Changes the initial location "in-place"
          // to get a nice animation effect from the
          // center to the radius of the circle
          var geo = model.getGeometry(tmp);

          if (geo != null) {
            geo.x = cx - geo.width / 2;
            geo.y = cy - geo.height / 2;
          }
        }
      }

      // Arranges the response in a circle
      var cellCount = vertices.length;
      var phi = (2 * Math.PI) / cellCount;
      var r = Math.min(
        graph.container.clientWidth / 4,
        graph.container.clientHeight / 4,
      );

      for (var i = 0; i < cellCount; i++) {
        var geo = graph.getModel().getGeometry(vertices[i]);

        if (geo != null) {
          geo = geo.clone();
          geo.x += r * Math.sin(i * phi);
          geo.y += r * Math.cos(i * phi);

          graph.getModel().setGeometry(vertices[i], geo);
        }
      }
    } finally {
      // Updates the display
      graph.getModel().endUpdate();
    }
  }
}

// Simulates the existence of a server that can crawl the
// big graph with a certain depth and create a graph model
// for the traversed cells, which is then sent to the client
function server(cellId) {
  // Increments the request ID as a prefix for the cell IDs
  requestId++;

  // Creates a local graph with no display
  var graph = new mxGraph();

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  var parent = graph.getDefaultParent();

  // Adds cells to the model in a single step
  graph.getModel().beginUpdate();
  try {
    var v0 = graph.insertVertex(parent, cellId, 'Dummy', 0, 0, 60, 40);
    var cellCount = parseInt(Math.random() * 16) + 4;

    // Creates the random links and cells for the response
    for (var i = 0; i < cellCount; i++) {
      var id = requestId + '-' + i;
      var v = graph.insertVertex(parent, id, id, 0, 0, 60, 40);
      var e = graph.insertEdge(parent, null, 'Link ' + i, v0, v);
    }
  } finally {
    // Updates the display
    graph.getModel().endUpdate();
  }

  var enc = new mxCodec();
  var node = enc.encode(graph.getModel());

  return mxUtils.getXml(node);
}
</script>

<template>
  <div id="graphContainer"></div>
</template>

<style  lang="less">
</style>
