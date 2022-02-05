

<script setup>
import { ref, onMounted } from 'vue';

import {
  mxGraph,
  mxRubberband,
  mxUtils,
  mxGraphModel,
  mxPoint,
  mxCell,
  mxGraphHandler,
  mxPopupMenuHandler,
} from 'thgraph';

onMounted(() => {
  const container = document.getElementById('graphContainer');
  main(container);
});

function main(container) {
  // Creates the graph inside the given container
  var graph = new mxGraph(container);
  graph.constrainChildren = false;
  graph.extendParents = false;
  graph.extendParentsOnAdd = false;

  // Uncomment the following if you want the container
  // to fit the size of the graph
  //graph.setResizeContainer(true);

  // Enables rubberband selection
  new mxRubberband(graph);

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  var parent = graph.getDefaultParent();

  // Adds cells to the model in a single step
  graph.getModel().beginUpdate();
  try {
    var v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 120, 60);
    var v2 = graph.insertVertex(v1, null, 'World!', 90, 20, 60, 20);
  } finally {
    // Updates the display
    graph.getModel().endUpdate();
  }
}

// Overrides check for valid roots
mxGraph.prototype.isValidRoot = function () {
  return false;
};

// Don't clear selection if multiple cells selected
var graphHandlerMouseDown = mxGraphHandler.prototype.mouseDown;
mxGraphHandler.prototype.mouseDown = function (sender, me) {
  graphHandlerMouseDown.apply(this, arguments);

  if (
    this.graph.isCellSelected(me.getCell()) &&
    this.graph.getSelectionCount() > 1
  ) {
    this.delayedSelection = false;
  }
};

// Selects descendants before children selection mode
var graphHandlerGetInitialCellForEvent =
  mxGraphHandler.prototype.getInitialCellForEvent;
mxGraphHandler.prototype.getInitialCellForEvent = function (me) {
  var model = this.graph.getModel();
  var psel = model.getParent(this.graph.getSelectionCell());
  var cell = graphHandlerGetInitialCellForEvent.apply(this, arguments);
  var parent = model.getParent(cell);

  if (psel == null || (psel != cell && psel != parent)) {
    while (
      !this.graph.isCellSelected(cell) &&
      !this.graph.isCellSelected(parent) &&
      model.isVertex(parent) &&
      !this.graph.isValidRoot(parent)
    ) {
      cell = parent;
      parent = this.graph.getModel().getParent(cell);
    }
  }

  return cell;
};

// Selection is delayed to mouseup if child selected
var graphHandlerIsDelayedSelection =
  mxGraphHandler.prototype.isDelayedSelection;
mxGraphHandler.prototype.isDelayedSelection = function (cell) {
  var result = graphHandlerIsDelayedSelection.apply(this, arguments);
  var model = this.graph.getModel();
  var psel = model.getParent(this.graph.getSelectionCell());
  var parent = model.getParent(cell);

  if (psel == null || (psel != cell && psel != parent)) {
    if (
      !this.graph.isCellSelected(cell) &&
      model.isVertex(parent) &&
      !this.graph.isValidRoot(parent)
    ) {
      result = true;
    }
  }

  return result;
};

// Delayed selection of parent group
mxGraphHandler.prototype.selectDelayed = function (me) {
  var cell = me.getCell();

  if (cell == null) {
    cell = this.cell;
  }

  var model = this.graph.getModel();
  var parent = model.getParent(cell);

  while (
    this.graph.isCellSelected(cell) &&
    model.isVertex(parent) &&
    !this.graph.isValidRoot(parent)
  ) {
    cell = parent;
    parent = model.getParent(cell);
  }

  this.graph.selectCellForEvent(cell, me.getEvent());
};

// Returns last selected ancestor
mxPopupMenuHandler.prototype.getCellForPopupEvent = function (me) {
  var cell = me.getCell();
  var model = this.graph.getModel();
  var parent = model.getParent(cell);

  while (model.isVertex(parent) && !this.graph.isValidRoot(parent)) {
    if (this.graph.isCellSelected(parent)) {
      cell = parent;
    }

    parent = model.getParent(parent);
  }

  return cell;
};
</script>

<template>
  <p>
    <span class="sub-em">basic</span>
    Groups example for mxGraph. This example demonstrates using cells as parts
    of other cells.
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
