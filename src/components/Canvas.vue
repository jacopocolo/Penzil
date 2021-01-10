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
import { select } from "./select.js";
import { scene } from "../App.vue";

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
    };
  },
  props: {
    selectedTool: String,
    mirror: [Boolean, String],
  },
  emits: ["selected"],
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

        switch (this.selectedTool) {
          case "draw":
            line.onStart(this.mirror);
            break;
          case "erase":
            //
            break;
          case "select":
            select.onStart(
              this.mouse.tx,
              this.mouse.ty,
              this.mouse.cx,
              this.mouse.cy
            );
            break;
          default:
            break;
        }
      }
    },
    onMove: function (event) {
      if (this.mouse.down && (event.button == 0 || event.touches.length == 1)) {
        switch (this.selectedTool) {
          case "draw":
            line.onMove(
              this.mouse.tx,
              this.mouse.ty,
              0,
              this.mouse.force,
              true
            );
            break;
          case "erase":
            //
            break;
          case "select":
            select.onMove(this.mouse.cx, this.mouse.cy);
            break;
          default:
            break;
        }
      }
    },
    onEnd: function () {
      if (this.mouse.down) {
        switch (this.selectedTool) {
          case "draw":
            line.onEnd(this.mirror);
            break;
          case "erase":
            //
            break;
          case "select":
            select.onEnd(this.mouse.tx, this.mouse.ty);
            if (scene.userData.controls != undefined) {
              this.$emit("selected", scene.userData.controls.object);
            }
            break;
          default:
            break;
        }
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
  z-index: 1;
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