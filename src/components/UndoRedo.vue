
<template>
  <div>
    <button @click="undo">Undo</button>
    <button @click="redo">Redo</button>
  </div>
</template>

<script>
import UndoManager from "undo-manager";
import { scene } from "../App.vue";

export let undoManager = new UndoManager();

export default {
  name: "UndoRedo",
  props: {},
  data() {
    return {};
  },
  methods: {
    undo: function () {
      undoManager.undo();
      console.log(scene);
    },
    redo: function () {
      undoManager.redo();
    },
    setTool: function (val) {
      this.$emit("selected-tool", val);
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