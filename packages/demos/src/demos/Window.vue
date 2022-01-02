

<script >
import { ref, onMounted, reactive } from 'vue';
import MxWindow from './../components/MxWindow.vue';
import MxLog from './../components/MxLog.vue';

import { mxEvent, mxGraph, mxRubberband, mxKeyHandler } from 'thgraph';

export default {
  components: {
    MxWindow,
    MxLog
  },
  data() {
    return {};
  },
  mounted() {
    const container = document.getElementById('graphContainer');
    this.main(container);
  },
  methods: {
    main(container) {
      // Creates the graph inside the given container
      var graph = new mxGraph(container);

      // Adds rubberband selection and keystrokes
      graph.setTooltips(true);
      graph.setPanning(true);
      var rubberband = new mxRubberband(graph);
      new mxKeyHandler(graph);

      mxEvent.disableContextMenu(container);

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
    },
  },
};
</script>

<template>
  <p class="desc">
    Windows example for mxGraph. This example demonstrates using the mxWindow
    class for displaying windows.
  </p>
  <mx-window title="Scrollable, resizable, auto height" >
    <div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit ab quam
      incidunt vel repellat nemo nihil veritatis. Corporis repellendus sapiente
      amet, esse, mollitia vero voluptatibus corrupti quasi, debitis rem nobis.
    </div>
  </mx-window>
  <mx-window title="Scrollable, resizable, auto height" :x="300" :y="200">
    <div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit ab quam
      incidunt vel repellat nemo nihil veritatis. Corporis repellendus sapiente
      amet, esse, mollitia vero voluptatibus corrupti quasi, debitis rem nobis.
    </div>
  </mx-window>
  <mx-log value="logaljdsk condd ">
  </mx-log>
  <div id="graphContainer"></div>
  <div id="tools"></div>
</template>

<style   lang="less">
#tools {
  display: flex;
  margin-top: 20px;
}
</style>
