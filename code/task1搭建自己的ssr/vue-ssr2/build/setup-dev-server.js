/**
 * 开发环境 监视代码变动自动构建的 express 中间件
 */
const path = require("path");
const fs = require("fs");
const chokidar = require("chokidar"); // 监视file
const webpack = require("webpack"); // 引入webpack配置文件
const { createFsFromVolume, Volume } = require("memfs"); // webpack把数据写入内存中
const devMiddleware = require("webpack-dev-middleware"); // 开发服务器插件
const hotMiddleware = require("webpack-hot-middleware"); // 热更新插件

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
  // 1.1.1 引入server配置文件
  const serverConfig = require("./webpack.server.config");
  // 1.1.2 创建server编译器
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
    // console.log(serverBundle);
    update();
  });
  // 手动配置
  //   // 1.1.3 watch直接打包构建，监视资源改变，资源一旦发生改变就会重新打包构建
  //   // 1.1.3.1 自定义 webpack 把数据写入内存中
  // serverCompiler.outputFileSystem = createFsFromVolume(new Volume());
  // // 1.1.3.2 memfs 模块去除了 join 方法，所以这里我们需要手动的给它提供 join 方法
  // serverCompiler.outputFileSystem.join = path.join.bind(path);
  // // 1.1.3.3 手动监视打包构建
  // serverCompiler.watch({}, (err, stats) => {
  //   if (err) throw err; // webpack本身错误
  //   if (stats.hasErrors()) return; // 打包的结构是否有错误，自己的源代码的一些错误
  //   // 重新获取serverBundle对象
  //   serverBundle = JSON.parse(
  //     fs.readFileSync(resolve("../dist/vue-ssr-server-bundle.json"), "utf-8")
  //   );
  //   console.log(serverBundle);
  //   update();
  // });

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
    // console.log("template change");
    // 文件改变重新获取template
    template = fs.readFileSync(templatePath, "utf-8");
    update();
  });

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

  // 重要！将clientDevMiddleware 挂载到 Express 服务中，提供对其内部内存中数据的访问
  server.use(clientDevMiddleware);

  return onReady;
};
