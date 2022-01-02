

<script setup>
import { ref, onMounted } from 'vue';
import collapsed from './../assets/images/collapsed.gif';
import expanded from './../assets/images/expanded.gif';
import {

  mxGraph,

  mxRubberband,
  mxUtils,
  mxCodec,
} from 'thgraph';

onMounted(() => {
  const container = document.getElementById('graphContainer');
  main(container);
});

function main(container) {
  
  
  // Creates the graph inside the given container
  var graph = new mxGraph(container);

  // Adds rubberband selection to the graph
  new mxRubberband(graph);

  var doc = mxUtils.parseXml(`%graph%`);
  var codec = new mxCodec(doc);
  codec.decode(doc.documentElement, graph.getModel());

}
</script>

<template>
  <p>
   Template example for mxGraph. This is used as a template HTML file by the
  backends to demonstrate the deployment of the client with a graph embedded
  in the page as XML data (see graph variable in the onload-handler).
  
  </p>
  <div id="graphContainer"></div>
  <div id="toolbar"></div>
</template>

<style  scoped lang="less">
#tools {
  display: flex;
  margin-top: 20px;
}
</style>
