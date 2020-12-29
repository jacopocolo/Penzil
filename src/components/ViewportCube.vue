
<template>
  <div
    @touchstart="handleInput"
    @touchmove="handleInput"
    @touchend="handleInput"
    @mousedown="handleInput"
    @mousemove="handleInput"
    @mouseup="handleInput"
    id="viewport"
  >
    <canvas id="viewportCanvas"></canvas>
    <!-- <span
      class="reset-camera"
      @click="resetCamera()"
      v-bind:class="[ui.resetDisabled ? 'disabled ' : '']"
      >↺</span
    > -->
  </div>
</template>

<script>
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { cameraControls } from "../App.vue";

let viewPortRenderer, viewPortScene, viewPortCamera;

export default {
  name: "ViewportCube",
  props: { quaternion: Array },
  data() {
    return {
      mouse: {
        down: false,
        tx: 0, //x coord for threejs
        ty: 0, //y coord for threejs
        cx: 0, //x coord for canvas
        cy: 0, //y coord for canvas
        dragStartPosition: new THREE.Vector2(),
        lastDragPosition: new THREE.Vector2(),
        force: 0,
      },
    };
  },
  methods: {
    updateMouseCoordinates: function (event) {
      if (event.touches) {
        this.mouse.tx = (event.changedTouches[0].pageX / 150) * 2 - 1;
        this.mouse.ty = -(event.changedTouches[0].pageY / 150) * 2 + 1;
        this.mouse.cx = event.changedTouches[0].pageX;
        this.mouse.cy = event.changedTouches[0].pageY;

        if (event.touches[0] && event.touches[0]["force"] !== undefined) {
          this.mouse.force = event.touches[0]["force"];
        } else {
          this.mouse.force = 0;
        }
      } else {
        if (event.button == 0) {
          this.mouse.tx = (event.clientX / 150) * 2 - 1;
          this.mouse.ty = -(event.clientY / 150) * 2 + 1;
          this.mouse.cx = event.clientX;
          this.mouse.cy = event.clientY;
        }
      }
    },
    render: function () {
      viewPortRenderer.render(viewPortScene, viewPortCamera);
    },
    init: function () {
      viewPortRenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas: document.getElementById("viewportCanvas"),
      });
      viewPortRenderer.setPixelRatio(window.devicePixelRatio);
      viewPortRenderer.setSize(150, 150);

      viewPortCamera = new THREE.OrthographicCamera();
      viewPortCamera.position.set(0, 0, 10);
      viewPortCamera.zoom = 160;

      viewPortScene = new THREE.Scene();

      this.addViewPortCube();

      // viewPortControls = new OrbitControls(camera, viewPortRenderer.domElement);
      // viewPortControls.rotateSpeed = 0.4;
      // viewPortControls.enableZoom = false;
      // viewPortControls.enablePan = false;
      // viewPortControls.saveState();
      // viewPortControls.addEventListener("change", () => {
      //   this.$emit("viewport-camera-update", "update");
      // });

      this.render();
    },
    addViewPortCube: function () {
      let right = new THREE.TextureLoader().load(
        require("@/assets/viewport/right.png")
      );
      let left = new THREE.TextureLoader().load(
        require("@/assets/viewport/left.png")
      );
      let top = new THREE.TextureLoader().load(
        require("@/assets/viewport/top.png")
      );
      let bottom = new THREE.TextureLoader().load(
        require("@/assets/viewport/bottom.png")
      );
      let front = new THREE.TextureLoader().load(
        require("@/assets/viewport/front.png")
      );
      let back = new THREE.TextureLoader().load(
        require("@/assets/viewport/back.png"),
        () => {
          this.render();
        }
      );

      const materials = [
        new THREE.MeshBasicMaterial({
          map: right,
        }),
        new THREE.MeshBasicMaterial({
          map: left,
        }),
        new THREE.MeshBasicMaterial({
          map: top,
        }),
        new THREE.MeshBasicMaterial({
          map: bottom,
        }),
        new THREE.MeshBasicMaterial({
          map: front,
        }),
        new THREE.MeshBasicMaterial({
          map: back,
        }),
      ];

      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const cube = new THREE.Mesh(geometry, materials);
      viewPortScene.add(cube);

      // viewPortRenderer.domElement.addEventListener(
      //   "mousedown",
      //   () => {
      //     directControls.enabled = false;
      //   },
      //   false
      // );
      // viewPortRenderer.domElement.addEventListener(
      //   "touchstart",
      //   () => {
      //     directControls.enabled = false;
      //   },
      //   false
      // );

      // viewPortRenderer.domElement.addEventListener(
      //   "mousemove",
      //   (e) => {
      //     if (directControls.enabled == false) {
      //       console.log(e.movementX, e.movementY);
      //       miniAxisMouse.moved = true;
      //     }
      //   },
      //   false
      // );
      // viewPortRenderer.domElement.addEventListener(
      //   "touchmove",
      //   () => {
      //     if (directControls.enabled == false) {
      //       miniAxisMouse.moved = true;
      //     }
      //   },
      //   false
      // );

      // viewPortRenderer.domElement.addEventListener(
      //   "mouseup",
      //   (event) => {
      //     directControls.enabled = true;
      //     console.log(miniAxisMouse.moved);
      //     if (miniAxisMouse.moved == true) {
      //       directControls.setLookAt(
      //         camera.position.x,
      //         camera.position.y,
      //         camera.position.z,
      //         controls.target.x,
      //         controls.target.y,
      //         controls.target.z,
      //         false
      //       );
      //     } else {
      //       repositionCamera(event);
      //     }
      //     miniAxisMouse.moved = false;
      //   },
      //   false
      // );
      // viewPortRenderer.domElement.addEventListener(
      //   "touchend",
      //   (event) => {
      //     directControls.enabled = true;
      //     if (miniAxisMouse.moved == true) {
      //       directControls.setLookAt(
      //         camera.position.x,
      //         camera.position.y,
      //         camera.position.z,
      //         controls.target.x,
      //         controls.target.y,
      //         controls.target.z,
      //         false
      //       );
      //     } else {
      //       repositionCamera(event);
      //     }
      //     miniAxisMouse.moved = false;
      //   },
      //   false
      // );
    },
    eventHandling: function () {
      // viewPortControls.addEventListener("start", () => {
      //   console.log("start");
      //   this.$emit("viewport-camera-update", "start");
      // });
      // viewPortControls.addEventListener("change", () => {
      //   this.$emit("viewport-camera-update", "updated");
      // });
      // viewPortControls.addEventListener("end", () => {
      //   console.log("stop");
      //   this.$emit("viewport-camera-update", "end");
      // });
    },
    rotate: function (deltaX, deltaY) {
      let w = 150;
      var PI_2 = Math.PI * 2;
      var speed = 0.5;
      var theta = (PI_2 * speed * deltaX) / w;
      var phi = (PI_2 * speed * deltaY) / w;
      cameraControls.rotate(theta, phi, false);
    },
    evalFaceIndex: function (index) {
      switch (index) {
        case 0:
          console.log("Right");
          break;
        case 1:
          console.log("Right");
          break;
        case 2:
          console.log("Left");
          break;
        case 3:
          console.log("Left");
          break;
        case 4:
          console.log("Top");
          break;
        case 5:
          console.log("Top");
          break;
        case 6:
          console.log("Bottom");
          break;
        case 7:
          console.log("Bottom");
          break;
        case 8:
          console.log("Front");
          break;
        case 9:
          console.log("Front");
          break;
        case 10:
          console.log("Back");
          break;
        case 11:
          console.log("Back");
          break;
        default:
          console.log(index);
      }
    },
    handleInput: function (event) {
      //event.preventDefault();
      this.updateMouseCoordinates(event);
      let raycaster = new THREE.Raycaster();

      switch (event.type) {
        case "mousedown":
          raycaster.setFromCamera(
            new THREE.Vector2(this.mouse.tx, this.mouse.ty),
            viewPortCamera
          );

          try {
            this.evalFaceIndex(
              raycaster.intersectObjects(viewPortScene.children)[0].faceIndex
            );
          } catch (error) {
            //raycaster didn't find anything
          }

          this.mouse.down = true;
          this.mouse.dragStartPosition = new THREE.Vector2(
            this.mouse.cx,
            this.mouse.cy
          );
          this.mouse.lastDragPosition = new THREE.Vector2(
            this.mouse.cx,
            this.mouse.cy
          );
          document.addEventListener("mousemove", this.handleInput);
          document.addEventListener("mouseup", this.handleInput);
          break;
        case "touchstart":
          //this.mouse.down = true;
          break;
        case "mousemove":
          if (this.mouse.down) {
            this.rotate(
              this.mouse.lastDragPosition.x - this.mouse.cx,
              this.mouse.lastDragPosition.y - this.mouse.cy
            );
            this.mouse.lastDragPosition = new THREE.Vector2(
              this.mouse.cx,
              this.mouse.cy
            );
          }
          break;
        case "touchmove":
          //
          break;
        case "touchend":
          //
          break;
        case "mouseup":
          //
          this.mouse.dragStartPosition = new THREE.Vector2();
          this.mouse.lastDragPosition = new THREE.Vector2();
          this.mouse.cx = 0; //x coord for canvas
          this.mouse.cy = 0;
          document.removeEventListener("mousemove", this.handleInput);
          document.removeEventListener("mouseup", this.handleInput);
          this.mouse.down = false;
          break;
        default:
        //nothing;
      }
    },
  },
  watch: {
    quaternion: function (val) {
      viewPortScene.setRotationFromQuaternion(
        new THREE.Quaternion(val[0], val[1], val[2], val[3]).invert()
      );
      this.render();
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style>
#viewport {
  position: absolute;
  height: 150px;
  width: 150px;
  top: 0;
  z-index: 2;
  background-color: black;
}

#viewportCanvas {
  position: absolute;
  height: 150px;
  width: 150px;
  z-index: 3;
}
</style>