<template>
  <div class="lg-steps">
    <!-- 线 -->
    <div class="lg-steps-line"></div>

    <!-- 步骤项目 -->
    <slot />
  </div>
</template>

<script>
export default {
  name: "LgSteps",
  // 接收外部传入的属性
  mounted() {
    console.log(this.$children);
  },
  props: {
    count: {
      type: Number,
      default: 3
    },
    active: {
      type: Number,
      default: 0
    },
    direction: {
      type: String,
      default: "horizontal", // 可选值 vertical/horizontal      默认horizontal 横向
      // 自定义验证函数
      validator: function(value) {
        // 这个值必须匹配下列字符串中的一个
        return ["vertical", "horizontal"].indexOf(value) !== -1;
      }
    },
    activeColor: {
      type: String,
      default: "green"
    },
    defaultColor: {
      type: String,
      default: "black"
    }
  },
  methods: {}
};
</script>

<style>
.lg-steps-line {
  position: absolute;
  height: 2px;
  top: 16px;
  /* top: 50%; */
  left: 24px;
  right: 24px;
  /* transform: translateY(-50%); */
  z-index: -1;
  background: rgb(223, 231, 239);
}
.lg-steps {
  position: relative;
  display: flex;
  justify-content: space-between;
}
</style>