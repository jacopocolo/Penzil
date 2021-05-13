
<template>
  <div>
    <div class="toolSelection">
      <!-- <span @click="setTool('center', true)">
        <input
          type="radio"
          id="setCenter"
          name="tools"
          value="center"
          v-model="tool"
        /><label for="setCenter"> set • </label>
        <div></div>
      </span> -->

      <span @click="setTool('draw', true)">
        <input
          type="radio"
          id="toolDraw"
          name="tools"
          value="draw"
          v-model="tool"
        /><label for="toolDraw">
          <img src="@/assets/icons/draw.svg" alt="Select pencil" />
        </label>
        <div></div> </span
      ><span @click="setTool('erase', true)">
        <input
          type="radio"
          id="toolEraser"
          name="tools"
          value="erase"
          v-model="tool"
        /><label for="toolEraser">
          <img src="@/assets/icons/eraser.svg" alt="Select eraser" />
        </label>
        <div></div> </span
      ><span @click="setTool('select', true)">
        <input
          type="radio"
          id="toolSelect"
          name="tools"
          value="select"
          v-model="tool"
        /><label for="toolSelect">
          <img src="@/assets/icons/select.svg" alt="Select selector" />
        </label>
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
.toolSelection {
  padding-left: 6px;
  white-space: discard;
  display: flex;
  width: 400px;
  float: left;
}

#setCenter + label {
  margin-right: 50px;
}

ul {
  list-style: none;
}
li {
  display: inline-block;
  margin-right: 15px;
}
input {
  visibility: hidden;
}
label {
  cursor: pointer;
  padding: 16px;
  border-radius: 6px;
}

label > img {
  position: relative;
  bottom: -12px;
}

input:checked + label {
  background: rgba(30, 30, 0, 0.2);
}
</style>