/**
 * 服务端启动入口
 */
import { createApp } from "./app";

// 每次渲染中重复调用此函数
export default (context) => {
  const { app } = createApp();

  // 服务端路由处理     数据预取...
  return app;
};
