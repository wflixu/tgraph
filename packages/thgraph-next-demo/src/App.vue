<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from '@/components/HelloWorld.vue'
</script>

<template>
 <div class="main">
   <HelloWorld/>
 </div>
</template>

<style lang="less" >
@import '@/assets/base.css';

#app {
  height: 100vh;
  font-weight: normal;
  .main {
    height: 100%;
  }
}


</style>
