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
  <div class="demos">
    <header class="header">测试用例</header>
    <aside class="sidebar">
      <ul class="router-list">
        <li
          v-for="demo in routes[1].children"
          :key="demo.name"
          class="item"
          @click="onClick(demo)"
        >
          {{ demo.name }}
        </li>
      </ul>
    </aside>
    <section class="content">
      <router-view></router-view>
    </section>
  </div>
</template>

<style lang="less" scoped>
.demos {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 52px 1fr;
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
  max-height: 100%;
  overflow: auto;
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
