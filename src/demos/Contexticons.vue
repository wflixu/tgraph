
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
  mxUtils
} from './../../graph/index';
import { mxClient } from './../../graph/mxClient';
import { mxRubberband } from '../../graph/handler/mxRubberband';
import { mxEventObject } from '../../graph/util/mxEventObject';
import { mxConstants } from '../../graph/util/mxConstants';
import fit_to_size from './../assets/images/fit_to_size.png';
import plus from './../assets/images/plus.png';
import check from './../assets/images/check.png';
import delete2 from './../assets/images/delete2.png';
import { mxPoint } from '../../graph/util/mxPoint';
import { mxCylinder } from '../../graph/shape/mxCylinder';
import { mxClipboard } from '../../graph/util/mxClipboard';
import { mxCodec } from '../../graph/io/mxCodec';
import { mxGraphModel } from '../../graph/model/mxGraphModel';
import { mxRectangle } from '../../graph/util/mxRectangle';

// Defines a subclass for mxVertexHandler that adds a set of clickable
// icons to every selected vertex.
function mxVertexToolHandler(state) {
  mxVertexHandler.apply(this, arguments);
}

mxVertexToolHandler.prototype = new mxVertexHandler();
mxVertexToolHandler.prototype.constructor = mxVertexToolHandler;

mxVertexToolHandler.prototype.domNode = null;

mxVertexToolHandler.prototype.init = function () {
  mxVertexHandler.prototype.init.apply(this, arguments);

  // In this example we force the use of DIVs for images in IE. This
  // handles transparency in PNG images properly in IE and fixes the
  // problem that IE routes all mouse events for a gesture via the
  // initial IMG node, which means the target vertices
  this.domNode = document.createElement('div');
  this.domNode.style.position = 'absolute';
  this.domNode.style.whiteSpace = 'nowrap';

  // Workaround for event redirection via image tag in quirks and IE8
  function createImage(src) {
   
      return mxUtils.createImage(src);
    
  }

  // Delete
  var img = createImage(delete2);
  img.setAttribute('title', 'Delete');
  img.style.cursor = 'pointer';
  img.style.width = '16px';
  img.style.height = '16px';
  mxEvent.addGestureListeners(
    img,
    mxUtils.bind(this, function (evt) {
      // Disables dragging the image
      mxEvent.consume(evt);
    }),
  );
  mxEvent.addListener(
    img,
    'click',
    mxUtils.bind(this, function (evt) {
      this.graph.removeCells([this.state.cell]);
      mxEvent.consume(evt);
    }),
  );
  this.domNode.appendChild(img);

  // Size
  var img = createImage(fit_to_size);
  img.setAttribute('title', 'Resize');
  img.style.cursor = 'se-resize';
  img.style.width = '16px';
  img.style.height = '16px';
  mxEvent.addGestureListeners(
    img,
    mxUtils.bind(this, function (evt) {
      this.start(mxEvent.getClientX(evt), mxEvent.getClientY(evt), 7);
      this.graph.isMouseDown = true;
      this.graph.isMouseTrigger = mxEvent.isMouseEvent(evt);
      mxEvent.consume(evt);
    }),
  );
  this.domNode.appendChild(img);

  // Move
  var img = createImage(plus);
  img.setAttribute('title', 'Move');
  img.style.cursor = 'move';
  img.style.width = '16px';
  img.style.height = '16px';
  mxEvent.addGestureListeners(
    img,
    mxUtils.bind(this, function (evt) {
      this.graph.graphHandler.start(
        this.state.cell,
        mxEvent.getClientX(evt),
        mxEvent.getClientY(evt),
      );
      this.graph.graphHandler.cellWasClicked = true;
      this.graph.isMouseDown = true;
      this.graph.isMouseTrigger = mxEvent.isMouseEvent(evt);
      mxEvent.consume(evt);
    }),
  );
  this.domNode.appendChild(img);

  // Connect
  var img = createImage(check);
  img.setAttribute('title', 'Connect');
  img.style.cursor = 'pointer';
  img.style.width = '16px';
  img.style.height = '16px';
  mxEvent.addGestureListeners(
    img,
    mxUtils.bind(this, function (evt) {
      var pt = mxUtils.convertPoint(
        this.graph.container,
        mxEvent.getClientX(evt),
        mxEvent.getClientY(evt),
      );
      this.graph.connectionHandler.start(this.state, pt.x, pt.y);
      this.graph.isMouseDown = true;
      this.graph.isMouseTrigger = mxEvent.isMouseEvent(evt);
      mxEvent.consume(evt);
    }),
  );
  this.domNode.appendChild(img);

  this.graph.container.appendChild(this.domNode);
  this.redrawTools();
};

mxVertexToolHandler.prototype.redraw = function () {
  mxVertexHandler.prototype.redraw.apply(this);
  this.redrawTools();
};

mxVertexToolHandler.prototype.redrawTools = function () {
  if (this.state != null && this.domNode != null) {
    var dy = mxClient.IS_VML && document.compatMode == 'CSS1Compat' ? 20 : 4;
    this.domNode.style.left = this.state.x + this.state.width - 56 + 'px';
    this.domNode.style.top = this.state.y + this.state.height + dy + 'px';
  }
};

mxVertexToolHandler.prototype.destroy = function (sender, me) {
  mxVertexHandler.prototype.destroy.apply(this, arguments);

  if (this.domNode != null) {
    this.domNode.parentNode.removeChild(this.domNode);
    this.domNode = null;
  }
};

onMounted(() => {
  const container = document.getElementById('graphContainer');
  main(container);
});

function main(container) {
  // Creates the graph inside the given container
  var graph = new mxGraph(container);
  graph.setConnectable(true);
  graph.connectionHandler.createTarget = true;

  graph.createHandler = function (state) {
    if (state != null && this.model.isVertex(state.cell)) {
      return new mxVertexToolHandler(state);
    }

    return mxGraph.prototype.createHandler.apply(this, arguments);
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
}
</script>

<template>
  <div id="graphContainer"></div>
</template>

<style  lang="less">
</style>
