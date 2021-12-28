
<script setup>
import { ref, onMounted } from 'vue';


import { main } from './helloworld';

onMounted(() => {
  const container = document.getElementById('graphContainer');
 main(container);
});
</script>

<template>
  <div id="graphContainer" style></div>
</template>

<style scoped>
a {
  color: #42b983;
}
#graphContainer {
  overflow: hidden;
  width: 600px;
  height: 400px;
  background: url('./../assets/images/grid.gif');
  cursor: default;
  border: 1px solid red;
}
</style>
