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
