

<script setup>
import { ref, onMounted } from 'vue';

import {
  mxGraph,
  mxEvent,
  mxRubberband,
  mxUtils,
  mxCodecRegistry,
  mxCell,
  mxClient,
  mxUndoManager,
} from 'thgraph';

onMounted(() => {
  const container = document.getElementById('graphContainer');
  main(container);
});

function main(container) {
  // Disables the built-in context menu
  mxEvent.disableContextMenu(container);

  // Creates the graph inside the given container
  var graph = new mxGraph(container);

  // Enables HTML labels
  graph.setHtmlLabels(true);

  // Enables rubberband selection
  new mxRubberband(graph);

  // Creates a user object that stores the state
  var doc = mxUtils.createXmlDocument();
  var obj = doc.createElement('UserObject');
  obj.setAttribute('label', 'Hello, World!');
  obj.setAttribute('checked', 'false');

  // Adds optional caching for the HTML label
  var cached = true;

  if (cached) {
    // Ignores cached label in codec
    mxCodecRegistry.getCodec(mxCell).exclude.push('div');

    // Invalidates cached labels
    graph.model.setValue = function (cell, value) {
      cell.div = null;
      mxGraphModel.prototype.setValue.apply(this, arguments);
    };
  }

  // Overrides method to provide a cell label in the display
  graph.convertValueToString = function (cell) {
    if (cached && cell.div != null) {
      // Uses cached label
      return cell.div;
    } else if (
      mxUtils.isNode(cell.value) &&
      cell.value.nodeName.toLowerCase() == 'userobject'
    ) {
      // Returns a DOM for the label
      var div = document.createElement('div');
      div.innerHTML = cell.getAttribute('label');
      mxUtils.br(div);

      var checkbox = document.createElement('input');
      checkbox.setAttribute('type', 'checkbox');

      if (cell.getAttribute('checked') == 'true') {
        checkbox.setAttribute('checked', 'checked');
        checkbox.defaultChecked = true;
      }

      // Writes back to cell if checkbox is clicked
      mxEvent.addListener(
        checkbox,
        mxClient.IS_QUIRKS ? 'click' : 'change',
        function (evt) {
          var elt = cell.value.cloneNode(true);
          elt.setAttribute('checked', checkbox.checked ? 'true' : 'false');

          graph.model.setValue(cell, elt);
        },
      );

      div.appendChild(checkbox);

      if (cached) {
        // Caches label
        cell.div = div;
      }

      return div;
    }

    return '';
  };

  // Overrides method to store a cell label in the model
  var cellLabelChanged = graph.cellLabelChanged;
  graph.cellLabelChanged = function (cell, newValue, autoSize) {
    if (
      mxUtils.isNode(cell.value) &&
      cell.value.nodeName.toLowerCase() == 'userobject'
    ) {
      // Clones the value for correct undo/redo
      var elt = cell.value.cloneNode(true);
      elt.setAttribute('label', newValue);
      newValue = elt;
    }

    cellLabelChanged.apply(this, arguments);
  };

  // Overrides method to create the editing value
  var getEditingValue = graph.getEditingValue;
  graph.getEditingValue = function (cell) {
    if (
      mxUtils.isNode(cell.value) &&
      cell.value.nodeName.toLowerCase() == 'userobject'
    ) {
      return cell.getAttribute('label');
    }
  };

  var parent = graph.getDefaultParent();
  graph.insertVertex(parent, null, obj, 20, 20, 80, 60);

  // Undo/redo
  var undoManager = new mxUndoManager();
  var listener = function (sender, evt) {
    undoManager.undoableEditHappened(evt.getProperty('edit'));
  };
  graph.getModel().addListener(mxEvent.UNDO, listener);
  graph.getView().addListener(mxEvent.UNDO, listener);
  let toolbar = document.getElementById('toolbar')
  toolbar.appendChild(
    mxUtils.button('Undo', function () {
      undoManager.undo();
    }),
  );

  toolbar.appendChild(
    mxUtils.button('Redo', function () {
      undoManager.redo();
    }),
  );
}
</script>

<template>
  <p class="demo-desc">
    <span class="em">basic</span>
    HTML label example for mxGraph. This example demonstrates using HTML labels
    that are connected to the state of the user object.
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
  height: 600px;
}
</style>
