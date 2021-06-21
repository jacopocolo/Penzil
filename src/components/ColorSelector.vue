
<template>
  <div class="color">
    <span class="hsb-slider"
      ><span>h</span
      ><input type="range" min="0" max="359" id="hue-slider" v-model="hue"
    /></span>
    <span class="hsb-slider"
      ><span>s</span
      ><input
        type="range"
        min="1"
        max="100"
        class="hsb-slider"
        id="saturation-slider"
        v-model="saturation"
    /></span>
    <span class="hsb-slider"
      ><span>b</span
      ><input
        type="range"
        min="1"
        max="100"
        class="hsb-slider"
        id="brightness-slider"
        v-model="brightness"
    /></span>
  </div>
</template>

<script>
//https://codepen.io/HunorMarton/details/eWvewo

export default {
  name: "ColorSelector",
  data() {
    return {
      hue: 0,
      saturation: 50,
      brightness: 50,
    };
  },
  props: {},
  methods: {},
  watch: {},
  mounted() {},
};
</script>

<style scoped>
.hsb-slider {
  display: flex;
  align-content: center;
  align-items: center;
}

input {
  -webkit-appearance: none; /* Override default CSS styles */
  appearance: none;
  height: 8px;
}

#hue-slider {
  background: linear-gradient(
    to right,
    hsl(0, 100%, 50%) 0%,
    hsl(60, 100%, 50%) 16.67%,
    hsl(120, 100%, 50%) 33.33%,
    hsl(180, 100%, 50%) 50%,
    hsl(240, 100%, 50%) 66.67%,
    hsl(320, 100%, 50%) 83.33%,
    hsl(360, 100%, 50%) 100%
  );
}

.hsb-slider span {
  margin-right: 8px;
}

label {
  display: flex;
}
</style>