<template>
  <div class="home">
    <ul class="nav">
      <li class="nav-item mr-4">
        <router-link to="/demos">demos</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/editor">editor</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.home {
  height: 100vh;
  background-color: #f0f0f0;
  position: relative;
  .nav {
    background-color: white;
    display: flex;
    position: absolute;
    left: 50%;
    top: 50%;
    padding: 40px;
    border-radius: 4px;
    transform: translate(-50%, -50%);
    .nav-item {
      width: 210px;
      height: 140px;
      display: flex;
      font-size: 24px;
      justify-content: center;
      align-items: center;
      border: 1px solid #eee;
      border-radius: 2px;
      &:hover {
        cursor: pointer;
        box-shadow: 0 0 5px #aaa ;
      }
    }
  }
}
</style>