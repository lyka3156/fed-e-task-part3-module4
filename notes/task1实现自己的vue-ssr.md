# 1. Vue SSR 介绍

[参考文献](https://ssr.vuejs.org/zh/)

# 2. Vue SSR 基本使用 (vue-ssr)

[参考文献](https://ssr.vuejs.org/zh/guide/#%E5%AE%89%E8%A3%85)

接下来我们以 Vue SSR 的官方文档为参考，来学习一下它的基本用法。

## 2.1 渲染一个 Vue 实例

> 目标：
>
> - 了解如何使用 VueSSR 将一个 Vue 实例渲染为 HTML 字符串

首先我们来学习一下服务端渲染中最基础的工作：模板渲染。
说白了就是如何在服务端使用 Vue 的方式解析替换字符串。
在它的官方文档中其实已经给出了示例代码，下面我们来把这个案例的实现过程以及其中含义演示一
下。

```js
mkdir vue-ssr
cd vue-ssr
npm i vue vue-server-renderer
```

vue-ssr/server.js

```js
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
```

## 2.2 与服务器集成

将上面渲染的 html 字符串在浏览器中显示出来

在 Node.js 服务器中使用时相当简单直接，例如 [Express](https://expressjs.com/)。

首先安装 Express 到项目中：

```js
npm i express
```

然后使用 Express 创建一个基本的 Web 服务：

```js
const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(3000, () => console.log("app listening at http://localhost:port"));
```

在 Web 服务中渲染 Vue 实例：

vue-ssr/server.js

```js
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
```

## 2.3 使用一个页面模板

通过模板的方式去配置一些公共的模板内容

vue-ssr/index.template.html (配置公共模板)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <!-- 这个注释会把具体的渲染替换到这里，做标记 -->

    <!--vue-ssr-outlet-->
  </body>
</html>
```

vue-ssr/server.js

```js
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
  renderer.renderToString(app, (err, html) => {
    if (err) res.status(500).end("服务器解析错误");
    res.setHeader("Content-Type", "text/html;charset=utf8"); // 设置响应类型
    // 这个html就是template模板和字符串结合后的内容了
    res.end(html);
  });
});

// 监听3000端口号
server.listen(3000, () => {
  console.log("server running at port 3000");
});
```

在模板中使用外部数据

vue-ssr/index.template.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- 使用外部模板数据
      使用3个{{{}}} 会进行原文输出，2个{{}}会处理成字符串
    -->
    {{{ meta }}}
    <title>{{ title }}</title>
  </head>
  <body>
    <!-- 这个注释会把具体的渲染替换到这里，做标记 -->

    <!--vue-ssr-outlet-->
  </body>
</html>
```

vue-ssr/server.js

```js
const express = require("express");
const server = express();
server.get("/", (req, res) => {
  renderer.renderToString(
    app,
    // 声明外部数据给index.template.html模板使用
    {
      title: "lgjy",
      meta: `<meta name="description" content="周末学习" />`,
    },
    (err, html) => {
      if (err) res.status(500).end("服务器解析错误");
      res.setHeader("Content-Type", "text/html;charset=utf8");
      res.end(html);
    }
  );
});
```

# 3. 构建同构渲染 (vue-ssr2)

## 3.1 构建流程

![同构渲染]("../images/taks1/构建流程.png")

## 3.2 源码结构

[参考文献](https://ssr.vuejs.org/zh/guide/structure.html#%E9%81%BF%E5%85%8D%E7%8A%B6%E6%80%81%E5%8D%95%E4%BE%8B)

我们需要使用 webpack 来打包我们的 Vue 应用程序。事实上，我们可能需要在服务器上使用
webpack 打包 Vue 应用程序，因为：

- 通常 Vue 应用程序是由 webpack 和 `vue-loader` 构建，并且许多 webpack 特定功能不能直接在
  Node.js 中运行（例如通过 `file-loader` 导入文件，通过 `css-loader` 导入 CSS）。
- 尽管 Node.js 最新版本能够完全支持 ES2015 特性，我们还是需要转译客户端代码以适应老版浏览
  器。这也会涉及到构建步骤

所以基本看法是，对于客户端应用程序和服务器应用程序，我们都要使用 webpack 打包 - 服务器需要
「服务器 bundle」然后用于服务器端渲染(SSR)，而「客户端 bundle」会发送给浏览器，用于混合静
态标记。

现在我们正在使用 webpack 来处理服务器和客户端的应用程序，大部分源码可以使用通用方式编写，
可以使用 webpack 支持的所有功能。同时，在编写通用代码时，有一些[事项](https://ssr.vuejs.org/zh/guide/universal.html)要牢记在心。

一个基本项目可能像是这样：

```js
src
├── components
│ ├── Foo.vue
│ ├── Bar.vue
│ └── Baz.vue
├── App.vue
├── app.js # 通用 entry(universal entry)
├── entry-client.js # 仅运行于浏览器 └── entry-server.js # 仅运行于服务器
```

### 3.2.1 `App.vue`

```vue
<template>
  <!-- 客户端渲染的入口节点 -->
  <div id="app"><h1>拉勾教育</h1></div>
</template>
<script>
export default { name: "App" };
</script>
<style></style>
```

### 3.2.2 `app.js`

`app.js` 是我们应用程序的「通用 entry」。在纯客户端应用程序中，我们将在此文件中创建根 Vue 实
例，并直接挂载到 DOM。但是，对于服务器端渲染(SSR)，责任转移到纯客户端 entry 文件。 `app.js`
简单地使用 export 导出一个 `createApp` 函数：

```js
/**
 * 通用启动入口
 */
import Vue from "vue";
import App from "./App.vue";
// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp() {
  const app = new Vue({
    // 根实例简单的渲染应用程序组件。
    render: (h) => h(App),
  });
  return { app };
}
```

### 3.2.3 `entry-client.js`

客户端 entry 只需创建应用程序，并且将其挂载到 DOM 中：

```js
/**
 * 客户端入口
 */
import { createApp } from "./app";
// 客户端特定引导逻辑……
const { app } = createApp();
// 这里假定 App.vue 模板中根元素具有 `id="app"`
app.$mount("#app");
```

### 3.2.4 `entry-server.js`

服务器 entry 使用 default export 导出函数，并在每次渲染中重复调用此函数。此时，除了创建和返回
应用程序实例之外，它不会做太多事情 - 但是稍后我们将在此执行服务器端路由匹配 (server-side
route matching) 和数据预取逻辑 (data pre-fetching logic)。

```js
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
```

### 3.2.5 `server.js`

```js
/**
 * 通用应用 Web 服务启动脚本
 */
const express = require("express");
const Vue = require("vue");
const VueServerRenderer = require("vue-server-renderer");
const fs = require("fs");

// 创建一个 express 实例
const server = express();

// 生成一个渲染器
const renderer = VueServerRenderer.createRenderer({
  // 渲染器就会自动把渲染的结果注入到模板中
  template: fs.readFileSync("./index.html", "utf-8"),
});

const createApp = () => {
  const app = new Vue({
    template: ` <div id="app"> 
        <h1>Hello {{ message }}</h1> 
        <input v-model="message"> 
        </div> `,
    data: { message: "World" },
  });
  return app;
};

server.get("/foo", (req, res) => {
  const app = createApp();
  app.message = "世界";
  res.end("foo");
});

// 设置一个路由
server.get("/", async (req, res) => {
  //   const app = new Vue({
  //     template: `
  //   <div id="app">
  //   <h1>Hello {{ message }}</h1>
  //   <input v-model="message">
  //   </div>
  //   `,
  //     data: {
  //       message: "World",
  //     },
  //   });

  try {
    const app = createApp();
    const ret = await renderer.renderToString(app, {
      title: "自定义页面标题",
      meta: ` <meta name="description" content="hello world"> `,
    });
    res.end(ret);
  } catch (err) {
    res.status(500).end("Internal Server Error.");
  }
});

// 监听端口，启动 Web 服务
server.listen(3000, () => {
  console.log("running at port 3000.");
});
```

`index.template.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>拉勾教育</title>
  </head>
  <body>
    <!-- 服务端渲染的内容出口 -->
    <!--vue-ssr-outlet-->
  </body>
</html>
```

以上编写的源码结构代码现在还不能运行，需要通过 webpack 打包构建才能运行

## 3.3 构建配置

以上编写的源码结构代码现在还不能运行，需要通过 webpack 打包构建才能运行，现在我们就来配置一些 webpack 构建配置 s

### 3.3.1 安装依赖

（1）安装生产依赖

```js
npm i vue vue-server-renderer express cross-env

// 包 说明
// vue Vue.js 核心库
// vue-server-renderer Vue 服务端渲染工具
// express 基于 Node 的 Web 服务框架
// cross-env 通过 npm scripts 设置跨平台环境变量
```

（2）安装开发依赖

```js
npm i -D webpack webpack-cli webpack-merge webpack-node-externals @babel/core @babel/plugin-transform-runtime @babel/preset-env babel-loader css-loader url-loader file-loader rimraf vue-loader vue-template-compiler friendly-errors-webpack-plugin

// 包 说明
// webpack webpack 核心包
// webpack-cli webpack 的命令行工具
// webpack-merge webpack 配置信息合并工具
// webpack-node-externals 排除 webpack 中的 Node 模块
// rimraf 基于 Node 封装的一个跨平台 rm -rf 工具
// friendly-errors-webpack-plugin 友好的 webpack 错误提示
// @babel/core  @babel/plugin-transform-runtime @babel/preset-env babel-loader Babel 相关工具
// vue-loader , vue-template-compiler 处理 .vue 资源
// file-loader 处理字体资源
// css-loader 处理 CSS 资源
// url-loader 处理图片资源
```

### 3.3.2 配置文件及打包命令

（1）初始化 webpack 打包配置文件

```js
build
├── webpack.base.config.js # 公共配置
├── webpack.client.config.js # 客户端打包配置文件
└── webpack.server.config.js # 服务端打包配置文件
```

`webpack.base.config.js`

```js
/**
 * webpack 公共配置
 */
/*** 公共配置 */
const VueLoaderPlugin = require("vue-loader/lib/plugin"); // 处理 .vue 资源
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin"); // 友好的 webpack 错误提示
const path = require("path");
const resolve = (file) => path.resolve(__dirname, file);
const isProd = process.env.NODE_ENV === "production"; // 是否是生产环境
module.exports = {
  mode: isProd ? "production" : "development", // 打包模式，生产模式有压缩功能
  output: {
    path: resolve("../dist/"),
    publicPath: "/dist/",
    filename: "[name].[chunkhash].js",
  },
  resolve: {
    alias: {
      // 路径别名，@ 指向 src
      "@": resolve("../src/"),
    },
    // 可以省略的扩展名
    // 当省略扩展名的时候，按照从前往后的顺序依次解析
    extensions: [".js", ".vue", ".json"],
  },
  devtool: isProd ? "source-map" : "cheap-module-eval-source-map",
  module: {
    rules: [
      // 处理图片资源
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
      // 处理字体资源
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"],
      },
      // 处理 .vue 资源
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      // 处理 CSS 资源
      // 它会应用到普通的 `.css` 文件
      // 以及 `.vue` 文件中的 `<style>` 块
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      },
      // CSS 预处理器，参考：https://vue-loader.vuejs.org/zh/guide/pre- processors.html
      // 例如处理 Less 资源
      //   {
      //     test: /\.less$/,
      //     use: ["vue-style-loader", "css-loader", "less-loader"],
      //   },
    ],
  },
  plugins: [new VueLoaderPlugin(), new FriendlyErrorsWebpackPlugin()],
};
```

`webpack.client.config.js`

```js
/**
 * 客户端打包配置文件
 */
