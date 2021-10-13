
<template>
  <div class="color" :style="cssProps">
    <div class="toggle" @click="setActive">
      <img src="@/assets/icons/checkbox.svg" v-if="!active" alt="Enable" />
      <img
        src="@/assets/icons/checkbox-checked.svg"
        v-if="active"
        alt="Disable"
      /><span>{{
        this.mode.charAt(0).toUpperCase() + this.mode.substr(1).toLowerCase()
      }}</span>
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
      brightness: 25,
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
        "--width-margin": this.map(this.width, 1, 20, -6, +6) + "px",
        "--width-radius": this.calcRadius(this.width * 4, 1, 80), //workaround because range is othewise so low
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
.toggle {
  height: 32px;
  float: left;
  display: flex;
  flex-direction: row;
  gap: 8px;
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

input {
  width: 200px;
}

.width-slider > input[type="range"] {
  border: 1px solid #1c1c1e;
  border-radius: 4px;
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
  width: 20px;
  text-align: center;
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

#width-slider {
  border-radius: var(--width-radius);
}

#width-slider::-webkit-slider-thumb {
  left: var(--width-margin);
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