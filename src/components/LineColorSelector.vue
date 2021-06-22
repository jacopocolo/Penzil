
<template>
  <div class="color">
    <div class="color-container" @click="setActive">
      <!-- <div
        class="color-bubble"
        :style="{
          'background-color': active
            ? `rgb(${r},${g},${b})`
            : `rgba(255,255,255,0)`,
        }"
      /> -->
      <svg
        v-if="active"
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M33.3 18C33.3 26.45 26.45 33.3 18 33.3C9.55004 33.3 2.7 26.45 2.7 18C2.7 9.55004 9.55004 2.7 18 2.7C26.45 2.7 33.3 9.55004 33.3 18Z"
          :stroke="'rgb(' + r + ',' + g + ',' + b + ')'"
          stroke-width="5.4"
        />
      </svg>

      <svg
        v-if="!active"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M37.5 20C37.5 29.665 29.665 37.5 20 37.5C10.335 37.5 2.5 29.665 2.5 20C2.5 10.335 10.335 2.5 20 2.5C29.665 2.5 37.5 10.335 37.5 20Z"
          stroke="black"
        />
        <path d="M8 32.3431L32.3431 8" stroke="black" stroke-width="8" />
      </svg>
    </div>
    <div class="sliders" v-if="active">
      <span class="hsb-slider"
        ><span>h</span
        ><input type="range" min="0" max="359" id="hue-slider" v-model="hue"
      /></span>
      <span class="hsb-slider"
        ><span>s</span
        ><input
          type="range"
          min="0"
          max="99"
          class="hsb-slider"
          id="saturation-slider"
          v-model="saturation"
          :style="{
            background: `linear-gradient(
    to right,
    hsl(${hue}, 0%, 50%) 0%,
    hsl(${hue}, 50%, 50%) 90%
  )`,
          }"
      /></span>
      <span class="hsb-slider"
        ><span>b</span
        ><input
          type="range"
          min="0"
          max="99"
          class="hsb-slider"
          id="brightness-slider"
          v-model="brightness"
      /></span>
    </div>
  </div>
</template>

<script>
//https://codepen.io/HunorMarton/details/eWvewo

export default {
  name: "ColorSelector",
  data() {
    return {
      active: true,
      hue: 0,
      saturation: 50,
      brightness: 50,
      r: 0,
      g: 0,
      b: 0,
    };
  },
  props: {},
  methods: {
    updateColor: function (h, s, v) {
      var r, g, b, i, f, p, q, t;
      if (arguments.length === 1) {
        (s = h.s), (v = h.v), (h = h.h);
      }
      i = Math.floor(h * 6);
      f = h * 6 - i;
      p = v * (1 - s);
      q = v * (1 - f * s);
      t = v * (1 - (1 - f) * s);
      switch (i % 6) {
        case 0:
          (r = v), (g = t), (b = p);
          break;
        case 1:
          (r = q), (g = v), (b = p);
          break;
        case 2:
          (r = p), (g = v), (b = t);
          break;
        case 3:
          (r = p), (g = q), (b = v);
          break;
        case 4:
          (r = t), (g = p), (b = v);
          break;
        case 5:
          (r = v), (g = p), (b = q);
          break;
      }

      (this.r = Math.round(r * 255)),
        (this.g = Math.round(g * 255)),
        (this.b = Math.round(b * 255));

      this.$emit("color", { r: this.r, g: this.g, b: this.b });
    },
    setActive() {
      this.active = !this.active;
      this.$emit("active", { active: this.active });
    },
  },
  watch: {
    hue: function () {
      this.updateColor(
        this.hue / 359,
        this.saturation / 99,
        this.brightness / 99
      );
    },
    saturation: function () {
      this.updateColor(
        this.hue / 359,
        this.saturation / 99,
        this.brightness / 99
      );
    },
    brightness: function () {
      this.updateColor(
        this.hue / 359,
        this.saturation / 99,
        this.brightness / 99
      );
    },
  },
  mounted() {
    this.updateColor(
      this.hue / 359,
      this.saturation / 99,
      this.brightness / 99
    );
  },
};
</script>

<style scoped>
.color-container {
  content: " ";
  width: 44px;
  height: 44px;
  padding: 8px;
  float: right;
  display: block;
}

.color-bubble {
  border-radius: 22px;
  height: 36px;
  width: 36px;
  border: 1px solid #1c1c1e;
}

.sliders {
  float: left;
}

.hsb-slider {
  display: flex;
  align-content: center;
  align-items: center;
}

.hsb-slider span {
  width: 8px;
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

#brightness-slider {
  background: linear-gradient(
    to right,
    hsl(0, 0%, 0%) 0%,
    hsl(0, 0%, 100%) 100%
  );
}

.hsb-slider span {
  margin-right: 8px;
}

label {
  display: flex;
}
</style>