<template>
  <Layout>
    <New></New>
  </Layout>
</template>

<script>
import New from "./New";
export default {
  metaInfo: {
    title: "Hello, world!",
  },
  components: {
    New,
  },
};
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
</style>
