<template>
  <Layout>
    <div>
      <h1>Posts 1</h1>
      <ul>
        <li v-for="post in $page.posts.edges" :key="post.node.id">
          <g-link :to="post.node.path">{{ post.node.title }}</g-link>
        </li>
      </ul>
    </div>
  </Layout>
</template>

<page-query>
query {
  posts: allPost {
    edges {
      node {
        id,
        title,
        path
      }
    }
  }
}
</page-query>

<script>
import axios from "axios";

export default {
  name: "Posts1",
  data() {
    return {
      posts: [],
    };
  },
  // async created() {
  //   // 客户端动态加载进来的，不是通过静态化加载进来的
  //   // 应该使用collection(集合)预渲染动态数据
  //   const { data } = await axios.get(
  //     // "https://jsonplaceholder.typicode.com/posts"
  //     "http://jsonplaceholder.typicode.com/posts"
  //   );
  //   this.posts = data;
  // },
};
</script>

<style>
</style>
