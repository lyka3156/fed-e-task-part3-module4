// vue渲染的字符串和服务端集成

// 1. 创建一个 Vue 实例
const Vue = require("vue");
const app = new Vue({
  template: `
        <div id="#app">
            <h1>{{ message }}</h1>
        </div>
    `,
  data: {
    message: "周末学习",
  },
});

// 2. 创建一个 renderer(渲染器)
const renderer = require("vue-server-renderer").createRenderer();

// 3. 创建一个服务器将vue的渲染字符串模板在浏览器中显示
const express = require("express");
const server = express();
server.get("/", (req, res) => {
  // 3.1 将 Vue 实例渲染为 HTML
  renderer.renderToString(app, (err, html) => {
    if (err) res.status(500).end("服务器解析错误");
    // 中文在页面显示成乱码的解决方法
    // 1. 设置响应头
    // res.setHeader("Content-Type", "text/html;charset=utf8"); // 设置响应类型
    // res.end(html);
    // 2. 直接返回html，在html中的meta中设置
    res.end(`
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
  ${html}</body>
</html>
    `);
  });
});

// 监听3000端口号
server.listen(3000, () => {
  console.log("server running at port 3000");
});
