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
import { scene, renderer, camera } from "../App.vue";

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
        //line = new this.draw();
        //line.start();

        this.$emit("new-line", { action: "start" });
      }
    },
    onMove: function (event) {
      if (this.mouse.down && (event.button == 0 || event.touches.length == 1)) {
        this.$emit("move-line", {
          action: "move",
          x: this.mouse.tx,
          y: this.mouse.ty,
          z: 0,
          force: this.mouse.force,
          unproject: true,
        });

        //line.move(this.mouse.tx, this.mouse.ty, 0, this.mouse.force, true);
        renderer.render(scene, camera);
      }
    },
    onEnd: function (event) {
      if (this.mouse.down && (event.button == 0 || event.touches.length == 1)) {
        this.$emit("end-line", { action: "end" });
        //line.end();
        renderer.render(scene, camera);
      }
      this.mouse.down = false;
    },
    handleInput: function (event) {
      this.updateMouseCoordinates(event);

      switch (event.type) {
        case "mousedown":
          this.onStart(event);
          break;
        case "touchstart":
          this.onStart(event);
          break;
        case "mousemove":
          this.onMove(event);
          break;
        case "touchmove":
          this.onMove(event);
          break;
        case "touchend":
          this.onEnd(event);
          break;
        case "mouseup":
          this.onEnd(event);
          break;
        default:
        //nothing;
      }
      // event.preventDefault();
    },
  },
  watch: {
    selectedTool: function (val) {
      console.log(val); //you can just read selectedTool as a regular value now
    },
  },
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