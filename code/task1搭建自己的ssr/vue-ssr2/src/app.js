/**
 * 通用启动入口
 */

import Vue from "vue";
import App from "./App.vue";
import { createRouter } from "./router"; // 引入路由
import VueMeta from "vue-meta";
Vue.use(VueMeta); // 注册 Vue-Meta 插件

// 全局混入metaInfo
Vue.mixin({
  metaInfo: {
    titleTemplate: "%s - 周末学习模板!",
  },
});

// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp() {
  // 创建 router 实例
  const router = createRouter();

  const app = new Vue({
    router, // 将路由挂载到 Vue 根实例中
    // 根实例简单的渲染应用程序组件。
    render: (h) => h(App),
  });

  return { app, router };
}
