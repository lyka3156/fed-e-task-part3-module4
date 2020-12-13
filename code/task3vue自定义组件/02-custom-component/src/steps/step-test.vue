<template :active="active" finish-status="success">
  <div>
    <steps>
      <step title="步骤1"></step>
      <step title="步骤2"></step>
      <step title="步骤3"></step>
    </steps>

    <button style="margin-top: 12px;" @click="next">下一步</button>
  </div>
</template>

<script>
import steps from "./steps";
import step from "./step";
export default {
  data() {
    return {
      active: 0
    };
  },
  methods: {
    next() {
      if (this.active++ > 2) this.active = 0;
      console.log(this.active);
    }
  },
  components: {
    steps,
    step
  }
};
</script>

<style>
</style>