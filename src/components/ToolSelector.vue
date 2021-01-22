
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
import { undoManager } from "./UndoRedo.vue";

export default {
  name: "ToolSelector",
  data() {
    return {
      selectedTool: "draw",
      history: ["draw"], //start with default
    };
  },
  watch: {
    selectedTool: function (val) {
      this.history.push(val);
      if (this.history.length > 2) {
        this.history.shift();
      }
      this.$emit("selected-tool", val);
      //needs doing, watch doesn't allow pre value tracking so this needs to be split out

      let current = val;
      let previous = this.history[0];

      console.log(this.history);

      undoManager.add({
        undo: function () {
          this.selectedTool = current;
          this.$emit("selected-tool", current);
        },
        redo: function () {
          this.selectedTool = previous;
          this.$emit("selected-tool", previous);
        },
      });
    },
  },
  methods: {
    //https://reactgo.com/vue-call-component-outside/
  },
};
</script>

<style>
.mainToolbar {
  position: absolute;
  top: 0;
  left: calc(50% - 160px);
  z-index: 2;
}

.toolSelection {
  padding-left: 6px;
  white-space: discard;
  display: flex;
  width: 300px;
  float: left;
}
</style>