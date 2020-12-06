/**
 * 客户端入口
 */
import { createApp } from "./app";
// 客户端特定引导逻辑……
const { app, router } = createApp();
// 这里假定 App.vue 模板中根元素具有 `id="app"`

// 路由加载完成挂载app
router.onReady(() => {
  // 这里假定 App.vue 模板中根元素具有 id = "app"
  app.$mount("#app");
});
