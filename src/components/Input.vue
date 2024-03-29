<template>
  <div
    @touchstart="handleInput"
    @touchmove="handleInput"
    @touchend="handleInput"
    @mousedown="handleInput"
    @mousemove="handleInput"
    @mouseup="handleInput"
    id="threed"
  >
    <span v-if="displayTouches">
      <svg
        v-for="item in touches"
        :key="item.clientX"
        class="cursor"
        :style="{
          top: item.clientY - 52 / 2 + 'px',
          left: item.clientX - 52 / 2 + 'px',
        }"
        width="52"
        height="52"
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="26" cy="24" r="22" fill="url(#paint0_radial)" />
        <g filter="url(#filter0_d)">
          <circle
            cx="26"
            cy="24"
            r="22"
            stroke="white"
            stroke-opacity="0.38"
            stroke-width="0.5"
          />
        </g>
        <defs>
          <filter
            id="filter0_d"
            x="0.75"
            y="0.75"
            width="50.5"
            height="50.5"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="1.5" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow"
              result="shape"
            />
          </filter>
          <radialGradient
            id="paint0_radial"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(26 24) rotate(90) scale(22)"
          >
            <stop stop-color="white" stop-opacity="0" />
            <stop offset="1" stop-color="white" stop-opacity="0.42" />
          </radialGradient>
        </defs></svg
    ></span>
  </div>
</template>

<script>
import { draw } from "./draw.js";
import { erase } from "./erase.js";
import { select } from "./select.js";

import * as THREE from "three";
import { canvas, controls } from "./Canvas.vue";
import { renderer, scene, camera } from "../App.vue";

export default {
  name: "Input",
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
      displayTouches: false,
      touches: [],
      movingCanvas: false,
    };
  },
  props: {
    selectedTool: String,
    toolEnabled: Boolean,
    mirror: [Boolean, String],
    stroke: [Object],
    fill: [Object],
  },
  emits: ["mouse-coordinates"],
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
      if ((event.button && event.button != 0) || this.toolEnabled === false) {
        return;
      }

      this.touches = [];
      //this is just to display the touches event
      if (event.touches?.length > 0 && this.displayTouches == true) {
        for (let i = 0; i < event.touches.length; i++) {
          this.touches.push(event.touches[i]);
        }
      }

      if (
        event.button == 0 ||
        event.touches.length == 1 ||
        event.touches.force > 0
      ) {
        this.mouse.down = true;
        this.mouse.eventCancelled = false;
        this.mouse.multiTouched = false;
        let raycaster;
        switch (this.selectedTool) {
          case "draw":
            raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(
              new THREE.Vector2(this.mouse.tx, this.mouse.ty),
              camera
            );
            if (
              (controls.mode === "combined" &&
                raycaster.intersectObjects(
                  controls.children[0].children[10].children
                )[0] !== undefined &&
                controls.enabled === true) ||
              (controls.mode === "scale" &&
                raycaster.intersectObjects(
                  controls.children[0].children[5].children
                )[0] !== undefined &&
                controls.enabled === true)
            ) {
              this.movingCanvas = true;
              return;
            } else {
              if (
                controls.enabled === true &&
                raycaster.intersectObjects([canvas])[0] !== undefined
              ) {
                controls.visible = false;
                renderer.render(scene, camera);
              }

              draw.onStart(
                this.mouse.tx,
                this.mouse.ty,
                0,
                this.mouse.force,
                true,
                this.mirror,
                this.stroke,
                this.fill
              );
            }
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
            default:
              break;
          }
        }
      }
    },
    onMove: function (event) {
      if ((event.button && event.button != 0) || this.toolEnabled === false)
        return;

      this.touches = [];
      if (event.touches?.length > 0 && this.displayTouches == true) {
        for (let i = 0; i < event.touches.length; i++) {
          this.touches.push(event.touches[i]);
        }
      }

      if (this.mouse.down) {
        if (event.button == 0 || event.touches.length == 1) {
          switch (this.selectedTool) {
            case "draw":
              if (this.movingCanvas === false) {
                draw.onMove(
                  this.mouse.tx,
                  this.mouse.ty,
                  0,
                  this.mouse.force,
                  true
                );
              } else {
                return;
              }
              break;
            case "erase":
              erase.onMove(this.mouse.cx, this.mouse.cy);
              break;
            case "select":
              select.onMove(this.mouse.cx, this.mouse.cy);
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
    onEnd: function (event) {
      if (this.toolEnabled === false) return;
      this.touches = [];

      if (event.button && event.button != 0) return;

      if (this.mouse.multiTouched || this.mouse.eventCancelled) {
        if (controls.enabled === true && canvas.visible === true) {
          controls.visible = true;
          renderer.render(scene, camera);
        }
        return;
      } else {
        switch (this.selectedTool) {
          case "draw":
            if (this.movingCanvas === true) {
              this.movingCanvas = false;
            } else {
              draw.onEnd(this.mirror);
              if (controls.enabled === true && canvas.visible === true) {
                controls.visible = true;
                renderer.render(scene, camera);
              }
            }
            break;
          case "erase":
            erase.onEnd();
            break;
          case "select":
            select.onEnd(this.mouse.tx, this.mouse.ty);
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
          if (this.toolEnabled === false) {
            this.$emit("mouse-coordinates", {
              x: this.mouse.tx,
              y: this.mouse.ty,
            });
          }
          this.onEnd(event);
          break;
        case "mousedown":
          this.onStart(event);
          break;
        case "mousemove":
          this.onMove(event);
          break;
        case "mouseup":
          if (this.toolEnabled === false) {
            this.$emit("mouse-coordinates", {
              x: this.mouse.tx,
              y: this.mouse.ty,
            });
          }
          this.onEnd(event);
          break;
        default:
        //nothing;
      }
    },
  },
  watch: {},
  mounted() {
    if (window.location.hash) {
      var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
      if (hash === "displayTouches") {
        this.displayTouches = true;
      }
    }
  },
};
</script>

<style>
#container {
  height: 100%;
  width: 100%;
}

.cursor {
  position: absolute;
  z-index: 6;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  touch-action: none;
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