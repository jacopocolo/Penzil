
<template>
  <div
    class="lineSettings"
    v-bind:class="[selectedTool != 'draw' ? 'hidden ' : '']"
  >
    <line-sliders
      mode="stroke"
      :active="stroke"
      @color="setStrokeColor"
      @active="setStrokeActive"
      @width="setStrokeWidth"
    /><br />
    <line-sliders
      :active="fill"
      mode="fill"
      @color="setFillColor"
      @active="setFillActive"
    />
  </div>
</template>

<script>
import LineSliders from "./LineSliders.vue";
// import LineWidthSelector from "./LineWidthSelector.vue";

export default {
  components: { LineSliders },
  name: "Modal",
  data() {
    return {
      stroke: true,
      strokeColor: "#1C1C1E",
      strokeWidth: 2,
      fill: false,
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
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>