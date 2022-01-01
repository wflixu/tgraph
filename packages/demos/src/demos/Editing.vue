
<script setup>
import { ref, onMounted } from 'vue';

import {
  mxEvent,
  mxGraph,
  mxUtils,
  mxKeyHandler
} from 'thgraph';



onMounted(() => {
  const container = document.getElementById('graphContainer');
  main(container);
});

function main(container) {
  // Creates the graph inside the given container
  var graph = new mxGraph(container);
  graph.setHtmlLabels(true);

  // Adds handling of return and escape keystrokes for editing
  var keyHandler = new mxKeyHandler(graph);

  // Helper method that returns the fieldname to be used for
  // a mouse event
  var getFieldnameForEvent = function (cell, evt) {
    if (evt != null) {
      // Finds the relative coordinates inside the cell
      var point = mxUtils.convertPoint(
        graph.container,
        mxEvent.getClientX(evt),
        mxEvent.getClientY(evt),
      );
      var state = graph.getView().getState(cell);

      if (state != null) {
        point.x -= state.x;
        point.y -= state.y;

        // Returns second if mouse in second half of cell
        if (point.y > state.height / 2) {
          return 'second';
        }
      }
    }

    return 'first';
  };

  // Returns a HTML representation of the cell where the
  // upper half is the first value, lower half is second
  // value
  graph.getLabel = function (cell) {
    var table = document.createElement('table');
    table.style.height = '100%';
    table.style.width = '100%';

    var body = document.createElement('tbody');
    var tr1 = document.createElement('tr');
    var td1 = document.createElement('td');
    td1.style.textAlign = 'center';
    td1.style.fontSize = '12px';
    td1.style.color = '#774400';
    mxUtils.write(td1, cell.value.first);

    var tr2 = document.createElement('tr');
    var td2 = document.createElement('td');
    td2.style.textAlign = 'center';
    td2.style.fontSize = '12px';
    td2.style.color = '#774400';
    mxUtils.write(td2, cell.value.second);

    tr1.appendChild(td1);
    tr2.appendChild(td2);
    body.appendChild(tr1);
    body.appendChild(tr2);
    table.appendChild(body);

    return table;
  };

  // Returns the editing value for the given cell and event
  graph.getEditingValue = function (cell, evt) {
    evt.fieldname = getFieldnameForEvent(cell, evt);

    return cell.value[evt.fieldname] || '';
  };

  // Sets the new value for the given cell and trigger
  graph.labelChanged = function (cell, newValue, trigger) {
    var name = trigger != null ? trigger.fieldname : null;

    if (name != null) {
      // Clones the user object for correct undo and puts
      // the new value in the correct field.
      var value = mxUtils.clone(cell.value);
      value[name] = newValue;
      newValue = value;

      mxGraph.prototype.labelChanged.apply(this, arguments);
    }
  };

  // Sample user objects with 2 fields
  var value = new Object();
  value.first = 'First value';
  value.second = 'Second value';

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  var parent = graph.getDefaultParent();

  // Adds cells to the model in a single step
  graph.getModel().beginUpdate();
  try {
    var v1 = graph.insertVertex(
      parent,
      null,
      value,
      100,
      60,
      120,
      80,
      'overflow=fill;',
    );
  } finally {
    // Updates the display
    graph.getModel().endUpdate();
  }
}
</script>

<template>
  <div id="graphContainer"></div>
</template>

<style  lang="less">
</style>
