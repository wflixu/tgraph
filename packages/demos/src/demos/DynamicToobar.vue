
<script setup>
import { ref, onMounted } from 'vue';

import {
  mxEvent,
  mxGraph,
  mxUtils,
  mxConnectionHandler,
  mxImage,
  mxGraphModel,
  mxKeyHandler,
  mxCell,
  mxGeometry,
  mxText,
  mxPerimeter,
  mxConstants,
  mxRubberband,
  mxCodec,
    mxToolbar
} from 'thgraph';


onMounted(() => {
  const container = document.getElementById('graphCont');
  main(container);
});

function main(wcontainer) {
 // Defines an icon for creating new connections in the connection handler.
				// This will automatically disable the highlighting of the source vertex.
				mxConnectionHandler.prototype.connectImage = new mxImage('public/images/connector.gif', 16, 16);

				// Creates the div for the toolbar
				var tbContainer = document.querySelector('#tools');
	
		
			
				// Creates new toolbar without event processing
				var toolbar = new mxToolbar(tbContainer);
				toolbar.enabled = false
				
				// Creates the div for the graph
				var container = document.createElement('div');
				container.style.position = 'absolute';
				container.style.overflow = 'hidden';
				container.style.left = '24px';
				container.style.top = '0px';
				container.style.right = '0px';
				container.style.bottom = '0px';
				container.style.background = 'url("public/images/grid.gif")';

				wcontainer.appendChild(container);
				
			
	
				// Creates the model and the graph inside the container
				// using the fastest rendering available on the browser
				var model = new mxGraphModel();
				var graph = new mxGraph(container, model);

				// Enables new connections in the graph
				graph.setConnectable(true);
				graph.setMultigraph(false);

				// Stops editing on enter or escape keypress
				var keyHandler = new mxKeyHandler(graph);
				var rubberband = new mxRubberband(graph);
				
				var addVertex = function(icon, w, h, style)
				{
					var vertex = new mxCell(null, new mxGeometry(0, 0, w, h), style);
					vertex.setVertex(true);
				
					var img = addToolbarItem(graph, toolbar, vertex, icon);
					img.enabled = true;
					
					graph.getSelectionModel().addListener(mxEvent.CHANGE, function()
					{
						var tmp = graph.isSelectionEmpty();
						mxUtils.setOpacity(img, (tmp) ? 100 : 20);
						img.enabled = tmp;
					});
				};
				
				addVertex('public/images/rectangle.gif', 100, 40, '');
				addVertex('public/images/rounded.gif', 100, 40, 'shape=rounded');
				addVertex('public/images/ellipse.gif', 40, 40, 'shape=ellipse');
				addVertex('public/images/rhombus.gif', 40, 40, 'shape=rhombus');
				addVertex('public/images/triangle.gif', 40, 40, 'shape=triangle');
				addVertex('public/images/cylinder.gif', 40, 40, 'shape=cylinder');
				addVertex('public/images/actor.gif', 30, 40, 'shape=actor');
}

function addToolbarItem(graph, toolbar, prototype, image)
		{
			// Function that is executed when the image is dropped on
			// the graph. The cell argument points to the cell under
			// the mousepointer if there is one.
			var funct = function(graph, evt, cell, x, y)
			{
				graph.stopEditing(false);

				var vertex = graph.getModel().cloneCell(prototype);
				vertex.geometry.x = x;
				vertex.geometry.y = y;
					
				graph.addCell(vertex);
				graph.setSelectionCell(vertex);
			}
			
			// Creates the image which is used as the drag icon (preview)
			var img = toolbar.addMode(null, image, function(evt, cell)
			{
				var pt = this.graph.getPointForEvent(evt);
				funct(graph, evt, cell, pt.x, pt.y);
			});
			
			// Disables dragging if element is disabled. This is a workaround
			// for wrong event order in IE. Following is a dummy listener that
			// is invoked as the last listener in IE.
			mxEvent.addListener(img, 'mousedown', function(evt)
			{
				// do nothing
			});
			
			// This listener is always called first before any other listener
			// in all browsers.
			mxEvent.addListener(img, 'mousedown', function(evt)
			{
				if (img.enabled == false)
				{
					mxEvent.consume(evt);
				}
			});
						
			mxUtils.makeDraggable(img, graph, funct);
			
			return img;
		}
</script>

<template>
  <p>
    Dynamic toolbar example for mxGraph. This example demonstrates changing the
  state of the toolbar at runtime.</p>
  <div  id="tools"></div>
  <div id="graphCont"></div>

</template>

<style  lang="less">
#graphCont {
  position: relative;
  height: 800px;
}
#tools {
  height: 40px;
  display: flex;
  align-items: center;
  border:1px solid #ddd;
}
</style>
