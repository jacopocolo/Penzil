
<template>
  <div v-if="show" class="toast">{{ text }}</div>
</template>

<script>
export default {
  name: "Toast",
  data() {
    return {
      show: false,
      text: "Selection duplicated",
    };
  },
  watch: {
    show: function (val) {
      if (val == true) {
        console.log(this.show);
        setTimeout(function () {
          this.show = false;
        }, 2000);
      }
    },
  },
  methods: {
    close: function () {
      this.show = false;
    },
  },
};
</script>

<style>
.toast {
  position: absolute;
  top: 90%;
  left: calc(50% - 100px);
  width: 200px;
  z-index: 9999;
  padding: 14px;
  background-color: var(--ui-bg-color);
  color: #ffffff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  box-sizing: content-box;
  transition: all 0.3s ease;
  font-weight: 400;
  text-align: center;
}
</style>