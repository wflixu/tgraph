

<script setup>
import { ref, onMounted } from 'vue';

import {
  mxGraph,
  mxUtils,
  mxVertexHandler,
  mxCylinder,
  mxCellRenderer,
  mxEvent,
  mxRubberband,
  mxRectangle,
  mxPoint,
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
  graph.setCellsCloneable(true);
  graph.setHtmlLabels(true);
  graph.setPanning(true);
  graph.centerZoom = false;

  // Enables rubberband selection
  new mxRubberband(graph);

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  var parent = graph.getDefaultParent();

  // Adds cells to the model in a single step
  graph.getModel().beginUpdate();
  try {
    var v1 = graph.insertVertex(
      parent,
      null,
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      20,
      20,
      240,
      120,
      'shape=myShape;whiteSpace=wrap;overflow=hidden;pos1=30;pos2=80;',
    );
  } finally {
    // Updates the display
    graph.getModel().endUpdate();
  }
  
  let toolbar = document.getElementById('toolbar');
  toolbar.appendChild(
    mxUtils.button('+', function () {
      graph.zoomIn();
    }),
  );
  toolbar.appendChild(
    mxUtils.button('-', function () {
      graph.zoomOut();
    }),
  );
}

function MyShape() {
  mxCylinder.call(this);
}

mxUtils.extend(MyShape, mxCylinder);

MyShape.prototype.defaultPos1 = 20;
MyShape.prototype.defaultPos2 = 60;

MyShape.prototype.getLabelBounds = function (rect) {
  var pos1 =
    mxUtils.getValue(this.style, 'pos1', this.defaultPos1) * this.scale;
  var pos2 =
    mxUtils.getValue(this.style, 'pos2', this.defaultPos2) * this.scale;

  return new mxRectangle(
    rect.x,
    rect.y + pos1,
    rect.width,
    Math.min(rect.height, pos2) - Math.max(0, pos1),
  );
};

MyShape.prototype.redrawPath = function (path, x, y, w, h, isForeground) {
  var pos1 = mxUtils.getValue(this.style, 'pos1', this.defaultPos1);
  var pos2 = mxUtils.getValue(this.style, 'pos2', this.defaultPos2);

  if (isForeground) {
    if (pos1 < h) {
      path.moveTo(0, pos1);
      path.lineTo(w, pos1);
    }

    if (pos2 < h) {
      path.moveTo(0, pos2);
      path.lineTo(w, pos2);
    }
  } else {
    path.rect(0, 0, w, h);
  }
};

mxCellRenderer.registerShape('myShape', MyShape);

mxVertexHandler.prototype.createCustomHandles = function () {
  if (this.state.style['shape'] == 'myShape') {
    // Implements the handle for the first divider
    var firstHandle = new mxHandle(this.state);

    firstHandle.getPosition = function (bounds) {
      var pos2 = Math.max(
        0,
        Math.min(
          bounds.height,
          parseFloat(
            mxUtils.getValue(
              this.state.style,
              'pos2',
              MyShape.prototype.defaultPos2,
            ),
          ),
        ),
      );
      var pos1 = Math.max(
        0,
        Math.min(
          pos2,
          parseFloat(
            mxUtils.getValue(
              this.state.style,
              'pos1',
              MyShape.prototype.defaultPos1,
            ),
          ),
        ),
      );

      return new mxPoint(bounds.getCenterX(), bounds.y + pos1);
    };

    firstHandle.setPosition = function (bounds, pt) {
      var pos2 = Math.max(
        0,
        Math.min(
          bounds.height,
          parseFloat(
            mxUtils.getValue(
              this.state.style,
              'pos2',
              MyShape.prototype.defaultPos2,
            ),
          ),
        ),
      );

      this.state.style['pos1'] = Math.round(
        Math.max(0, Math.min(pos2, pt.y - bounds.y)),
      );
    };

    firstHandle.execute = function () {
      this.copyStyle('pos1');
    };

    firstHandle.ignoreGrid = true;

    // Implements the handle for the second divider
    var secondHandle = new mxHandle(this.state);

    secondHandle.getPosition = function (bounds) {
      var pos1 = Math.max(
        0,
        Math.min(
          bounds.height,
          parseFloat(
            mxUtils.getValue(
              this.state.style,
              'pos1',
              MyShape.prototype.defaultPos1,
            ),
          ),
        ),
      );
      var pos2 = Math.max(
        pos1,
        Math.min(
          bounds.height,
          parseFloat(
            mxUtils.getValue(
              this.state.style,
              'pos2',
              MyShape.prototype.defaultPos2,
            ),
          ),
        ),
      );

      return new mxPoint(bounds.getCenterX(), bounds.y + pos2);
    };

    secondHandle.setPosition = function (bounds, pt) {
      var pos1 = Math.max(
        0,
        Math.min(
          bounds.height,
          parseFloat(
            mxUtils.getValue(
              this.state.style,
              'pos1',
              MyShape.prototype.defaultPos1,
            ),
          ),
        ),
      );

      this.state.style['pos2'] = Math.round(
        Math.max(pos1, Math.min(bounds.height, pt.y - bounds.y)),
      );
    };

    secondHandle.execute = function () {
      this.copyStyle('pos2');
    };

    secondHandle.ignoreGrid = true;

    return [firstHandle, secondHandle];
  }

  return null;
};

mxVertexHandler.prototype.livePreview = true;
mxVertexHandler.prototype.rotationEnabled = true;
</script>

<template>
  <p class="demo-desc">
    <span class="em">basic</span>
    Handles example for mxGraph. This example demonstrates using mxHandle to
    change custom styles interactively.
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
