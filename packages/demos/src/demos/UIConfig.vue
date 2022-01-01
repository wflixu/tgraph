

<script setup>
import { ref, onMounted } from 'vue';
import gear from './../assets/images/icons48/gear.png'
import keys from './../assets/images/icons48/keys.png'
import {

  mxUtils,
  mxObjectCodec,
  mxEditor,
  mxDefaultToolbar
} from 'thgraph';

onMounted(() => {
  const container = document.getElementById('graphContainer');
  main(container);
});

function main(container) {
  var editor = new mxEditor();
  var config = mxUtils.parseXml(`<mxEditor>
	<ui>
		<add as="graph" element="graph"/>
		<add as="toolbar" element="toolbox"/>
	</ui>
	<Array as="templates">
		<add as="myFirstTemplate">
			<Rect label="Rectangle" href="">
				<mxCell vertex="1">	
					<mxGeometry as="geometry" width="80" height="40"/>
				</mxCell>
			</Rect>
		</add>
	</Array>
	<Array as="actions">
		<add as="myFirstAction"><![CDATA[
			function (editor, cell)
			{
				var encoder = new mxCodec();
				var node = encoder.encode(editor.graph.getModel());
				mxUtils.popup(mxUtils.getPrettyXml(node), true);
			}
		]]></add>
	</Array>
	<mxDefaultToolbar as="toolbar">
		<add as="MyFirstAction" action="myFirstAction" icon="images/icons48/gear.png"/>
		<hr/><br/>
		<add as="Gear" template="myFirstTemplate" style="rounded=1" icon="images/icons48/server.png"/>
		<add as="Earth" template="myFirstTemplate" style="shape=ellipse" icon="images/icons48/earth.png"/>
	</mxDefaultToolbar>
	<mxDefaultPopupMenu as="popupHandler">	
		<add as="Show XML (Custom)" action="myFirstAction" icon="images/icons48/gear.png"/>
		<separator/>
		<add as="Delete (Built-in)" action="delete" icon="images/icons48/keys.png" if="cell"/>
	</mxDefaultPopupMenu>
</mxEditor>`).documentElement;
  mxObjectCodec.allowEval = true;
  editor.configure(config);
  mxObjectCodec.allowEval = false;

  // Enables new connections in the graph
  editor.graph.setConnectable(true);

  // Creates the second toolbar programmatically
  var cont = document.getElementById('toolbar');
  var toolbar = new mxDefaultToolbar(cont, editor);

  // Use eg. mxResources.get("delete") to translate tooltip
  toolbar.addItem('Show XML', gear, 'myFirstAction');
  toolbar.addItem('Delete', keys, 'delete');

  console.log('editor', editor);
}
</script>

<template>
  <p>
    UIConfig example for mxGraph. This example demonstrates using a config file
    to configure the toolbar and popup menu in mxEditor.
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
