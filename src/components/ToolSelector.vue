
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
        /><label for="toolDraw"
          ><img src="@/assets/icons/draw.svg" alt="Select draw tool"
        /></label>
        <div></div> </span
      ><span @click="setTool('erase', true)">
        <input
          type="radio"
          id="toolEraser"
          name="tools"
          value="erase"
          v-model="tool"
        /><label for="toolEraser"
          ><img src="@/assets/icons/erase.svg" alt="Select erase tool"
        /></label>
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

<style scoped>
.mainToolbar {
  position: absolute;
  top: 12px;
  right: calc(50% + 16px);
  z-index: 2;
}

.toolSelection {
  padding-left: 6px;
  white-space: discard;
  display: flex;
  float: left;
  filter: drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.08));
}

#toolDraw + label {
  border-radius: 8px 0px 0px 8px;
}

#toolEraser + label {
  border-radius: 0px 8px 8px 0px;
}

.oneDot {
  position: absolute;
  left: -8px;
  top: 18px;
  clear: both;
  float: left;
}

label > img {
  min-height: 44px;
}
</style>