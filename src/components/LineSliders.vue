
<template>
  <div class="color" :style="cssProps">
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
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          v-if="mode === 'stroke'"
          d="M20 38C29.9411 38 38 29.9411 38 20C38 10.0589 29.9411 2 20 2C10.0589 2 2 10.0589 2 20C2 29.9411 10.0589 38 20 38Z"
          fill="#CCCCCC"
          :stroke="'rgb(' + r + ',' + g + ',' + b + ')'"
          stroke-width="2"
        />
        <circle
          v-if="mode === 'stroke'"
          cx="20"
          cy="20"
          :r="width / 2"
          :fill="'rgb(' + r + ',' + g + ',' + b + ')'"
        />

        <path
          v-if="mode === 'fill'"
          d="M20 38C29.9411 38 38 29.9411 38 20C38 10.0589 29.9411 2 20 2C10.0589 2 2 10.0589 2 20C2 29.9411 10.0589 38 20 38Z"
          :fill="'rgb(' + r + ',' + g + ',' + b + ')'"
        />
      </svg>

      <svg
        v-if="!active"
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M37.5 20C37.5 29.665 29.665 37.5 20 37.5C10.335 37.5 2.5 29.665 2.5 20C2.5 10.335 10.335 2.5 20 2.5C29.665 2.5 37.5 10.335 37.5 20Z"
          stroke="#1c1c1e"
          stroke-width="2"
        />
        <path d="M8 32.3431L32.3431 8" stroke="#1c1c1e" stroke-width="8" />
      </svg>
    </div>
    <div class="sliders" v-if="active">
      <span class="width-slider" v-if="mode === 'stroke'"
        ><span>w</span
        ><input type="range" min="1" max="20" id="width-slider" v-model="width"
      /></span>
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
      hue: 0,
      saturation: 0,
      brightness: 0,
      width: 5,
      r: 0,
      g: 0,
      b: 0,
    };
  },
  props: { mode: String, active: Boolean },
  computed: {
    cssProps() {
      return {
        "--hue-margin": this.map(this.hue, 0, 359, -6, +6) + "px",
        "--hue-radius": this.calcRadius(this.hue, 0, 359),
        "--saturation-margin": this.map(this.saturation, 0, 99, -6, +6) + "px",
        "--saturation-radius": this.calcRadius(this.saturation, 0, 99),
        "--brightness-margin": this.map(this.brightness, 0, 99, -6, +6) + "px",
        "--brightness-radius": this.calcRadius(this.brightness, 0, 99),
      };
    },
  },
  methods: {
    map: function (n, start1, stop1, start2, stop2) {
      return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
    },
    calcRadius: function (val, min, max) {
      if (val < min + 4) {
        return "0px 4px 4px 0px";
      } else if (val > max - 4) {
        return "4px 0px 0px 4px";
      } else {
        return "4px";
      }
    },
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
      this.$emit("active", { active: !this.active });
    },
  },
  watch: {
    width: function (val) {
      this.$emit("width", { width: val });
    },
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
  padding: 0px 0px 0px 8px;
  float: left;
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
  display: flex;
  gap: 8px;
  flex-direction: column;
}

.hsb-slider,
.width-slider {
  display: flex;
  align-content: center;
  align-items: center;
  gap: 12px;
}

.hsb-slider span,
.width-slider span {
  width: 8px;
}

input[type="range"] {
  -webkit-appearance: none; /* Override default CSS styles */
  appearance: none;
  height: 8px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  background-color: rgba(255, 255, 255, 0);
  border: 6px solid #1c1c1e;
  border-radius: 3px;
  width: 20px;
  height: 20px;
  margin-top: 0px;
  overflow: visible;
  position: relative;
}

#hue-slider {
  border-radius: var(--hue-radius);
}

#hue-slider::-webkit-slider-thumb {
  left: var(--hue-margin);
}

#saturation-slider {
  border-radius: var(--saturation-radius);
}

#saturation-slider::-webkit-slider-thumb {
  left: var(--saturation-margin);
}

#brightness-slider {
  border-radius: var(--brightness-radius);
}

#brightness-slider::-webkit-slider-thumb {
  left: var(--brightness-margin);
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

label {
  display: flex;
}
</style>