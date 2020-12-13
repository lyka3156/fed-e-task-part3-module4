<template>
  <div class="lg-step-item" :class="this.isActiveCls">
    <div class="lg-step">{{this.index}}</div>
    <div class="lg-title">{{ this.title }}</div>
    <div class="lg-description">{{ this.description }}</div>
  </div>
</template>

<script>
export default {
  name: "LgStep",
  beforeMount() {
    this.index = this.$parent.$children.length;
    // console.log(this.isActive);
  },
  data: () => {
    return {
      index: 1
    };
  },
  computed: {
    isActiveCls() {
      console.log(this.index, this.$parent.active + 1);
      return this.$parent.active + 1 === this.index ? "is-finish" : "";
      //   return this.$parent.active === this.index;
    }
  },
  watch: {
    index: () => {
      console.log(333333);
    }
  },
  // 接收外部传入的属性
  props: {
    title: {
      // 标题
      type: String,
      default: "步骤1"
    },
    description: {
      // String
      type: String,
      default: ""
    },
    icon: {
      // 图标
      type: String,
      default: "red"
    },
    status: {
      // 设置当前步骤的状态，不设置则根据 steps 确定状态
      // wait / process / finish / error / success
      type: String,
      default: "green"
    }
  }
};
</script>

<style>
/* 成功 */
.is-finish {
  color: green;
}

.lg-step {
  border: 2px solid;
  border-radius: 50%;
  height: 32px;
  width: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  z-index: 2;
  background-color: white;
  box-sizing: border-box;
}
</style>