const { merge } = require("webpack-merge"); // 合并webpack配置
const baseConfig = require("./webpack.base.config.js"); // 公共配置
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin"); // VueSSR客户端插件

module.exports = merge(baseConfig, {
  entry: {
    app: "./src/entry-client.js",
  },
  module: {
    rules: [
      // ES6 转 ES5
      // 服务端不需要做这个功能，因为node.js本身支持es6
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            cacheDirectory: true,
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
    ],
  },
  // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
  // 以便可以在之后正确注入异步 chunk。
  optimization: {
    splitChunks: {
      name: "manifest",
      minChunks: Infinity,
    },
  },
  plugins: [
    // 此插件在输出目录中生成 `vue-ssr-client-manifest.json`。
    // 这个文件记录了客户端打包的依赖和一些加载的模块信息
    new VueSSRClientPlugin(),
  ],
});
```

`webpack.server.config.js`

```js
/**
 * 服务端打包配置文件
 */
const { merge } = require("webpack-merge"); // 合并webpack配置
const nodeExternals = require("webpack-node-externals"); // 排除 webpack 中的 Node 模块
const baseConfig = require("./webpack.base.config.js"); // 公共配置
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin"); // VueSSR服务端插件

// 此配置在webpack5.0以下
module.exports = merge(baseConfig, {
  // 将 entry 指向应用程序的 server entry 文件
  entry: "./src/entry-server.js",
  // 这允许 webpack 以 Node 适用方式处理模块加载
  // 并且还会在编译 Vue 组件时，
  // 告知 `vue-loader` 输送面向服务器代码(server-oriented code)。
  target: "node",
  output: {
    filename: "server-bundle.js",
    // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
    libraryTarget: "commonjs2",
  },
  // 不打包 node_modules 第三方包，而是保留 require 方式直接加载
  externals: [
    nodeExternals({
      // 白名单中的资源依然正常打包
      allowlist: [/\.css$/],
    }),
  ],
  plugins: [
    // 这是将服务器的整个输出构建为单个 JSON 文件的插件。
    // 默认文件名为 `vue-ssr-server-bundle.json`
    new VueSSRServerPlugin(),
  ],
});
```

（2）在 npm scripts 中配置打包命令

```js
"scripts": {
    "build:client": "cross-env NODE_ENV=production webpack --config build/webpack.client.config.js",
    "build:server": "cross-env NODE_ENV=production webpack --config build/webpack.server.config.js",
    "build": "rimraf dist && npm run build:client && npm run build:server"
},
```

运行测试：

```js
npm run build:client
npm run build:server
npm run build
```

### 3.3.3 启动应用

以上配置文件及打包命令已经生成了服务端和客户端的资源文件，那我们如何使用这些资源文件，把我们的同构应用启动起来

[参考文献 Bundle Renderer 指引](https://ssr.vuejs.org/zh/guide/bundle-renderer.html#%E4%BD%BF%E7%94%A8%E5%9F%BA%E6%9C%AC-ssr-%E7%9A%84%E9%97%AE%E9%A2%98)

`vus-ssr/server.js`

```js
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
```

### 3.3.4 解析渲染流程 \*\*\*

（1）服务端渲染

- renderer.renderToString 渲染了什么？
- renderer 是如何拿到 entry-server 模块的？
  - createBundleRenderer 中的 serverBundle
- server Bundle 是 Vue SSR 构建的一个特殊的 JSON 文件
  - entry：入口
  - files：所有构建结果资源列表
  - maps：源代码 source map 信息
- server-bundle.js 就是通过 server.entry.js 构建出来的结果文件
- 最终把渲染结果注入到模板中

（2）客户端渲染

- vue-ssr-client-manifest.json
  - publicPath：访问静态资源的根相对路径，与 webpack 配置中的 publicPath 一致
  - all：打包后的所有静态资源文件路径
  - initial：页面初始化时需要加载的文件，会在页面加载时配置到 preload 中
  - async：页面跳转时需要加载的文件，会在页面加载时配置到 prefetch 中
  - modules：项目的各个模块包含的文件的序号，对应 all 中文件的顺序；moduleIdentifier 和 和 all 数组中文件的映射关系（modules 对象是我们查找文件引用的重要数据）

[客户端激活](https://ssr.vuejs.org/zh/guide/hydration.html)

## 3.4 构建开发配置

我们现在已经实现同构应用的基本功能了，但是这对于一个完整的应用来说还远远不够，例如如何处理同构应用中的路由、如何在服务端渲染中进行数据预取等功能。这些功能我们都会去对它进行实现，但是在实现它们之前我们要先来解决一个关于打包的问题：

- 每次写完代码，都要重新打包构建
- 重新启动 Web 服务
- 很麻烦...

所以下面我们来实现项目中的开发模式构建，也就是我们希望能够实现：

- 写完代码，自动构建
- 自动重启 Web 服务
- 自动刷新页面内容

### 3.4.1 基本思路

- 生产模式
  - npm run build 构建
  - node server.js 启动应用
- 开发模式
  - 监视代码变动自动构建，热更新等功能
  - node server.js 启动应用

所以我们设计了这样的启动脚本：

```js
"scripts": {
    // 启动开发服务
    "dev": "node server.js",
    // 启动生产服务
    "start": "cross-env NODE_ENV=production node server.js"
}
```

服务端配置：

```js
/**
 * 把webpack打包生成的服务端和客户端的资源文件(同构应用)启动起来
 */

