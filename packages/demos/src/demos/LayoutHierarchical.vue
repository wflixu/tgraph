

<script setup>
import { ref, onMounted } from 'vue';

import {
  mxGraph,
  mxRubberband,
  mxUtils,
  mxConstants,
  mxPerimeter,
  mxHierarchicalLayout,
  mxFastOrganicLayout,
  mxEvent,
} from 'thgraph';

onMounted(() => {
  const container = document.getElementById('graphContainer');
  main(container);
});

function main(container) {
  // Creates the graph inside the given container
				var graph = new mxGraph(container);
				
				// Adds rubberband selection
				new mxRubberband(graph);
				
				// Changes the default vertex style in-place
				var style = graph.getStylesheet().getDefaultVertexStyle();
				style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
				style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
				style[mxConstants.STYLE_PERIMETER_SPACING] = 6;
				style[mxConstants.STYLE_ROUNDED] = true;
				style[mxConstants.STYLE_SHADOW] = true;
				
				style = graph.getStylesheet().getDefaultEdgeStyle();
				style[mxConstants.STYLE_ROUNDED] = true;

				// Creates a layout algorithm to be used
				// with the graph
				var layout = new mxHierarchicalLayout(graph);
				var organic = new mxFastOrganicLayout(graph);
				organic.forceConstant = 120;
				
				var parent = graph.getDefaultParent();
        let toolbar = document.getElementById('toolbar')
			
				// Adds a button to execute the layout
				var button = document.createElement('button');
				mxUtils.write(button, 'Hierarchical');
				mxEvent.addListener(button, 'click', function(evt)
				{
					layout.execute(parent);
				});
				toolbar.appendChild(button);

				// Adds a button to execute the layout
				var button = document.createElement('button');
				mxUtils.write(button, 'Organic');
				
				mxEvent.addListener(button, 'click', function(evt)
				{
					organic.execute(parent);
				});
				
				toolbar.appendChild(button);
				
				// Load cells and layouts the graph
				graph.getModel().beginUpdate();
				try
				{
					var v1 = graph.insertVertex(parent, null, '1', 0, 0, 80, 30);
					var v2 = graph.insertVertex(parent, null, '2', 0, 0, 80, 30);
					var v3 = graph.insertVertex(parent, null, '3', 0, 0, 80, 30);
					var v4 = graph.insertVertex(parent, null, '4', 0, 0, 80, 30);
					var v5 = graph.insertVertex(parent, null, '5', 0, 0, 80, 30);
					var v6 = graph.insertVertex(parent, null, '6', 0, 0, 80, 30);
					var v7 = graph.insertVertex(parent, null, '7', 0, 0, 80, 30);
					var v8 = graph.insertVertex(parent, null, '8', 0, 0, 80, 30);
					var v9 = graph.insertVertex(parent, null, '9', 0, 0, 80, 30);

					var e1 = graph.insertEdge(parent, null, '', v1, v2);
					var e2 = graph.insertEdge(parent, null, '', v1, v3);
					var e3 = graph.insertEdge(parent, null, '', v3, v4);
					var e4 = graph.insertEdge(parent, null, '', v2, v5);
					var e5 = graph.insertEdge(parent, null, '', v1, v6);
					var e6 = graph.insertEdge(parent, null, '', v2, v3);
					var e7 = graph.insertEdge(parent, null, '', v6, v4);
					var e8 = graph.insertEdge(parent, null, '', v6, v1);
					var e9 = graph.insertEdge(parent, null, '', v6, v7);
					var e10 = graph.insertEdge(parent, null, '', v7, v8);
					var e11 = graph.insertEdge(parent, null, '', v7, v9);
					var e12 = graph.insertEdge(parent, null, '', v7, v6);
					var e13 = graph.insertEdge(parent, null, '', v7, v5);
					
					// Executes the layout
					layout.execute(parent);
				}
				finally
				{
					// Updates the display
					graph.getModel().endUpdate();
				}
}
</script>

<template>

  <p>
    <span class="sub-em">basic</span>
   Hierarchical Layout example for mxGraph. This example demonstrates the
  use of the hierarchical and organic layouts. Note that the hierarchical
  layout requires another script tag in the head of the page.
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
