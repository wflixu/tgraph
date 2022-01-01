
<script setup>
import { ref, onMounted } from 'vue';

import {
  mxCellRenderer,
  mxEvent,
  mxGraph,
  mxVertexHandler,
  mxGraphHandler,
  mxCellOverlay,
  mxImage,
  mxHierarchicalLayout,
  mxEdgeHandler,
  mxMorphing,
  mxUtils,
  mxImageShape
} from 'thgraph';
import { mxClient } from './../../graph/mxClient';
import { mxRubberband } from '../../graph/handler/mxRubberband';
import { mxEventObject } from '../../graph/util/mxEventObject';
import { mxConstants } from '../../graph/util/mxConstants';
import forbiddenPng from './../assets/images/forbidden.png';
import plus from './../assets/images/plus.png';
import check from './../assets/images/check.png';
import delete2 from './../assets/images/delete2.png';
import { mxPoint } from '../../graph/util/mxPoint';
import { mxCylinder } from '../../graph/shape/mxCylinder';
import { mxClipboard } from '../../graph/util/mxClipboard';
import { mxCodec } from '../../graph/io/mxCodec';
import { mxGraphModel } from '../../graph/model/mxGraphModel';
import { mxRectangle } from '../../graph/util/mxRectangle';

onMounted(() => {
  const container = document.getElementById('graphContainer');
  main(container);
});

function main(container) {
  // Creates the graph inside the given container
  var graph = new mxGraph(container);
  graph.setPanning(true);

  // Specifies the URL and size of the new control
  var deleteImage = new mxImage(
    forbiddenPng,
    16,
    16,
  );

  // Overridden to add an additional control to the state at creation time
  let mxCellRendererCreateControl = mxCellRenderer.prototype.createControl;
  mxCellRenderer.prototype.createControl = function (state) {
    mxCellRendererCreateControl.apply(this, arguments);

    var graph = state.view.graph;

    if (graph.getModel().isVertex(state.cell)) {
      if (state.deleteControl == null) {
        var b = new mxRectangle(0, 0, deleteImage.width, deleteImage.height);
        state.deleteControl = new mxImageShape(b, deleteImage.src);
        state.deleteControl.dialect = graph.dialect;
        state.deleteControl.preserveImageAspect = false;

        this.initControl(state, state.deleteControl, false, function (evt) {
          if (graph.isEnabled()) {
            graph.removeCells([state.cell]);
            mxEvent.consume(evt);
          }
        });
      }
    } else if (state.deleteControl != null) {
      state.deleteControl.destroy();
      state.deleteControl = null;
    }
  };

  // Helper function to compute the bounds of the control
  var getDeleteControlBounds = function (state) {
    if (state.deleteControl != null) {
      var oldScale = state.deleteControl.scale;
      var w = state.deleteControl.bounds.width / oldScale;
      var h = state.deleteControl.bounds.height / oldScale;
      var s = state.view.scale;

      return state.view.graph.getModel().isEdge(state.cell)
        ? new mxRectangle(
            state.x + state.width / 2 - (w / 2) * s,
            state.y + state.height / 2 - (h / 2) * s,
            w * s,
            h * s,
          )
        : new mxRectangle(state.x + state.width - w * s, state.y, w * s, h * s);
    }

    return null;
  };

  // Overridden to update the scale and bounds of the control
  let mxCellRendererRedrawControl = mxCellRenderer.prototype.redrawControl;
  mxCellRenderer.prototype.redrawControl = function (state) {
    mxCellRendererRedrawControl.apply(this, arguments);

    if (state.deleteControl != null) {
      var bounds = getDeleteControlBounds(state);
      var s = state.view.scale;

      if (
        state.deleteControl.scale != s ||
        !state.deleteControl.bounds.equals(bounds)
      ) {
        state.deleteControl.bounds = bounds;
        state.deleteControl.scale = s;
        state.deleteControl.redraw();
      }
    }
  };

  // Overridden to remove the control if the state is destroyed
  let mxCellRendererDestroy = mxCellRenderer.prototype.destroy;
  mxCellRenderer.prototype.destroy = function (state) {
    mxCellRendererDestroy.apply(this, arguments);

    if (state.deleteControl != null) {
      state.deleteControl.destroy();
      state.deleteControl = null;
    }
  };

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
    var v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
    var v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
    var e1 = graph.insertEdge(parent, null, '', v1, v2);
  } finally {
    // Updates the display
    graph.getModel().endUpdate();
  }

  graph.centerZoom = false;

  document.body.appendChild(
    mxUtils.button('Zoom In', function () {
      graph.zoomIn();
    }),
  );

  document.body.appendChild(
    mxUtils.button('Zoom Out', function () {
      graph.zoomOut();
    }),
  );
}
</script>

<template>
  <div id="graphContainer"></div>
</template>

<style  lang="less">
</style>
