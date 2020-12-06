/**
 * 把webpack打包生成的服务端和客户端的资源文件(同构应用)启动起来
 */

const Vue = require("vue");
const express = require("express");
const fs = require("fs");

const serverBundle = require("./dist/vue-ssr-server-bundle.json"); // 引入服务端资源文件
const template = fs.readFileSync("./index.template.html", "utf-8"); // 引入公共html模板
const clientManifest = require("./dist/vue-ssr-client-manifest.json"); // 引入客户端资源文件

// 1. 创建renderer
const renderer = require("vue-server-renderer").createBundleRenderer(
  serverBundle,
  {
    template,
    clientManifest,
  }
);

// 创建http服务器
const server = express();

// 使用express静态文件中间件
server.use("/dist", express.static("./dist"));

server.get("/", (req, res) => {
  renderer.renderToString(
    // 传入外部数据在功template模板中使用
    {
      title: "拉勾教育",
      meta: ` <meta name="description" content="拉勾教育"> `,
    },
    (err, html) => {
      if (err) {
        return res.status(500).end("Internal Server Error.");
      }
      // 设置响应头
      res.setHeader("Content-Type", "text/html; charset=utf8");
      // 返回渲染完成的html
      res.end(html);
    }
  );
});
// 监听3000端口号
server.listen(3000, () => {
  console.log("server running at port 3000.");
});