const Vue = require("vue");
const express = require("express");
const fs = require("fs");

const { createBundleRenderer } = require("vue-server-renderer"); // 创建Bundle的renderer

// 创建http服务器
const server = express();

// 使用express静态文件中间件
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
}

// 路由渲染
const routeRender = (req, res) => {
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
};

// 访问/路由
server.get(
  "/",
  isProd
    ? // 生产模式有了render直接渲染就行了
      routeRender
    : async (req, res) => {
        // TODO: 开发模式   等待有了 Renderer 渲染器以后， 调用 routeRender 进行渲染
      }
);

// 监听3000端口号
server.listen(3000, () => {
  console.log("server running at port 3000.");
});
```

### 3.4.2 封装处理模块

`build/setup-dev-server.js`

```js
/**
 * 开发环境 监视代码变动自动构建的 express 中间件
 */
const path = require("path");
const fs = require("fs");
const webpack = require("webpack"); // 引入webpack配置文件
const resolve = (file) => path.resolve(__dirname, file);

module.exports = (server, callback) => {
  let ready;
  const onReady = new Promise((resove) => (ready = resove));
  // 监视构建 -> 更新 renderer

  let serverBundle;
  let template;
  let clientManifest;

  // 2. 更新 Renderer 渲染器
  const update = () => {
    if (serverBundle && template && clientManifest) {
      // 调用promise的resolve方法代表promise成功了
      ready();
      // 调用callback回调函数更新renderer
      callback(serverBundle, template, clientManifest);
    }
  };
  // 1. 只要上面3个资源改变了就需要调用update方法更新 Renderer 渲染器

  // 1.1 监视构建 serverBundle -> 调用update -> 更新 Renderer 渲染器

  // 1.2 监视构建 template -> 调用update -> 更新 Renderer 渲染器

  // 1.3 监视构建 clientManifest -> 调用update -> 更新 Renderer 渲染器
  return onReady;
};
```

`server.js`

```js
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
const routeRender = (req, res) => {
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
};

