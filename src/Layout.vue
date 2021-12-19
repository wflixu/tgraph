<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { ref } from '@vue/reactivity';
import HelloWorld from './components/HelloWorld.vue';
const demos = ref([HelloWorld]);


</script>

<template>
  <header class="header">
    <button>demos</button>
    <button>apps</button>
  </header>
  <aside class="sidebar">
    <ul>
      <li v-for="demo in demos" :key="demo.name">
        {{demo.name}}
      </li>
    </ul>
  </aside>
  <section class="content">
    <HelloWorld />
  </section>
</template>

<style lang="less" >
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 52px 1fr;
}
.header {
  height: 48px;
  background-color: gainsboro;
  display: flex;
  align-items: center;
  grid-column-start: 1;
  grid-column-end: 3;
}
.sidebar {
  width: 300px;
  background-color: gainsboro;
}
</style>
