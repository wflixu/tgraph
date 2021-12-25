
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
  mxImageShape,
  mxGuide,
  mxDragSource,
  mxCell,
  mxGeometry

} from './../../graph/index';
import { mxClient } from './../../graph/mxClient';
import { mxRubberband } from '../../graph/handler/mxRubberband';
import { mxEventObject } from '../../graph/util/mxEventObject';
import { mxConstants } from '../../graph/util/mxConstants';
import forbiddenPng from './../assets/images/forbidden.png';
import grid from './../assets/images/grid.gif';
import gear from './../assets/images/gear.png';
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

function main(wraper) {
  wraper.style.height = "600px"
  // Enables guides
  mxGraphHandler.prototype.guidesEnabled = true;

  // Alt disables guides
  mxGuide.prototype.isEnabledForEvent = function (evt) {
    return !mxEvent.isAltDown(evt);
  };

  // Enables snapping waypoints to terminals
  mxEdgeHandler.prototype.snapToTerminals = true;

  var graphs = [];

  // Creates the graph inside the given container
  for (var i = 0; i < 2; i++) {
    var container = document.createElement('div');
    container.style.overflow = 'hidden';
    container.style.position = 'relative';
    container.style.width = '321px';
    container.style.height = '241px';
    container.style.background = grid;
    container.style.cursor = 'default';

    wraper.appendChild(container);

    var graph = new mxGraph(container);
    graph.gridSize = 30;

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

    graphs.push(graph);
  }

  // Returns the graph under the mouse
  var graphF = function (evt) {
    var x = mxEvent.getClientX(evt);
    var y = mxEvent.getClientY(evt);
    var elt = document.elementFromPoint(x, y);

    for (var i = 0; i < graphs.length; i++) {
      if (mxUtils.isAncestorNode(graphs[i].container, elt)) {
        return graphs[i];
      }
    }

    return null;
  };

  // Inserts a cell at the given location
  var funct = function (graph, evt, target, x, y) {
    var cell = new mxCell('Test', new mxGeometry(0, 0, 120, 40));
    cell.vertex = true;
    var cells = graph.importCells([cell], x, y, target);

    if (cells != null && cells.length > 0) {
      graph.scrollCellToVisible(cells[0]);
      graph.setSelectionCells(cells);
    }
  };

  // Creates a DOM node that acts as the drag source
  var img = mxUtils.createImage(gear);
  img.style.width = '48px';
  img.style.height = '48px';
  wraper.appendChild(img);

  // Creates the element that is being for the actual preview.
  var dragElt = document.createElement('div');
  dragElt.style.border = 'dashed black 1px';
  dragElt.style.width = '120px';
  dragElt.style.height = '40px';

  // Drag source is configured to use dragElt for preview and as drag icon
  // if scalePreview (last) argument is true. Dx and dy are null to force
  // the use of the defaults. Note that dx and dy are only used for the
  // drag icon but not for the preview.
  var ds = mxUtils.makeDraggable(
    img,
    graphF,
    funct,
    dragElt,
    null,
    null,
    graph.autoscroll,
    true,
  );

  // Redirects feature to global switch. Note that this feature should only be used
  // if the the x and y arguments are used in funct to insert the cell.
  ds.isGuidesEnabled = function () {
    return graph.graphHandler.guidesEnabled;
  };

  // Restores original drag icon while outside of graph
  ds.createDragElement = mxDragSource.prototype.createDragElement;
}
</script>

<template>
  <div id="graphContainer"></div>
</template>

<style  lang="less">
</style>
