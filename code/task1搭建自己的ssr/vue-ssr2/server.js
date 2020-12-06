/**
 * 把webpack打包生成的服务端和客户端的资源文件(同构应用)启动起来
 */

const Vue = require("vue");
const express = require("express");
const fs = require("fs");

const { createBundleRenderer } = require("vue-server-renderer"); // 创建Bundle的renderer
const setupDevServer = require("./build/setup-dev-server"); // 开发环境 监视代码变动自动构建 Renderer对象

// 创建http服务器
const server = express();

// 使用express静态文件中间件
// express.static 处理的是物理磁盘中的资源文件   (devMiddleware打包的文件在内存中)
server.use("/dist", express.static("./dist"));

// 是否是生产环境
const isProd = process.env.NODE_ENV === "production";
let renderer; // renderer渲染器
let onReady; // 开发模式中是否加载完成renderer渲染器的promise
// 生产环境直接启动应用
if (isProd) {
  const serverBundle = require("./dist/vue-ssr-server-bundle.json"); // 引入服务端资源文件
  const template = fs.readFileSync("./index.template.html", "utf-8"); // 引入公共html模板
  const clientManifest = require("./dist/vue-ssr-client-manifest.json"); // 引入客户端资源文件
  // 1. 创建renderer
  renderer = createBundleRenderer(serverBundle, {
    template,
    clientManifest,
  });
} else {
  // 开发环境 监视代码变动自动构建，热更新等功能
  // TODO: 开发模式 -> 监视打包构建 -> 重新生成 Renderer 渲染器
  onReady = setupDevServer(server, (serverBundle, template, clientManifest) => {
    // 监视打包后执行，重新生成 Renderer 渲染器
    // 1. 创建renderer
    renderer = createBundleRenderer(serverBundle, {
      template,
      clientManifest,
    });
  });
}

// 路由渲染
const routeRender = async (req, res) => {
  // 传入外部数据在功template模板中使用 这个context会传递给entry-server.js的context中
  const context = {
    title: "拉勾教育",
    meta: ` <meta name="description" content="拉勾教育"> `,
    url: req.url,
  };
  try {
    const html = await renderer.renderToString(context);
    // 设置响应头
    res.setHeader("Content-Type", "text/html; charset=utf8");
    // 返回渲染完成的html
    res.end(html);
  } catch (err) {
    res.status(500).end("Internal Server Error.");
  }
};

// 服务端路由设置为 *，意味着所有的路由都会进入这里
server.get(
  "*",
  isProd
    ? // 生产模式有了render直接渲染就行了
      routeRender
    : async (req, res) => {
        // TODO: 开发模式   等待有了 Renderer 渲染器以后， 调用 routeRender 进行渲染
        await onReady; // 客户端 renderer 创建完成
        routeRender(req, res); // 调用 routeRender 进行渲染
      }
);

// 监听3000端口号
server.listen(3000, () => {
  console.log("server running at port 3000.");
});
