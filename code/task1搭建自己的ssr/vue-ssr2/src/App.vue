<template>
  <!-- 客户端渲染的入口节点 -->
  <div id="app">
    <h1>{{ message }}</h1>
    <h2>客户端动态交互</h2>
    <div>
      <input v-model="message" />
    </div>
    <button @click="onClick">点击测试122</button>
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
