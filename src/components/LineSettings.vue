
<template>
  <div
    class="lineSettings"
    v-bind:class="[selectedTool != 'draw' ? 'hidden ' : '']"
  >
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      :fill="fill ? fillColor : 'none'"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M34.5 20C34.5 28.0081 28.0081 34.5 20 34.5C11.9919 34.5 5.5 28.0081 5.5 20C5.5 11.9919 11.9919 5.5 20 5.5C28.0081 5.5 34.5 11.9919 34.5 20Z"
        :stroke="stroke ? strokeColor : 'none'"
        :stroke-width="strokeWidth / 1.8"
      />
    </svg>

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
  bottom: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>