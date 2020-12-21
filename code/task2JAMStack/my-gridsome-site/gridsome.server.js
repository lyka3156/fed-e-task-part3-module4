// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const axios = require('axios')

module.exports = function (api) {
  api.loadSource(async ({ addCollection }) => {
    // Use the Data Store API here: https://gridsome.org/docs/data-store-api/

    // 使用数据存储API添加集合   https://gridsome.org/docs/collections/
    // Add collections with Data Store API
    // 这里会在gridSome启动之前就会发请求拿数据，拿到数据以后才会把服务启动起来
    // 你就可以在页面中使用数据，完成预渲染了。 (预取环节)
    const collection = addCollection('Post')
    const { data } = await axios.get("http://jsonplaceholder.typicode.com/posts")
    for (const item of data) {
      collection.addNode({
        id: item.id,
        title: item.title,
        content: item.body
      })
    }
  })

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
    // 使用 Pages API 创建页面
    createPage({
      path: '/my-page',
      component: './src/templates/MyPage.vue'
    })
  })
}
