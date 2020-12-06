// vue渲染的字符串

// 1. 创建一个 Vue 实例
const Vue = require("vue");
const app = new Vue({
  template: `
        <div id="#app">
            <h1>{{ message }}</h1>
        </div>
    `,
  data: {
    message: "lgjy",
  },
});

// 2. 创建一个 renderer(渲染器)
const renderer = require("vue-server-renderer").createRenderer();

// 3. 将 Vue 实例渲染为 HTML
// 第一个参数是 vue 实例
// 第二个参数是 回调函数
renderer.renderToString(app, (err, html) => {
  if (err) throw err;
  // data-server-rendered="true" 这个属性和客户端接入服务端的入口标识
  // <div id="#app" data-server-rendered="true"><h1>lgjy</h1></div>
  console.log(html);
});
