
<template>
  <div class="lineSettings" v-if="selectedTool == 'draw'">
    <input type="checkbox" id="stroke" name="strokeBool" v-model="stroke" />
    <label for="strokeBool"> Stroke</label>
    <input type="color" id="favcolor" name="favcolor" v-model="strokeColor" />
    <input
      type="number"
      id="width"
      name="width"
      min="1"
      max="10"
      v-model="strokeWidth"
    />
    <input type="checkbox" id="fill" name="strokeFill" v-model="fill" />
    <label for="fillBool"> Fill</label>
    <input type="color" name="fillColor" v-model="fillColor" />
  </div>
</template>

<script>
export default {
  name: "Modal",
  data() {
    return {
      stroke: true,
      strokeColor: "#1C1C1E",
      strokeWidth: 1,
      fill: false,
      fillColor: "#000000",
    };
  },
  props: {
    selectedTool: String,
  },
  methods: {
    emitStroke: function () {
      this.$emit("stroke", {
        show_stroke: this.stroke,
        lineWidth: this.strokeWidth / 500,
        color: this.strokeColor,
      });
    },
    emitFill: function () {
      this.$emit("fill", { show_fill: this.fill, color: this.fillColor });
    },
  },
  watch: {
    stroke: function () {
      this.emitStroke();
    },
    strokeWidth: function () {
      this.emitStroke();
    },
    strokeColor: function () {
      this.emitStroke();
    },
    fill: function () {
      this.emitFill();
    },
    fillColor: function () {
      this.emitFill();
    },
  },
  mounted() {
    this.emitStroke();
    this.emitFill();
  },
};
</script>

<style>
.lineSettings {
  z-index: 2;
  position: absolute;
  top: 0;
  right: 10px;
  display: none;
}
</style>