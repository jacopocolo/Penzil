
<template>
  <div>
    <button @click="undo" :disabled="undoDisabled">
      <img src="@/assets/icons/undo.svg" alt="undo" />
    </button>
    <button @click="redo" :disabled="redoDisabled">
      <img src="@/assets/icons/redo.svg" alt="redo" />
    </button>
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
  top: 12px;
  height: 44px;
  left: calc(50% + 16px);
  background-color: #fff;
  border-radius: 8px;
  filter: drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.08));
}

button {
  background-color: rgba(255, 255, 255, 0);
  border: none;
  border-radius: 0px;
  height: 44px;
}

button:first-child {
  border-right: 2px solid #ffe8b3;
}

button:disabled > img {
  opacity: 0.5;
}
</style>