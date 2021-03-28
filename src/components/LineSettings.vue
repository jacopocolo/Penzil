
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
      strokeColor: "#ff0000",
      strokeWidth: 1,
      fill: true,
      fillColor: "#000000",
    };
  },
  props: {
    selectedTool: String,
  },
  methods: {
    emitStroke: function () {
      this.$emit("stroke", {
        lineWidth: this.strokeWidth / 500,
        color: this.strokeColor,
      });
    },
    emitFill: function () {
      this.$emit("fill", { color: this.fillColor });
    },
  },
  watch: {
    stroke: function (val) {
      if (val == true) {
        this.emitStroke();
      } else {
        this.$emit("stroke", false);
      }
    },
    strokeWidth: function () {
      if (this.stroke == true) {
        this.emitStroke();
      } else {
        this.$emit("stroke", false);
      }
    },
    strokeColor: function () {
      if (this.stroke == true) {
        this.emitStroke();
      } else {
        this.$emit("stroke", false);
      }
    },
    fill: function (val) {
      if (val == true) {
        this.emitFill();
      } else {
        this.$emit("fill", false);
      }
    },
    fillColor: function () {
      if (this.fill == true) {
        this.emitFill();
      } else {
        this.$emit("fill", false);
      }
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
}
</style>