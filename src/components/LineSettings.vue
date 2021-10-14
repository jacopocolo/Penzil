
<template>
  <div
    class="lineSettings"
    v-bind:class="[
      selectedTool != 'draw' ? 'hidden ' : '',
      panelVisible ? 'top' : '',
    ]"
  >
    <div class="toggle" @click="togglePanelVisibility">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        :fill="fill ? fillColor : 'none'"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M31.5 20C31.5 26.3513 26.3513 31.5 20 31.5C13.6487 31.5 8.5 26.3513 8.5 20C8.5 13.6487 13.6487 8.5 20 8.5C26.3513 8.5 31.5 13.6487 31.5 20Z"
          :stroke="stroke ? strokeColor : 'none'"
          :stroke-width="strokeWidth / 1.6"
        />
      </svg>
    </div>
    <div class="panel" v-bind:class="[panelVisible ? '' : 'hidden']">
      <line-sliders
        mode="stroke"
        :active="stroke"
        @color="setStrokeColor"
        @active="setStrokeActive"
        @width="setStrokeWidth"
      />
      <line-sliders
        :active="fill"
        mode="fill"
        @color="setFillColor"
        @active="setFillActive"
      />
    </div>
  </div>
  <div
    class="click-outside"
    v-if="panelVisible"
    v-bind:style="[panelVisible ? 'z-index: 6' : '']"
    @click="togglePanelVisibility()"
  ></div>
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
      strokeWidth: 5,
      fill: false,
      fillColor: "#000000",
      panelVisible: false,
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
    togglePanelVisibility: function () {
      this.panelVisible = !this.panelVisible;
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
  left: calc(50% - 192px);
  display: flex;
  flex-direction: column;
  width: 44px;
  height: 44px;
  background-color: white;
  border-radius: 8px;
  gap: 8px;
  filter: drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.08));
}

.toggle {
  display: flex;
  filter: drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.08));
  align-items: center;
  vertical-align: bottom;
  justify-content: center;
  align-content: center;
  text-align: center;
  padding-top: 2px;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: white;
  filter: drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.08));
  width: fit-content;
  padding: 8px;
  padding-bottom: 12px;
  border-radius: 8px;
}

.top {
  z-index: 10;
}

.click-outside {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
}
</style>