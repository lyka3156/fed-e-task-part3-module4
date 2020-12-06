const fs = require("fs");

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
const renderer = require("vue-server-renderer").createRenderer({
  template: fs.readFileSync("./index.template.html", "utf-8"), // 配置模板
});

// 3. 创建一个服务器将vue的渲染字符串模板在浏览器中显示
const express = require("express");
const server = express();
server.get("/", (req, res) => {
  // 3.1 将 Vue 实例渲染为 HTML
  renderer.renderToString(
    app,
    // 声明外部数据给index.template.html模板使用
    {
      title: "lgjy",
      meta: `<meta name="description" content="周末学习" />`,
    },
    (err, html) => {
      if (err) res.status(500).end("服务器解析错误");
      res.setHeader("Content-Type", "text/html;charset=utf8"); // 设置响应类型
      // 这个html就是template模板和字符串结合后的内容了
      res.end(html);
    }
  );
});

// 监听3000端口号
server.listen(3000, () => {
  console.log("server running at port 3000");
});
