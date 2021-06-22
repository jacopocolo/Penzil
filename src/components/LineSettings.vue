
<template>
  <div class="lineSettings" v-if="selectedTool == 'draw'">
    <!-- <input type="checkbox" id="stroke" name="strokeBool" v-model="stroke" />
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
    <input type="color" name="fillColor" v-model="fillColor" /> -->
    <line-width-selector @width="setStrokeWidth" />
    <line-color-selector
      @color="setStrokeColor"
      @active="setStrokeActive"
    /><br />
    <line-color-selector @color="setFillColor" @active="setFillActive" />
  </div>
</template>

<script>
import LineColorSelector from "./LineColorSelector.vue";
import LineWidthSelector from "./LineWidthSelector.vue";

export default {
  components: { LineColorSelector, LineWidthSelector },
  name: "Modal",
  data() {
    return {
      stroke: true,
      strokeColor: "#1C1C1E",
      strokeWidth: 20,
      fill: true,
      fillColor: "#000000",
    };
  },
  props: {
    selectedTool: String,
  },
  methods: {
    setStrokeColor: function (val) {
      this.strokeColor = "rgb(" + val.r + "," + val.g + "," + val.b + ")";
    },
    setStrokeActive: function (val) {
      this.stroke = val.active;
    },
    setStrokeWidth: function (val) {
      this.strokeWidth = val.width;
    },
    setFillColor: function (val) {
      this.fillColor = "rgb(" + val.r + "," + val.g + "," + val.b + ")";
    },
    setFillActive: function (val) {
      this.fill = val.active;
    },
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
  top: 8px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>