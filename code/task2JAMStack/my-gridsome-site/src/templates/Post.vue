<template>
  <Layout>
    <div>
      <h1>{{ $page.post.title }}</h1>
      <h2>{{ $page.post.content }}</h2>
    </div>
  </Layout>
</template>



<page-query>
query($id: ID!){
    post( id : $id ){
	    id,
	    title,
        content
	}
}
</page-query>

<script>
export default {
  name: "PostPage",
  metaInfo() {
    return {
      title: this.$page.post.title,
    };
  },
  // 下面这种方式无法访问 page-query中的数据，函数方式才可以
  //   metaInfo: {
  //       title: ""
  //   }
};
</script>

<style>
</style>