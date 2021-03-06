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
import { setCenter } from "./setCenter.js";

export default {
  name: "Canvas",
  data() {
    return {
      mouse: {
        down: false,
        tx: undefined, //x coord for threejs
        ty: undefined, //y coord for threejs
        cx: undefined, //x coord for canvas
        cy: undefined, //y coord for canvas
        force: 0,
        touchLengthHistory: [0, 0],
        multiTouched: false,
        eventCancelled: false,
      },
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

        this.mouse.touchLengthHistory.push(event.touches.length);
        this.mouse.touchLengthHistory.shift();

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
        this.mouse.eventCancelled = false;
        this.mouse.multiTouched = false;
        switch (this.selectedTool) {
          case "draw":
            draw.onStart(
              this.mouse.tx,
              this.mouse.ty,
              0,
              this.mouse.force,
              true,
              this.mirror
            );
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
          case "center":
            //setCenter.set(this.mouse.tx, this.mouse.ty);
            break;
          default:
            break;
        }
      } else {
        //this means that we are escalating from a single touch to a multitouch and then we should cancel whatever input we started
        this.mouse.multiTouched = true;
        if (
          this.mouse.touchLengthHistory[0] === 1 &&
          this.mouse.touchLengthHistory[1] === 2
        ) {
          this.mouse.eventCancelled = true;
          switch (this.selectedTool) {
            case "draw":
              draw.onCancel();
              break;
            case "erase":
              erase.onCancel();
              break;
            case "select":
              select.onCancel();
              break;
            case "center":
              //setCenter.set(this.mouse.tx, this.mouse.ty);
              break;
            default:
              break;
          }
        }
      }
    },
    onMove: function (event) {
      if (this.mouse.down) {
        if (event.button == 0 || event.touches.length == 1) {
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
              break;
            case "center":
              //setCenter.set(this.mouse.tx, this.mouse.ty);
              break;
            default:
              break;
          }
        } else {
          //cameraControls handle the multitouch
          //this is the way to handl multi-touch events in a way that allows for multitouch fires and not misfires
          //https://stackoverflow.com/questions/45108732/drawing-on-html5-canvas-with-support-for-multitouch-pinch-pan-and-zoom
        }
      }
    },
    onEnd: function () {
      if (this.mouse.multiTouched || this.mouse.eventCancelled) {
        return;
      } else {
        switch (this.selectedTool) {
          case "draw":
            draw.onEnd(this.mirror);
            break;
          case "erase":
            erase.onEnd();
            break;
          case "select":
            select.onEnd(this.mouse.tx, this.mouse.ty);
            break;
          case "center":
            setCenter.set(this.mouse.tx, this.mouse.ty);
            break;
          default:
            break;
        }
      }
      this.mouse.down = false;
      this.mouse.distance = 0;
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