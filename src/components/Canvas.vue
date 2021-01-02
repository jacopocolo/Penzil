<template>
  <canvas
    @touchstart="handleInput"
    @touchmove="handleInput"
    @touchend="handleInput"
    @mousedown="handleInput"
    @mousemove="handleInput"
    @mouseup="handleInput"
    id="twod"
  >
  </canvas>
  <div id="threed"></div>
</template>

<script>
import { line } from "./line.js";

export default {
  name: "Canvas",
  data() {
    return {
      mouse: {
        down: false,
        tx: 0, //x coord for threejs
        ty: 0, //y coord for threejs
        cx: 0, //x coord for canvas
        cy: 0, //y coord for canvas
        force: 0,
      },
      tool: "draw",
    };
  },
  props: {
    selectedTool: String,
    mirror: [Boolean, String],
  },
  methods: {
    updateMouseCoordinates: function (event) {
      if (event.touches) {
        this.mouse.tx =
          (event.changedTouches[0].pageX / window.innerWidth) * 2 - 1;
        this.mouse.ty =
          -(event.changedTouches[0].pageY / window.innerHeight) * 2 + 1;
        this.mouse.cx = event.changedTouches[0].pageX;
        this.mouse.cy = event.changedTouches[0].pageY;

        if (event.touches[0] && event.touches[0]["force"] !== undefined) {
          this.mouse.force = event.touches[0]["force"];
        } else {
          this.mouse.force = 0;
        }
      } else {
        if (event.button == 0) {
          this.mouse.tx = (event.clientX / window.innerWidth) * 2 - 1;
          this.mouse.ty = -(event.clientY / window.innerHeight) * 2 + 1;
          this.mouse.cx = event.clientX;
          this.mouse.cy = event.clientY;
        }
      }
    },
    onStart: function (event) {
      if (event.button == 0 || event.touches.length == 1) {
        this.mouse.down = true;
        line.onStart(this.mirror);
      }
    },
    onMove: function (event) {
      if (this.mouse.down && (event.button == 0 || event.touches.length == 1)) {
        line.onMove(this.mouse.tx, this.mouse.ty, 0, this.mouse.force, true);
      }
    },
    onEnd: function () {
      if (this.mouse.down) {
        line.onEnd(this.mirror);
      }
      this.mouse.down = false;
    },
    handleInput: function (event) {
      this.updateMouseCoordinates(event);

      switch (event.type) {
        case "touchstart":
          this.onStart(event);
          break;
        case "touchmove":
          this.onMove(event);
          break;
        case "touchend":
          this.onEnd(event);
          break;
        case "mousedown":
          this.onStart(event);
          break;
        case "mousemove":
          this.onMove(event);
          break;
        case "mouseup":
          this.onEnd(event);
          break;
        default:
        //nothing;
      }
    },
  },
  watch: {},
  mounted() {},
};
</script>

<style>
#container {
  height: 100%;
  width: 100%;
}

#twod {
  position: absolute;
  z-index: 0;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

#threed {
  width: 100%;
  height: 100%;
}
</style>