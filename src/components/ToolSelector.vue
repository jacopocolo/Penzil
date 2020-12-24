
<template>
  <div class="mainToolbar">
    <div class="toolSelection">
      <span>
        <input
          type="radio"
          id="toolDraw"
          name="tools"
          value="draw"
          v-model="selectedTool"
        /><label for="toolDraw"> Draw </label>
        <div></div> </span
      ><span>
        <input
          type="radio"
          id="toolEraser"
          name="tools"
          value="erase"
          v-model="selectedTool"
        /><label for="toolEraser"> Erase </label>
        <div></div> </span
      ><span>
        <input
          type="radio"
          id="toolSelect"
          name="tools"
          value="select"
          v-model="selectedTool"
        /><label for="toolSelect"> Select </label>
        <div></div>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ToolSelector",
  data() {
    return {
      selectedTool: "draw",
    };
  },
  watch: {
    selectedTool: function (val) {
      this.$emit("selected-tool", val);
    },
  },
};
</script>

<style>
.mainToolbar {
  position: absolute;
  top: 0;
  left: calc(50% - 160px);
  z-index: 6;
}

.toolSelection {
  padding-left: 6px;
  white-space: discard;
  display: flex;
  width: 300px;
  float: left;
}
</style>