// 访问/路由
server.get(
  "/",
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
```

### 3.4.3 更新模块

关于 Node 中的监视的问题：

- fs.watch
- fs.watchFile
- 第三方包：[chokidar](https://github.com/paulmillr/chokidar)
  - 封装了 fs.watch 和 fs.watchFile 方法

```js
// 安装 chokidar
npm i chokidar
```

`build/setup-dev-server.js`

```js
// 1.2 监视构建 template -> 调用update -> 更新 Renderer 渲染器
// 1.2.1 初始的时候读取template文件
const templatePath = resolve("../index.template.html");
template = fs.readFileSync(templatePath, "utf-8");
update();
// 1.2.2 监视template文件的变化
// node.js 中 fs.watch 和 fs.watchFile 这两种方式都不太好
// 使用 chokidar 插件(内部封装了上面两个方法)
// 监视templatePath文件的变化
chokidar.watch(templatePath).on("change", () => {
  console.log("template change");
  // 文件改变重新获取template
  template = fs.readFileSync(templatePath, "utf-8");
  update();
});
```

> 注意：使用 chokidar 监视文件变化在 vscode 中有问题，不影响整体功能。

### 3.4.4 更新服务端打包

`build/setup-dev-server.js`

```js
// 1.1 监视构建 serverBundle -> 调用update -> 更新 Renderer 渲染器
// 1.1.1 引入server配置文件
const serverConfig = require("./webpack.server.config");
// 1.1.2 创建server编译器
const serverCompiler = webpack(serverConfig);
// 1.1.3 watch直接打包构建，监视资源改变，资源一旦发生改变就会重新打包构建
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err; // webpack本身错误
  if (stats.hasErrors()) return; // 打包的结构是否有错误，自己的源代码的一些错误
  // 重新获取serverBundle对象
  serverBundle = JSON.parse(
    fs.readFileSync(resolve("../dist/vue-ssr-server-bundle.json"), "utf-8")
  );
  // console.log(serverBundle);
  update();
});
```

### 3.4.5 将打包结果存储到内存中

webpack 默认会把构建结果存储到磁盘中，对于生产模式构建来说是没有问题的；但是我们在开发模式中会频繁的修改代码触发构建，也就意味着要频繁的操作磁盘数据，而磁盘数据操作相对于来说是比较慢的，所以我们有一种更好的方式，就是把数据存储到内存中，这样可以极大的提高构建的速度。

[memfs](https://github.com/streamich/memfs) 是一个兼容 Node 中 fs 模块 API 的内存文件系统，通过它我们可以轻松的实现把 webpack 构
建结果输出到内存中进行管理。

```js
// 安装 memfs
npm install --save memfs
```

方案一：自己配置 memfs。

[webpack 将文件写入到内存中](https://webpack.js.org/api/node/#custom-file-systems)

`build/setup-dev-server.js`

```js
const { createFsFromVolume, Volume } = require("memfs");
// 1.1.3 watch直接打包构建，监视资源改变，资源一旦发生改变就会重新打包构建
// 1.1.3.1 自定义 webpack 把数据写入内存中
serverCompiler.outputFileSystem = createFsFromVolume(new Volume());
// 1.1.3.2 memfs 模块去除了 join 方法，所以这里我们需要手动的给它提供 join 方法
serverCompiler.outputFileSystem.join = path.join.bind(path);
// 1.1.3.3 手动监视打包构建
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err; // webpack本身错误
  if (stats.hasErrors()) return; // 打包的结构是否有错误，自己的源代码的一些错误
  // 重新获取serverBundle对象
  serverBundle = JSON.parse(
    fs.readFileSync(resolve("../dist/vue-ssr-server-bundle.json"), "utf-8")
  );
  console.log(serverBundle);
  update();
});
```

方案二：使用 [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware)。

webpack-dev-middleware 作用是，以监听模式启动 webpack，将编译结果输出到内存中，然后将内
存文件输出到 Express 服务中。

安装依赖：

```js
npm i -D webpack-dev-middleware
```

配置到构建流程中：
`build/setup-dev-server.js`

```js
// 监视构建 serverBundle -> 调用 update -> 更新 Renderer 渲染器
const serverConfig = require("./webpack.server.config");
const serverCompiler = webpack(serverConfig);
// 1.1.3 监视webpack文件并打包构建并且将webpack打包构建的文件(dist/vue-ssr-server-bundle.json)写入内存中的两种方式
// 通过devMiddleware配置
// 1.1.3 devMiddleware以监视的方式去构建，不需要我们去手动构建了
// 1.1.3.1 打包之后并不会退出，他会以监视模式监视文件的变动，从而打包构建，他和我们手动watch是一样的
const serverDevMiddleware = devMiddleware(serverCompiler, {
  logLevel: "silent", // 关闭日志输出，由FriendlyErrorsWebpackPlugin处理      主要webpack-dev-middleware版本4.0以上没有这个属性了
});
// 1.1.3.2 通过注册插件拿到每次构建后的内容
// done 这个钩子函数每次webpack构建完成都会执行
serverCompiler.hooks.done.tap("server", () => {
  serverBundle = JSON.parse(
    // serverDevMiddleware.fileSystem 操作的是内存中的文件
    serverDevMiddleware.fileSystem.readFileSync(
      resolve("../dist/vue-ssr-server-bundle.json"),
      "utf-8"
    )
  );
  console.log(serverBundle);
  update();
});
```

### 3.4.6 更新客户端打包

```js
// 1.3 监视构建 clientManifest -> 调用update -> 更新 Renderer 渲染器
// 1.1.1 引入client配置文件
const clientConfig = require("./webpack.client.config");
// 1.1.2 创建client编译器
const clientCompiler = webpack(clientConfig);
// 1.1.3 监视webpack文件并打包构建并且将webpack打包构建的文件(dist/vue-ssr-client-manifest.json)写入内存中的两种方式
// 通过devMiddleware配置
// 1.1.3 devMiddleware以监视的方式去构建，不需要我们去手动构建了
// 1.1.3.1 打包之后并不会退出，他会以监视模式监视文件的变动，从而打包构建，他和我们手动watch是一样的
const clientDevMiddleware = devMiddleware(clientCompiler, {
  publicPath: clientConfig.output.publicPath,
  logLevel: "silent", // 关闭日志输出，由FriendlyErrorsWebpackPlugin处理      主要webpack-dev-middleware版本4.0以上没有这个属性了
});
// 1.1.3.2 通过注册插件拿到每次构建后的内容
// done 这个钩子函数每次webpack构建完成都会执行
clientCompiler.hooks.done.tap("client", () => {
  clientManifest = JSON.parse(
    // clientDevMiddleware.fileSystem 操作的是内存中的文件
    clientDevMiddleware.fileSystem.readFileSync(
      resolve("../dist/vue-ssr-client-manifest.json"),
      "utf-8"
    )
  );
  // console.log(clientManifest);
  update();
});
// 重要！将clientDevMiddleware 挂载到 Express 服务中，提供对其内部内存中数据的访问
server.use(clientDevMiddleware);
```

### 3.4.7 热更新

热更新功能需要使用到 [webpack-hot-middleware](https://github.com/webpack-contrib/webpack-hot-middleware) 工具包。

安装依赖：

```js
npm install --save-dev webpack-hot-middleware
```

```js
const hotMiddleware = require("webpack-hot-middleware"); // 热更新插件

