/**
 * 服务端启动入口
 */
import { createApp } from "./app";

// 每次渲染中重复调用此函数
export default async (context) => {
  // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
  // 以便服务器能够等待所有的内容在渲染前，
  // 就已经准备就绪。
  const { app, router, store } = createApp();

  // 拿到vue-meta注入的$meta
  const meta = app.$meta();

  // 设置服务器端 router 的位置
  router.push(context.url);

  // 再将meta写入context中，这样的话index.template.html模板中就能使用meta了
  context.meta = meta;

  // 等到 router 将可能的异步组件和钩子函数解析完
  // new Promise((resolve, reject) => {
  //   router.onReady(resolve, reject);
  // });
  await new Promise(router.onReady.bind(router));

  // 服务端渲染完成会调用
  context.rendered = () => {
    // Renderer 会把 context.state 数据对象内联到页面模板中
    // 最终发送给客户端的页面中会包含一段脚本：window.__INITIAL_STATE__ = context.state
    // 客户端就要把页面中的 window.__INITIAL_STATE__ 拿出来填充到客户端 store 容器中
    context.state = store.state;
  };

  return app;

  // router.onReady(() => {
  //   const matchedComponents = router.getMatchedComponents();
  //   // 匹配不到的路由，执行 reject 函数，并返回 404
  //   if (!matchedComponents.length) {
  //     return reject({ code: 404 });
  //   }

  //   // Promise 应该 resolve 应用程序实例，以便它可以渲染
  //   resolve(app);
  // }, reject);
};

// export default (context) => {
//   // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
//   // 以便服务器能够等待所有的内容在渲染前，
//   // 就已经准备就绪。
//   return new Promise((resolve, reject) => {
//     const { app, router } = createApp();

//     // 设置服务器端 router 的位置
//     router.push(context.url);

//     // 等到 router 将可能的异步组件和钩子函数解析完
//     router.onReady(() => {
//       const matchedComponents = router.getMatchedComponents();
//       // 匹配不到的路由，执行 reject 函数，并返回 404
//       if (!matchedComponents.length) {
//         return reject({ code: 404 });
//       }

//       // Promise 应该 resolve 应用程序实例，以便它可以渲染
//       resolve(app);
//     }, reject);
//   });
// };
