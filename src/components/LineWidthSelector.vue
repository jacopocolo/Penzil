
<template>
  <div class="width"></div>
  <div class="sliders">
    <!-- <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.1455 7.80725L6.6715 6.97238L7.45591 8.47383C11.5842 16.3759 13.7255 20.4582 16.8779 23.5356C20.03 26.6126 24.178 28.6702 32.2098 32.6358L33.5857 33.3152L32.8741 31.9556C29.2847 25.0981 27.2321 21.3677 23.9889 18.1994C20.756 15.0412 16.3562 12.4578 8.1455 7.80725Z"
        fill="black"
        stroke="black"
        stroke-linecap="round"
        :stroke-width="width"
      />
    </svg> -->
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 38C29.9411 38 38 29.9411 38 20C38 10.0589 29.9411 2 20 2C10.0589 2 2 10.0589 2 20C2 29.9411 10.0589 38 20 38Z"
        fill="#CCCCCC"
      />
      <circle cx="20" cy="20" :r="width / 2" fill="#1C1C1E" />
    </svg>

    <span class="width-slider"
      ><span>w</span
      ><input type="range" min="1" max="30" id="width-slider" v-model="width"
    /></span>
  </div>
</template>

<script>
export default {
  name: "ColorSelector",
  data() {
    return {
      width: 1,
    };
  },
  props: {},
  methods: {},
  watch: {
    width: function (val) {
      this.$emit("width", { width: val });
    },
  },
};
</script>

<style scoped>
svg {
  overflow: visible;
}

.sliders {
  float: left;
}

.width-slider {
  display: flex;
  align-content: center;
  align-items: center;
}

.width-slider span {
  width: 8px;
}

input {
  -webkit-appearance: none; /* Override default CSS styles */
  appearance: none;
  height: 8px;
}

label {
  display: flex;
}
</style>