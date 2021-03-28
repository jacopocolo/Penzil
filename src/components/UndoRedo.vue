
<template>
  <div>
    <button @click="undo" :disabled="undoDisabled">Undo</button>
    <button @click="redo" :disabled="redoDisabled">Redo</button>
  </div>
</template>

<script>
import UndoManager from "undo-manager";

export let undoManager = new UndoManager();
export let undoRedoComponent;

export default {
  name: "UndoRedo",
  props: {},
  data() {
    return {
      undoDisabled: true,
      redoDisabled: true,
    };
  },
  methods: {
    undo: function () {
      undoManager.undo();
      this.updateUi();
    },
    redo: function () {
      undoManager.redo();
      this.updateUi();
    },
    setTool: function (val) {
      this.$emit("selected-tool", val);
    },
    updateUi: function () {
      this.undoDisabled = !undoManager.hasUndo();
      this.redoDisabled = !undoManager.hasRedo();
    },
  },
  watch: {},
  mounted() {
    undoRedoComponent = this;
  },
};
</script>

<style scoped>
div {
  z-index: 2;
  position: absolute;
  bottom: 0;
  right: 10px;
}
</style>