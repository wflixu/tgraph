
<script setup>
import { ref, onMounted } from 'vue';

import { mxEvent, mxGraph, mxUtils } from 'thgraph';

onMounted(() => {
  const container = document.getElementById('graphContainer');
  main(container);
});

function main(container) {
  // Overrides the mouse event dispatching mechanism to update the
  // cell which is associated with the event in case the native hit
  // detection did not return anything.
  var mxGraphFireMouseEvent = mxGraph.prototype.fireMouseEvent;
  mxGraph.prototype.fireMouseEvent = function (evtName, me, sender) {
    // Checks if native hit detection did not return anything
    if (me.getState() == null) {
      // Updates the graph coordinates in the event since we need
      // them here. Storing them in the event means the overridden
      // method doesn't have to do this again.
      if (me.graphX == null || me.graphY == null) {
        var pt = mxUtils.convertPoint(this.container, me.getX(), me.getY());

        me.graphX = pt.x;
        me.graphY = pt.y;
      }

      var cell = this.getCellAt(me.graphX, me.graphY);

      if (this.getModel().isEdge(cell)) {
        me.state = this.view.getState(cell);

        if (me.state != null && me.state.shape != null) {
          graph.container.style.cursor = me.state.shape.node.style.cursor;
        }
      }
    }

    if (me.state == null) {
      graph.container.style.cursor = 'default';
    }

    mxGraphFireMouseEvent.apply(this, arguments);
  };

  // Overrides double click handling to use the tolerance
  var mxGraphDblClick = mxGraph.prototype.dblClick;
  mxGraph.prototype.dblClick = function (evt, cell) {
    if (cell == null) {
      var pt = mxUtils.convertPoint(
        this.container,
        mxEvent.getClientX(evt),
        mxEvent.getClientY(evt),
      );
      cell = this.getCellAt(pt.x, pt.y);
    }
    
     mxGraphDblClick.call(this, evt, cell);
  };

  // Creates the graph inside the given container
  var graph = new mxGraph(container);
  graph.setTolerance(20);

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  var parent = graph.getDefaultParent();

  // Adds cells to the model in a single step
  graph.getModel().beginUpdate();
  try {
    var v1 = graph.insertVertex(parent, null, 'Hello,', 120, 120, 80, 30);
    var v2 = graph.insertVertex(parent, null, 'World!', 400, 250, 80, 30);
    var e1 = graph.insertEdge(
      parent,
      null,
      '',
      v1,
      v2,
      'edgeStyle=orthogonalEdgeStyle;',
    );
    var e2 = graph.insertEdge(
      parent,
      null,
      '',
      v2,
      v1,
      'edgeStyle=orthogonalEdgeStyle;',
    );
  } finally {
    // Updates the display
    graph.getModel().endUpdate();
  }
}
</script>

<template>
  <p>
    Edge tolerance example for mxGraph. This example demonstrates increasing the
    tolerance for hit detection on edges.
  </p>
  <div id="graphContainer"></div>
</template>

<style  lang="less">
</style>
