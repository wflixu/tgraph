import { createApp } from 'vue';
import App from './App.vue';
import './style/style.less';
import { createRouter, createWebHashHistory } from 'vue-router';
import { routes } from './routes';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
});
const app = createApp(App);
app.use(router);
app.use(Antd);
app.mount('#app');
