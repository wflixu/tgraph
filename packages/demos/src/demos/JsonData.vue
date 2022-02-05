

<script setup>
import { ref, onMounted } from 'vue';

import {
  mxGraph,
  mxUtils,
  mxRubberband,
  mxEvent,
  mxObjectCodec,
  mxCodecRegistry,
  mxCodec,
} from 'thgraph';

onMounted(() => {
  const container = document.getElementById('graphContainer');
  main(container);
});

let jsonstr = 'ddd'

function main(container) {
  mxEvent.disableContextMenu(container);

  // Creates the graph inside the given container
  var graph = new mxGraph(container);

  // Enables rubberband selection
  new mxRubberband(graph);

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  var parent = graph.getDefaultParent();

  // Adds cells to the model in a single step
  graph.getModel().beginUpdate();
  try {
    var v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
    v1.data = new CustomData('v1');
    var v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
    v2.data = new CustomData('v2');
    var e1 = graph.insertEdge(parent, null, '', v1, v2);
  } finally {
    // Updates the display
    graph.getModel().endUpdate();
  }
  let toolbar = document.getElementById('toolbar');
  toolbar.appendChild(
    mxUtils.button('View XML', function () {
      var encoder = new mxCodec();
      var node = encoder.encode(graph.getModel());
      jsonstr = mxUtils.getXml(node);
    }),
  );
}
// Custom parser for simple file format
function parse(graph, filename) {
  var model = graph.getModel();

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  var parent = graph.getDefaultParent();

  var req = mxUtils.load(filename);
  var text = req.getText();

  var lines = text.split('\n');

  // Creates the lookup table for the vertices
  var vertices = [];

  // Parses all lines (vertices must be first in the file)
  graph.getModel().beginUpdate();
  try {
    for (var i = 0; i < lines.length; i++) {
      // Ignores comments (starting with #)
      var colon = lines[i].indexOf(':');

      if (lines[i].substring(0, 1) != '#' || colon == -1) {
        var comma = lines[i].indexOf(',');
        var value = lines[i].substring(colon + 2, lines[i].length);

        if (comma == -1 || comma > colon) {
          var key = lines[i].substring(0, colon);

          if (key.length > 0) {
            vertices[key] = graph.insertVertex(
              parent,
              null,
              value,
              0,
              0,
              80,
              70,
            );
          }
        } else if (comma < colon) {
          // Looks up the vertices in the lookup table
          var source = vertices[lines[i].substring(0, comma)];
          var target = vertices[lines[i].substring(comma + 1, colon)];

          if (source != null && target != null) {
            var e = graph.insertEdge(parent, null, value, source, target);

            // Uses the special 2-way style for 2-way labels
            if (value.indexOf('2-Way') >= 0) {
              e.style = '2way';
            }
          }
        }
      }
    }
  } finally {
    graph.getModel().endUpdate();
  }
}

function CustomData(value) {
  this.value = value;
}

var codec = new mxObjectCodec(new CustomData());

codec.encode = function (enc, obj) {
  var node = enc.document.createElement('CustomData');
  mxUtils.setTextContent(node, JSON.stringify(obj));

  return node;
};



codec.decode = function (dec, node, into) {
  var obj = JSON.parse(mxUtils.getTextContent(node));
  obj.constructor = CustomData;

  return obj;
};

mxCodecRegistry.register(codec);
</script>

<template>
  <p class="demo-desc">
    <span class="em">basic</span>
    JSON data example for mxGraph. This example demonstrates using JSON to
    encode/decode parts of the graph model in mxCodec.
  </p>
  <div id="graphContainer"></div>
  <div id="toolbar"></div>
  <div>
      {{jsonstr}}
  </div>
</template>

<style  lang="less" scoped>
#tools {
  display: flex;
  margin-top: 20px;
}

#graphContainer {
  width: 1200px;
  height: 600px;
}
</style>
