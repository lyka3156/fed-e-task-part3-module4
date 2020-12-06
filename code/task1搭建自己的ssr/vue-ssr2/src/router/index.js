import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/pages/Home";

Vue.use(VueRouter); // 注册vue-router插件

// 导出一个函数:  避免交叉请求带来的污染   (编写通用代码注意事项)
export const createRouter = () => {
  const router = new VueRouter({
    mode: "history", // 兼容前后端的路劲模式
    routes: [
      {
        path: "/",
        name: "home",
        component: Home,
      },
      {
        path: "/about",
        name: "about",
        component: () => import("@/pages/About"), // 异步懒加载路由
      },
      {
        path: "/posts",
        name: "post-list",
        component: () => import("@/pages/Posts"),
      },
      {
        path: "*",
        name: "error404",
        component: () => import("@/pages/404"),
      },
    ],
  });

  return router;
};