// 1.3 监视构建 clientManifest -> 调用update -> 更新 Renderer 渲染器
// 1.3.1 引入client配置文件
const clientConfig = require("./webpack.client.config");
// 1.3-1) 配置热更新
clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin()); // 注册热更新插件
clientConfig.entry.app = [
  // 和服务端交互处理热更新的一个客户端脚本
  // quiet关闭console.log日志
  // reload热更新卡住了就刷新
  "webpack-hot-middleware/client?quiet=true&reload=true",
  clientConfig.entry.app, // webpack.client.config.js之前配置的入口
];
clientConfig.output.filename = "[name].js"; // 热更新模式下确保一致的 hash
// 1.3.2 创建client编译器
const clientCompiler = webpack(clientConfig);
// 1.3.3 监视webpack文件并打包构建并且将webpack打包构建的文件(dist/vue-ssr-client-manifest.json)写入内存中的两种方式
// 通过devMiddleware配置
// 1.3.3 devMiddleware以监视的方式去构建，不需要我们去手动构建了
// 1.3.3.1 打包之后并不会退出，他会以监视模式监视文件的变动，从而打包构建，他和我们手动watch是一样的
const clientDevMiddleware = devMiddleware(clientCompiler, {
  publicPath: clientConfig.output.publicPath,
  logLevel: "silent", // 关闭日志输出，由FriendlyErrorsWebpackPlugin处理      主要webpack-dev-middleware版本4.0以上没有这个属性了
});
// 1.3.3.2 通过注册插件拿到每次构建后的内容
// done 这个钩子函数每次webpack构建完成都会执行
clientCompiler.hooks.done.tap("client", () => {
  clientManifest = JSON.parse(
    // clientDevMiddleware.fileSystem 操作的是内存中的文件
    clientDevMiddleware.fileSystem.readFileSync(
      resolve("../dist/vue-ssr-client-manifest.json"),
      "utf-8"
    )
  );
  // console.log(clientManifest);
  update();
});

