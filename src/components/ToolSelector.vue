
<template>
  <div class="mainToolbar">
    <div class="toolSelection">
      <span @click="setTool('draw', true)">
        <input
          type="radio"
          id="toolDraw"
          name="tools"
          value="draw"
          v-model="tool"
        /><label for="toolDraw"> Draw </label>
        <div></div> </span
      ><span @click="setTool('erase', true)">
        <input
          type="radio"
          id="toolEraser"
          name="tools"
          value="erase"
          v-model="tool"
        /><label for="toolEraser"> Erase </label>
        <div></div> </span
      ><span @click="setTool('select', true)">
        <input
          type="radio"
          id="toolSelect"
          name="tools"
          value="select"
          v-model="tool"
        /><label for="toolSelect"> Select </label>
        <div></div>
      </span>
    </div>
  </div>
</template>

<script>
//the way this is handled is a bit ridicolous but I'm not sure if I can do it in another way. selectedTool is passed as a prop from the App and then is watched by the component to reset the checked radio. The setTool function sets the tool in the App that then is passed back into the component and loops again.

export default {
  name: "ToolSelector",
  data() {
    return {
      tool: undefined,
    };
  },
  props: {
    selectedTool: String,
  },
  watch: {
    selectedTool: function (val) {
      this.tool = val;
    },
  },
  methods: {
    //https://reactgo.com/vue-call-component-outside/
    setTool: function (val, emit) {
      this.tool = val;
      if (emit) {
        this.$emit("selected-tool", val);
      }
    },
  },
  mounted() {
    this.setTool(this.selectedTool);
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