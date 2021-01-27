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
import { draw } from "./draw.js";
import { erase } from "./erase.js";
import { select } from "./select.js";

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
  emits: ["setTransformToolbarDisplay", "setTransformToolbarPosition"],
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
            draw.onStart(this.mirror);
            break;
          case "erase":
            erase.onStart(this.mouse.cx, this.mouse.cy);
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
            draw.onMove(
              this.mouse.tx,
              this.mouse.ty,
              0,
              this.mouse.force,
              true
            );
            break;
          case "erase":
            erase.onMove(this.mouse.cx, this.mouse.cy);
            break;
          case "select":
            select.onMove(this.mouse.cx, this.mouse.cy);
            if (select.dragged == true) {
              this.$emit("setTransformToolbarDisplay", !select.dragged);
            }
            break;
          default:
            break;
        }
      } else {
        return;
      }
    },
    onEnd: function () {
      if (this.mouse.down) {
        switch (this.selectedTool) {
          case "draw":
            draw.onEnd(this.mirror);
            break;
          case "erase":
            erase.onEnd();
            break;
          case "select":
            select.onEnd(this.mouse.tx, this.mouse.ty);

            //doesn't work but we are getting there?
            if (select.s.controls != undefined) {
              this.$emit("setTransformToolbarDisplay", true);
              let position = select.s.calculateTransfromToolbarPosition();
              this.$emit("setTransformToolbarPosition", {
                left: position.x,
                top: position.y,
                location: position.location,
              });
            } else {
              this.$emit("setTransformToolbarDisplay", false);
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