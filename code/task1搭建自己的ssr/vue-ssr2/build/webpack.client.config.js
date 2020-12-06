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
