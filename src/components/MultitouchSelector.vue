<template>
  <div class="mainToolbar">
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

      <span @click="setMultitouch('canvas', true)">
        <input
          type="radio"
          id="canvasMultitouch"
          name="multitouch"
          value="canvas"
          v-model="touch"
        /><label for="canvasMultitouch"> Canvas </label>
        <div></div> </span
      ><span @click="setMultitouch('camera', true)">
        <input
          type="radio"
          id="cameraMultitouch"
          name="multitouch"
          value="camera"
          v-model="touch"
        /><label for="cameraMultitouch"> Camera </label>
        <div></div>
      </span>
    </div>
  </div>
</template>

<script>
//the way this is handled is a bit ridicolous but I'm not sure if I can do it in another way. selectedMultitouch is passed as a prop from the App and then is watched by the component to reset the checked radio. The setMultitouch function sets the tool in the App that then is passed back into the component and loops again.

export default {
  name: "ToolSelector",
  data() {
    return {
      touch: undefined,
    };
  },
  props: {
    selectedMultitouch: String,
  },
  watch: {
    selectedMultitouch: function (val) {
      this.touch = val;
    },
  },
  methods: {
    setMultitouch: function (val, emit) {
      this.touch = val;
      if (emit) {
        this.$emit("selected-multitouch", val);
      }
    },
  },
  mounted() {
    this.setMultitouch(this.selectedMultitouch);
  },
};
</script>

<style scoped>
.mainToolbar {
  position: absolute;
  left: 0;
  top: calc(50% - 160px);
  z-index: 2;
  display: flex;
  flex-direction: column;
}

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
</style>