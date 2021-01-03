// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from '~/layouts/Default.vue'

// import router from './router'
// import util from './utils/util'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import 'mavon-editor/dist/markdown/github-markdown.min.css'
// import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import Vant from 'vant'
// import 'vant/lib/vant-css/index.css'

import "./assets/css/index.css"

// 引入dayjs插件
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn') // use locale

export default function (Vue, { router, head, isClient }) {
  // Set default layout as a global component
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


  Vue.use(Vant)
  Vue.use(ElementUI)
  Vue.use(mavonEditor)



  // Vue.prototype.$markdown = function (value) {
  //   return mavonEditor.markdownIt.render(value)
  // }

  // Vue.prototype.$reload = function (context) {
  //   let NewPage = '/empty'
  //   context.$router.push(NewPage)
  //   context.$nextTick(() => (context.$router.go(-1)))
  // }

  // Vue.prototype.$setTitle = function (title) {
  //   if (title) {
  //     document.title = store.state.configuration.htmlTitle + " - " + title
  //   } else {
  //     document.title = store.state.configuration.htmlTitle
  //   }
  // }
  // Vue.prototype.$share = function (message) {
  //   if (!message) {
  //     message = window.location
  //   } else {
  //     let arr = (window.location + "").split("#")
  //     message = arr[0] + "#" + message
  //   }
  //   if (util.copy(message)) {
  //     Vue.prototype.$confirm('链接已复制,去分享给好友吧!!', '分享', {
  //       showCancelButton: false,
  //       showClose: false,
  //       type: 'success'
  //     })
  //   } else {
  //     Vue.prototype.$confirm('链接复制失败,可能因为浏览器不兼容', '分享', {
  //       showCancelButton: false,
  //       showClose: false,
  //       type: 'warning'
  //     })
  //   }
  // }

  // Vue.prototype.$mobileShare = function (message) {
  //   if (!message) {
  //     message = window.location
  //   } else {
  //     let arr = (window.location + "").split("#")
  //     message = arr[0] + "#" + message
  //   }
  //   if (util.copy(message)) {
  //     Vue.prototype.$dialog.alert({
  //       title: '分享',
  //       message: '链接已复制,去分享给好友吧!!'
  //     })
  //   } else {
  //     Vue.prototype.$dialog.alert({
  //       title: '分享',
  //       message: '链接复制失败,可能因为浏览器不兼容'
  //     })
  //   }
  // }



  // Vue.prototype.$util = util
}
