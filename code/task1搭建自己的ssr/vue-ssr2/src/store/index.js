import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex); // 注册vuex插件

// 导出一个函数:  避免交叉请求带来的污染   (编写通用代码注意事项)
export const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      posts: [],
    }),

    // 同步修改state
    mutations: {
      setPosts(state, data) {
        state.posts = data;
      },
    },

    // 异步修改state
    actions: {
      // 在服务端渲染期间务必让 action 返回一个 Promise
      async getPosts({ commit }) {
        // return new Promise()
        // const { data } = await axios.get("https://cnodejs.org/api/v1/topics");
        const data = await {
          data: [
            {
              id: 1,
              title: "标题1",
            },
            {
              id: 2,
              title: "标题2",
            },
          ],
        };
        commit("setPosts", data.data);
      },
    },
  });
};
