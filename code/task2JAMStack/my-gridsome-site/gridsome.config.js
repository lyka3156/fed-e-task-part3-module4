// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'lyka3156',         // 网站标题
  // titleTemplate: "%s - <siteName>",    // 标题模板
  siteDescription: "大前端",    // 网站描述
  // pathPrefix: "dist",           // 配置子目录
  plugins: [],           // 配置插件
  // 配置模板组件 (这里配置的组件会被打包生成静态页面)
  templates: {
    Post: [{
      path: "/posts/:id", // 文章详情路劲
      component: "./src/templates/Post.vue" // 通过这个模板生成静态页面了
    }],
  }
}
