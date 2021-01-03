<template>
  <section
    class="page-header"
    style="
      background-image: linear-gradient(
        120deg,
        rgb(38, 144, 249),
        rgb(252, 45, 45)
      );
      color: rgb(255, 255, 255);
    "
  >
    <div style="position: absolute; top: 20px; right: 20px; z-index: 2">
      <button
        type="button"
        class="el-button el-tooltip el-button--default is-circle"
        aria-describedby="el-tooltip-9933"
        tabindex="0"
      >
        <!----><i class="el-icon-rank"></i
        ><!---->
      </button>
    </div>
    <div style="position: absolute; top: 259px; left: 257px; z-index: 1">
      <font style="font-size: 24px; color: rgb(255, 255, 255)"><b>♪</b></font>
    </div>
    <div style="position: absolute; top: 234px; left: 1683px; z-index: 1">
      <font style="font-size: 25px; color: rgb(255, 255, 255)"><b>♪</b></font>
    </div>
    <div style="position: absolute; top: 160px; left: 53px; z-index: 1">
      <font style="font-size: 29px; color: rgb(255, 255, 255)"><b>♪</b></font>
    </div>
    <div style="position: absolute; top: 127px; left: 1092px; z-index: 1">
      <font style="font-size: 23px; color: rgb(255, 255, 255)"><b>♪</b></font>
    </div>
    <div style="position: absolute; top: 160px; left: 1539px; z-index: 1">
      <font style="font-size: 29px; color: rgb(255, 255, 255)"><b>♪</b></font>
    </div>
    <div style="position: absolute; top: 56px; left: 575px; z-index: 1">
      <font style="font-size: 24px; color: rgb(255, 255, 255)"><b>♪</b></font>
    </div>
    <div style="position: absolute; top: 61px; left: 506px; z-index: 1">
      <font style="font-size: 33px; color: rgb(255, 255, 255)"><b>♪</b></font>
    </div>
    <div style="position: absolute; top: 252px; left: 201px; z-index: 1">
      <font style="font-size: 29px; color: rgb(255, 255, 255)"><b>♪</b></font>
    </div>
    <div style="position: absolute; top: 156px; left: 1125px; z-index: 1">
      <font style="font-size: 20px; color: rgb(255, 255, 255)"><b>♪</b></font>
    </div>
    <div style="position: absolute; top: 265px; left: 1306px; z-index: 1">
      <font style="font-size: 31px; color: rgb(255, 255, 255)"><b>♪</b></font>
    </div>
    <div style="position: absolute; top: 178px; left: 495px; z-index: 1">
      <font style="font-size: 39px; color: rgb(255, 255, 255)"><b>♪</b></font>
    </div>
    <div style="position: absolute; top: 296px; left: 1614px; z-index: 1">
      <font style="font-size: 34px; color: rgb(255, 255, 255)"><b>♪</b></font>
    </div>
    <h1 class="project-name">{{ general.title }}</h1>
    <h2 class="project-tagline">{{ general.subtitle }}</h2>
    <a :href="general.githubUrl" target="_blank" class="btn"> GitHub主页</a>
    <a :href="general.blogUrl" target="_blank" class="btn"> 博客源码</a>
  </section>
</template>

<script>
export default {
  name: "HeadPage",
  computed: {
    general() {
      return this.$page.general.edges[0].node;
    },
  },
  mounted() {
    console.log(this.$page);
  },
};
</script>

<style>
</style>