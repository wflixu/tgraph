
<script setup>
import { ref, onMounted } from 'vue';

import {
  mxCellRenderer,
  mxEvent,
  mxGraph,
  mxCellOverlay,
  mxImage,
  mxHierarchicalLayout,
  mxEdgeHandler,
  mxMorphing,
} from './../../graph/index';
import { mxClient } from './../../graph/mxClient';
import { mxRubberband } from '../../graph/handler/mxRubberband';
import { mxEventObject } from '../../graph/util/mxEventObject';
import { mxConstants } from '../../graph/util/mxConstants';
import addPng from './../assets/images/add.png';
import { mxUtils } from '../../graph/util/mxUtils';
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
  var graph = new mxGraph(container);
  var parent = graph.getDefaultParent();

  // Extends mxGraphModel.getStyle to show an image when collapsed
  var modelGetStyle = graph.model.getStyle;
  graph.model.getStyle = function (cell) {
    if (cell != null) {
      var style = modelGetStyle.apply(this, arguments);

      if (this.isCollapsed(cell)) {
        style =
          style +
          ';shape=image;image=http://www.jgraph.com/images/mxgraph.gif;' +
          'noLabel=1;imageBackground=#C3D9FF;imageBorder=#6482B9';
      }

      return style;
    }

    return null;
  };

  graph.getModel().beginUpdate();
  try {
    var v1 = graph.insertVertex(
      parent,
      null,
      'Container',
      20,
      20,
      200,
      200,
      'shape=swimlane;startSize=20;',
    );
    v1.geometry.alternateBounds = new mxRectangle(0, 0, 110, 70);
    var v11 = graph.insertVertex(v1, null, 'Hello,', 10, 40, 120, 80);
  } finally {
    graph.getModel().endUpdate();
  }
}
</script>

<template>
  <div id="graphContainer"></div>
</template>

<style  lang="less">
</style>