// 挂载hotMiddleware
server.use(
  hotMiddleware(clientCompiler, {
    log: false, // 关闭本身log
  })
);
```

# 4. 编写通用代码注意事项

[参考文献](https://ssr.vuejs.org/zh/guide/universal.html#%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%B8%8A%E7%9A%84%E6%95%B0%E6%8D%AE%E5%93%8D%E5%BA%94)

我们现在终于把实现 Vue SSR 同构应用的基础环境搭建起来了，虽然还有很多不足之处，但是也能满足我们当前的基本使用了。

所以接下来我们就要把内容的核心转移到 Vue SSR 本身上了，那首先我们来了解一下编写通用应用的注意事项，通过了解这些注意事项对于如何正确的使用 Vue SSR 是非常有帮助的。

在这些注意事项中，有些其实已经在前面的学习过程中了解过了，而有些还没有接触过，所以在这里通过官方文档做一个简单的总结。

## 4.1 服务器上的数据响应

在纯客户端应用程序 (client-only app) 中，每个用户会在他们各自的浏览器中使用新的应用程序实例。对于服务器端渲染，我们也希望如此：每个请求应该都是全新的、独立的应用程序实例，以便不会有交叉请求造成的状态污染 (cross-request state pollution)。

因为实际的渲染过程需要确定性，所以我们也将在服务器上“预取”数据 ("pre-fetching" data) - 这意味着在我们开始渲染时，我们的应用程序就已经解析完成其状态。也就是说，将数据进行响应式的过程在服务器上是多余的，所以默认情况下禁用。禁用响应式数据，还可以避免将「数据」转换为「响应式对象」的性能开销。

## 4.2 组件生命周期钩子函数

由于没有动态更新，所有的生命周期钩子函数中，只有 `beforeCreate` 和 `created` 会在服务器端渲染(SSR) 过程中被调用。这就是说任何其他生命周期钩子函数中的代码（例如 `beforeMount` 或 `mounted` ），只会在客户端执行。

此外还需要注意的是，你应该避免在 `beforeCreate` 和 `created` 生命周期时产生全局副作用的代码，例如在其中使用 `setInterval` 设置 timer。在纯客户端 (client-side only) 的代码中，我们可以设置一个 timer，然后在 `beforeDestroy` 或 `destroyed` 生命周期时将其销毁。但是，由于在 SSR 期间并不会调用销毁钩子函数，所以 timer 将永远保留下来。为了避免这种情况，请将副作用代码移动到 `beforeMount` 或 `mounted` 生命周期中。

## 4.3 访问特定平台 API

通用代码不可接受特定平台的 API，因此如果你的代码中，直接使用了像 `window` 或 `document` ，这种仅浏览器可用的全局变量，则会在 Node.js 中执行时抛出错误，反之也是如此。

对于共享于服务器和客户端，但用于不同平台 API 的任务(task)，建议将平台特定实现包含在通用 API 中，或者使用为你执行此操作的 library。例如，[axios](https://github.com/axios/axios) 是一个 HTTP 客户端，可以向服务器和客户端都暴露相同的 API。

对于仅浏览器可用的 API，通常方式是，在「纯客户端 (client-only)」的生命周期钩子函数中惰性访问(lazily access) 它们。

请注意，考虑到如果第三方 library 不是以上面的通用用法编写，则将其集成到服务器渲染的应用程序中，可能会很棘手。你可能要通过模拟 (mock) 一些全局变量来使其正常运行，但这只是 hack 的做法，并且可能会干扰到其他 library 的环境检测代码。

## 4.4 区分运行环境

> 参考：
>
> - https://webpack.js.org/plugins/define-plugin/

```js
new webpack.DefinePlugin({
  "process.client": true,
  "process.server": false,
});
```

## 4.5 自定义指令

大多数自定义指令直接操作 DOM，因此会在服务器端渲染 (SSR) 过程中导致错误。有两种方法可以解决这个问题：

1. 推荐使用组件作为抽象机制，并运行在「虚拟 DOM 层级(Virtual-DOM level)」（例如，使用渲染函数(render function)）。

2. 如果你有一个自定义指令，但是不是很容易替换为组件，则可以在创建服务器 renderer 时，使用 [directives](https://ssr.vuejs.org/zh/api/#directives) 选项所提供"服务器端版本(server-side version)"。

# 5. 路由和代码分割

[参考文献](https://ssr.vuejs.org/zh/guide/routing.html)

接下来我们来了解一下如何处理通用应用中的路由。

官方文档给出的解决方案肯定还是使用 `vue-router`，整体使用方式和纯客户端的使用方式基本一致，只需要在少许的位置做一些配置就可以了。文档中已经把配置的方式描述的很清楚了，建议大家认真看一下文档，下面我把具体的实现来演示一下。

安装

```js
npm i vue-router
```

## 5.1 router/indenx.js

```js
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
```

## 5.2 app.js

```js
/**
 * 通用启动入口
 */

