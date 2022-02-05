<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { ref } from '@vue/reactivity';
import { useRouter } from 'vue-router';
import { routes } from './routes';
let router = useRouter();
const onClick = (item) => {
  console.log(item);
  router.push(item.path);
};
</script>

<template>
  <router-view></router-view>
</template>

<style lang="less" >
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  min-height: 100vh;
}
.header {
  height: 48px;
  display: flex;
  align-items: center;
  grid-column-start: 1;
  grid-column-end: 3;
  border: 1px solid #ddd;
  padding: 0 20px;
}
.sidebar {
  border: 1px solid #ddd;
  width: 300px;
  .router-list {
    padding: 10px;
    .item {
      border-bottom: 1px solid #eee;
      height: 36px;
      display: flex;
      align-items: center;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
