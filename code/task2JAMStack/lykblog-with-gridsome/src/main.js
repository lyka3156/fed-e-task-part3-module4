// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

// 引入插件样式
import "bootstrap/dist/css/bootstrap.min.css"
import "@fortawesome/fontawesome-free/css/all.min.css"

// 引入自己的css
import "./assets/css/index.css"

import DefaultLayout from '~/layouts/Default.vue'

// 引入dayjs插件
import dayjs from "dayjs";

export default function (Vue, { router, head, isClient }) {
  // Set default layout as a global component

  // 注册的全局组件Layout
  Vue.component('Layout', DefaultLayout)

  /**
   * 定义全局过滤器来格式化时间
   */

  // {{ 表达式 | 过滤器 }}
  // 使用例子： {{ createAt | date("YYYY-MM-DD") }}
  // 第一个参数是过滤器的名称
  // 第二个参数是处理函数
  //     - 第二个参数的第一个参数是表达式
  //     - 第二个参数的第第一个参数后面的参数的过滤器的参数
  Vue.filter('date', (value, format = "YYYY-MM-DD HH:mm:ss") => {
    return dayjs(value).format(format);
  })
}