import Vue from "vue";
import App from "./App.vue";
import { createRouter } from "./router"; // 引入路由

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
```

## 5.3 entry-server.js

```js
/**
 * 服务端启动入口
 */
import { createApp } from "./app";

// 每次渲染中重复调用此函数
export default async (context) => {
  // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
  // 以便服务器能够等待所有的内容在渲染前，
  // 就已经准备就绪。
  const { app, router } = createApp();

  // 设置服务器端 router 的位置
  router.push(context.url);

  // 等到 router 将可能的异步组件和钩子函数解析完
  // new Promise((resolve, reject) => {
  //   router.onReady(resolve, reject);
  // });
  await new Promise(router.onReady.bind(router));

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
```

## 5.4 server.js

```js
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
```

## 5.5 entry-client.js

```js
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
```

## 5.6 App.vue

```js
<template>
  <!-- 客户端渲染的入口节点 -->
  <div id="app">
    <h1>{{ message }}</h1>
    <h2>客户端动态交互</h2>
    <div>
      <input v-model="message" />
    </div>
    <button @click="onClick">点击测试122</button>

    <ul>
      <li>
        <router-link to="/">Home</router-link>
      </li>
      <li>
        <router-link to="/about">About</router-link>
      </li>
    </ul>

    <!-- 路由出口 -->
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "App",
  data: () => {
    return {
      message: "周末学习",
    };
  },
  methods: {
    onClick() {
      console.log("hello word");
    },
  },
};
</script>
<style></style>

