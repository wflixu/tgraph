


## 说明

  Hello, World! example for mxGraph. This example demonstrates using
  a DOM node to create a graph and adding vertices and edges.

## 效果

<script setup>
// import HelloWorld from './HelloWorld.vue'
import { defineClientComponent } from 'vitepress'

const HelloWorld = defineClientComponent(() => {
  return import('./HelloWorld.vue')
})
</script>


  <HelloWorld />

   

## 代码

```vue
<script setup>
import { ref, onMounted } from 'vue';

import {
  mxEvent,
  mxGraph,
  mxRubberband,
  mxConstants,
  mxUtils,
  mxPoint,
} from 'thgraph';

onMounted(() => {
  main();
});

function main() {
  const container = document.getElementById('graphContainer');
  // Disables the built-in context menu
  mxEvent.disableContextMenu(container);

  // Creates the graph inside the given container
  var graph = new mxGraph(container);

  // Sets the base style for all vertices
  var style = graph.getStylesheet().getDefaultVertexStyle();
  style[mxConstants.STYLE_ROUNDED] = true;
  style[mxConstants.STYLE_FILLCOLOR] = '#ffffff';
  style[mxConstants.STYLE_STROKECOLOR] = '#000000';
  style[mxConstants.STYLE_STROKEWIDTH] = '2';
  style[mxConstants.STYLE_FONTCOLOR] = '#000000';
  style[mxConstants.STYLE_FONTSIZE] = '12';
  style[mxConstants.STYLE_FONTSTYLE] = 1;
  graph.getStylesheet().putDefaultVertexStyle(style);

  // Removes folding icon for relative children
  graph.isCellFoldable = function (cell, collapse) {
    var childCount = this.model.getChildCount(cell);

    for (var i = 0; i < childCount; i++) {
      var child = this.model.getChildAt(cell, i);
      var geo = this.getCellGeometry(child);

      if (geo != null && geo.relative) {
        return false;
      }
    }

    return childCount > 0;
  };

  // Returns the relative position of the given child
  function getRelativePosition(state, dx, dy) {
    if (state != null) {
      var model = graph.getModel();
      var geo = model.getGeometry(state.cell);

      if (geo != null && geo.relative && !model.isEdge(state.cell)) {
        var parent = model.getParent(state.cell);

        if (model.isVertex(parent)) {
          var pstate = graph.view.getState(parent);

          if (pstate != null) {
            var scale = graph.view.scale;
            var x = state.x + dx;
            var y = state.y + dy;

            if (geo.offset != null) {
              x -= geo.offset.x * scale;
              y -= geo.offset.y * scale;
            }

            x = (x - pstate.x) / pstate.width;
            y = (y - pstate.y) / pstate.height;

            if (Math.abs(y - 0.5) <= Math.abs((x - 0.5) / 2)) {
              x = x > 0.5 ? 1 : 0;
              y = Math.min(1, Math.max(0, y));
            } else {
              x = Math.min(1, Math.max(0, x));
              y = y > 0.5 ? 1 : 0;
            }

            return new mxPoint(x, y);
          }
        }
      }
    }

    return null;
  }

  // Replaces translation for relative children
  graph.translateCell = function (cell, dx, dy) {
    var rel = getRelativePosition(
      this.view.getState(cell),
      dx * graph.view.scale,
      dy * graph.view.scale,
    );

    if (rel != null) {
      var geo = this.model.getGeometry(cell);

      if (geo != null && geo.relative) {
        geo = geo.clone();
        geo.x = rel.x;
        geo.y = rel.y;

        this.model.setGeometry(cell, geo);
      }
    } else {
      mxGraph.prototype.translateCell.apply(this, arguments);
    }
  };

  // Replaces move preview for relative children
  graph.graphHandler.getDelta = function (me) {
    var point = mxUtils.convertPoint(
      this.graph.container,
      me.getX(),
      me.getY(),
    );
    var delta = new mxPoint(point.x - this.first.x, point.y - this.first.y);

    if (this.cells != null && this.cells.length > 0 && this.cells[0] != null) {
      var state = this.graph.view.getState(this.cells[0]);
      var rel = getRelativePosition(state, delta.x, delta.y);

      if (rel != null) {
        var pstate = this.graph.view.getState(
          this.graph.model.getParent(state.cell),
        );

        if (pstate != null) {
          delta = new mxPoint(
            pstate.x + pstate.width * rel.x - state.getCenterX(),
            pstate.y + pstate.height * rel.y - state.getCenterY(),
          );
        }
      }
    }

    return delta;
  };

  // Relative children cannot be removed from parent
  graph.graphHandler.shouldRemoveCellsFromParent = function (
    parent,
    cells,
    evt,
  ) {
    return (
      cells.length == 0 &&
      !cells[0].geometry.relative &&
      mxGraphHandler.prototype.shouldRemoveCellsFromParent.apply(
        this,
        arguments,
      )
    );
  };

  // Enables moving of relative children
  graph.isCellLocked = function (cell) {
    return false;
  };

  // Enables rubberband selection
  new mxRubberband(graph);

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  var parent = graph.getDefaultParent();

  // Adds cells to the model in a single step
  graph.getModel().beginUpdate();
  try {
    var v1 = graph.insertVertex(parent, null, 'Process', 60, 60, 90, 40);
    var v2 = graph.insertVertex(
      v1,
      null,
      'in',
      0,
      0.5,
      20,
      20,
      'fontSize=9;shape=ellipse;resizable=0;',
    );
    v2.geometry.offset = new mxPoint(-10, -10);
    v2.geometry.relative = true;
    var v3 = graph.insertVertex(
      v1,
      null,
      'out',
      1,
      0.5,
      20,
      20,
      'fontSize=9;shape=ellipse;resizable=0;',
    );
    v3.geometry.offset = new mxPoint(-10, -10);
    v3.geometry.relative = true;
  } finally {
    // Updates the display
    graph.getModel().endUpdate();
  }
}
</script>

<template>
  <div id="graphContainer"></div>
</template>

<style lang="less"></style>
```




