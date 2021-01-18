
<template>
  <div>
    <button @click="undo">Undo</button>
    <button @click="redo">Redo</button>
  </div>
</template>

<script>
import UndoManager from "undo-manager";

export let undoManager = new UndoManager();

export default {
  name: "UndoRedo",
  props: {},
  data() {
    return {};
  },
  methods: {
    undo: function () {
      console.log("undo");
      undoManager.undo();
    },
    redo: function () {
      console.log("redo");
      undoManager.redo();
    },
  },
  watch: {},
  mounted() {},
};
</script>

<style scoped>
div {
  z-index: 2;
  position: absolute;
  top: 0;
  right: 10px;
}
</style>