```

# 6. 管理页面 Head

[参考文献](https://ssr.vuejs.org/zh/guide/head.html)

[参考文献](https://vue-meta.nuxtjs.org/guide/ssr.html#inject-metadata-into-page-string)

无论是服务端渲染还是客户端渲染，它们都使用的同一个页面模板。

页面中的 body 是动态渲染出来的，但是页面的 head 是写死的，也就说我们希望不同的页面可以拥有自己的 head 内容，例如页面的 title、meta 等内容，所以下面我们来了解一下如何让不同的页面来定制自己的 head 头部内容。

官方文档这里专门描述了关于页面 Head 的处理，相对于来讲更原生一些，使用比较麻烦，有兴趣的同学可以了解一下。

我这里主要给大家介绍一个第三方解决方案：[vue-meta](https://github.com/nuxt/vue-meta)。

Vue Meta 是一个支持 SSR 的第三方 Vue.js 插件，可让你轻松的实现不同页面的 head 内容管理。

使用它的方式非常简单，而只需在页面组件中使用 `metaInfo` 属性配置页面的 head 内容即可。

`app.js`

```js
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
```

`entry-server.js`

```js
/**
 * 服务端启动入口
 */
import { createApp } from "./app";

// 每次渲染中重复调用此函数
export default async (context) => {
  // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
  // 以便服务器能够等待所有的内容在渲染前，
  // 就已经准备就绪。
  const { app, router } = createApp();

  // 拿到vue-meta注入的$meta
  const meta = app.$meta();

  // 设置服务器端 router 的位置
  router.push(context.url);

  // 再将meta写入context中，这样的话index.template.html模板中就能使用meta了
  context.meta = meta;

  // 等到 router 将可能的异步组件和钩子函数解析完

  await new Promise(router.onReady.bind(router));

  return app;
};
```

`index.template.html`

[参考文献](https://vue-meta.nuxtjs.org/guide/ssr.html#inject-metadata-into-page-string)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- 使用外部模板数据使用3个{} 会进行原文输出，2个{}会处理成字符串   inject注入 -->

    {{{ meta.inject().title.text() }}} {{{ meta.inject().meta.text() }}}
  </head>
  <body>
    <!-- 这个注释会把具体的渲染替换到这里，做标记 -->

    <!--vue-ssr-outlet-->

    hello word1
  </body>
</html>
```

`pages/home`

```js
<script>
export default {
  name: 'HomePage',
  metaInfo: {
    title: '首页'
  }
}
</script>
```

# 7. 数据预取和状态

# 8. 服务端渲染优化
