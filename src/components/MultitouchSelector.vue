
<template>
  <div class="multitouchToolbar">
    <img
      class="fiveDots"
      src="@/assets/icons/2dots3dots.svg"
      alt="Two dots and three dots indicator: these tools can be used with two and three fingers"
    />
    <div class="MultitouchSelection">
      <span @click="setMultitouch('camera', true)">
        <input
          type="radio"
          id="multitouchCamera"
          name="multitouch"
          value="camera"
          v-model="multitouch"
        /><label for="multitouchCamera"
          ><img
            src="@/assets/icons/camera.svg"
            alt="Select camera for multitouch gestures"
        /></label>
        <div></div> </span
      ><span @click="setMultitouch('canvas', true)">
        <input
          type="radio"
          id="multitouchCanvas"
          name="multitouch"
          value="canvas"
          v-model="multitouch"
        /><label for="multitouchCanvas"
          ><img
            src="@/assets/icons/canvas.svg"
            alt="Select canvas for multitouch gestures"
        /></label>
        <div></div>
      </span>
    </div>
  </div>
</template>

<script>
//the way this is handled is a bit ridicolous but I'm not sure if I can do it in another way. selectedMultitouch is passed as a prop from the App and then is watched by the component to reset the checked radio. The setTool function sets the tool in the App that then is passed back into the component and loops again.

export default {
  name: "MultitouchSelector",
  data() {
    return {
      multitouch: undefined,
    };
  },
  props: {
    selectedMultitouch: String,
  },
  watch: {
    selectedMultitouch: function (val) {
      this.multitouch = val;
    },
  },
  methods: {
    setMultitouch: function (val, emit) {
      this.multitouch = val;
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
.multitouchToolbar {
  position: absolute;
  top: calc(50% - 66px);
  left: 12px;
  z-index: 2;
  filter: drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.08));
}

label {
  height: 60px;
  display: flex;
  justify-content: center; /* align horizontal */
  align-items: center; /* align vertical */
}

img {
  max-height: 44px;
}

#multitouchCamera + label {
  border-radius: 8px 8px 0px 0px;
}

#multitouchCanvas + label {
  border-radius: 0px 0px 8px 8px;
}

.fiveDots {
  position: absolute;
  left: 20px;
  top: -20px;
  clear: both;
  float: left;
}
</style>