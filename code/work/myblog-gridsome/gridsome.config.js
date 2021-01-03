// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'Gridsome',
  plugins: [
    // 读取本地文件转换成markdown的配置
    // {
    //   use: '@gridsome/source-filesystem',
    //   options: {
    //     typeName: 'BlogPost',     // 数据类型
    //     path: './content/blog/**/*.md', // 从哪里抓取mk文件
    //   }
    // },
    // 将strapi中的数据配置到gridsome中
    {
      use: '@gridsome/source-strapi',
      options: {
        apiURL: 'http://localhost:1337',
        queryLimit: 1000, // (最多查询条数)
        // 查询strapi集合的
        contentTypes: ['post', 'tag', 'project'], // 查询的实体
        // typeName:"Strapi",   // 类型名称默认Strapi
        // 查询strapi单个节点的
        singleTypes: ['general'], // 单个节点类型
        // Possibility to login with a Strapi user,
        // when content types are not publicly available (optional).
        // 莫些数据受保护的，需要登录
        // loginData: {
        //   identifier: '',
        //   password: ''
        // }
      }
    }
  ],
  // 配置模板组件 (这里配置的组件会被打包生成静态页面)
  templates: {
    // 内容类型 = plugins中的typeName+contentTypes
    StrapiPost: [{
      path: "/blog/details/:id", // 文章详情路劲
      component: "./src/templates/BlogDetail.vue" // 通过这个模板生成静态页面了
    },
      // {
      //   path: "/project/details/:id", // 文章详情路劲
      //   component: "./src/templates/ProjectDetail.vue" // 通过这个模板生成静态页面了
      // }
    ],
    StrapiProject: [
      {
        path: "/project/details/:id", // 文章详情路劲
        component: "./src/templates/ProjectDetail.vue" // 通过这个模板生成静态页面了
      }
    ]
  }
}
