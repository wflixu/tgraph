
<script setup>
import { ref, onMounted } from 'vue';

import {
  mxCellRenderer,

  mxGraph,

  mxConstants,
  mxCylinder
} from 'thgraph';

class BoxShape extends mxCylinder {
  extrude = 10
  constructor(){
    super()
  }
  redrawPath (path, x, y, w, h, isForeground) {
  var dy = this.extrude * this.scale;
  var dx = this.extrude * this.scale;

  if (isForeground) {
    path.moveTo(0, dy);
    path.lineTo(w - dx, dy);
    path.lineTo(w, 0);
    path.moveTo(w - dx, dy);
    path.lineTo(w - dx, h);
  } else {
    path.moveTo(0, dy);
    path.lineTo(dx, 0);
    path.lineTo(w, 0);
    path.lineTo(w, h - dy);
    path.lineTo(w - dx, h);
    path.lineTo(0, h);
    path.lineTo(0, dy);
    path.lineTo(dx, 0);
    path.close();
  }
};
}

/*
    The example shape is a "3D box" that looks like this:
                ____
                /   /|
                /___/ |
                |   | /
                |___|/
                        
    The code below defines the shape. The BoxShape function
    it the constructor which creates a new object instance.
    */


/*
		   	The next lines use an mxCylinder instance to augment the
		   	prototype of the shape ("inheritance") and reset the
		   	constructor to the topmost function of the c'tor chain.
		*/


// Defines the extrusion of the box as a "static class variable"


/*
    Next, the mxCylinder's redrawPath method is "overridden".
    This method has a isForeground argument to separate two
    paths, one for the background (which must be closed and
    might be filled) and one for the foreground, which is
    just a stroke.

    Foreground:       /
                _____/
                    |
                    |
                ____  
    Background:  /    | 
                /     | 
                |     / 
                |____/ 
*/


mxCellRenderer.registerShape('box', BoxShape);

onMounted(() => {
  const container = document.getElementById('graphContainer');
  main(container);
});

function main(container) {
  // Creates the graph inside the DOM node.
  var graph = new mxGraph(container);

  // Disables basic selection and cell handling
  graph.setEnabled(false);

  // Changes the default style for vertices "in-place"
  // to use the custom shape.
  var style = graph.getStylesheet().getDefaultVertexStyle();
  style[mxConstants.STYLE_SHAPE] = 'box';

  // Adds a spacing for the label that matches the
  // extrusion size
  style[mxConstants.STYLE_SPACING_TOP] = BoxShape.prototype.extrude;
  style[mxConstants.STYLE_SPACING_RIGHT] = BoxShape.prototype.extrude;

  // Adds a gradient and shadow to improve the user experience
  style[mxConstants.STYLE_GRADIENTCOLOR] = '#FFFFFF';
  style[mxConstants.STYLE_SHADOW] = true;

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  var parent = graph.getDefaultParent();

  // Adds cells to the model in a single step
  graph.getModel().beginUpdate();
  try {
    var v1 = graph.insertVertex(parent, null, 'Custom', 20, 20, 80, 60);
    var v2 = graph.insertVertex(parent, null, 'Shape', 200, 150, 80, 60);
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
