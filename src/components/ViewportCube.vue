
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
    <!-- <span class="reset-camera" @click="resetCamera()">↺</span> -->
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
    rotate: function (deltaX, deltaY) {
      let w = 150;
      var PI_2 = Math.PI * 2;
      var speed = 0.5;
      var theta = (PI_2 * speed * deltaX) / w;
      var phi = (PI_2 * speed * deltaY) / w;
      cameraControls.rotate(theta, phi, false);
    },
    evalFaceIndexAndRepositionCamera: function (index) {
      let target = new THREE.Vector3();
      target = cameraControls.getTarget(target);

      let lookAt = function (x, y, z) {
        cameraControls.dampingFactor = 0.5;
        cameraControls.enabled = false;
        cameraControls.setLookAt(x, y, z, target.x, target.y, target.z, true);
        cameraControls.enabled = true;
        setTimeout(() => {
          cameraControls.dampingFactor = 10;
        }, 100);
      };

      switch (index) {
        case 0:
          lookAt(target.x + 10, target.y, target.z);
          break;
        case 1:
          lookAt(target.x + 10, target.y, target.z);
          break;
        case 2:
          lookAt(target.x - 10, target.y, target.z);
          break;
        case 3:
          lookAt(target.x - 10, target.y, target.z);
          break;
        case 4:
          lookAt(target.x, target.y + 10, target.z);
          break;
        case 5:
          lookAt(target.x, target.y + 10, target.z);
          break;
        case 6:
          lookAt(target.x, target.y - 10, target.z);
          break;
        case 7:
          lookAt(target.x, target.y - 10, target.z);
          break;
        case 8:
          lookAt(target.x, target.y, target.z + 10);
          break;
        case 9:
          lookAt(target.x, target.y, target.z + 10);
          break;
        case 10:
          lookAt(target.x, target.y, target.z - 10);
          break;
        case 11:
          lookAt(target.x, target.y, target.z - 10);
          break;
        default:
          console.log(index);
      }
    },
    onTapStart: function () {
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
      document.addEventListener("touchmove", this.handleInput);
      document.addEventListener("touchend", this.handleInput);
    },
    onTapMove: function () {
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
    },
    onTapEnd: function (raycaster) {
      console.log(
        this.mouse.dragStartPosition.distanceTo(this.mouse.lastDragPosition)
      );

      if (
        this.mouse.dragStartPosition.distanceTo(this.mouse.lastDragPosition) < 5
      ) {
        raycaster.setFromCamera(
          new THREE.Vector2(this.mouse.tx, this.mouse.ty),
          viewPortCamera
        );

        try {
          this.evalFaceIndexAndRepositionCamera(
            raycaster.intersectObjects(viewPortScene.children)[0].faceIndex
          );
        } catch (error) {
          //raycaster didn't find anything
        }
      }
      this.mouse.dragStartPosition = new THREE.Vector2();
      this.mouse.lastDragPosition = new THREE.Vector2();
      this.mouse.cx = 0; //x coord for canvas
      this.mouse.cy = 0;
      document.removeEventListener("mousemove", this.handleInput);
      document.removeEventListener("mouseup", this.handleInput);
      document.removeEventListener("touchmove", this.handleInput);
      document.removeEventListener("touchend", this.handleInput);
      this.mouse.down = false;
    },
    handleInput: function (event) {
      this.updateMouseCoordinates(event);
      event.preventDefault();
      let raycaster = new THREE.Raycaster();

      switch (event.type) {
        case "mousedown":
          this.onTapStart();
          break;
        case "touchstart":
          this.onTapStart();
          break;
        case "mousemove":
          this.onTapMove();
          break;
        case "touchmove":
          this.onTapMove();
          break;
        case "touchend":
          console.log("touchend");
          this.onTapEnd(raycaster);
          break;
        case "mouseup":
          console.log("mouseup");
          this.onTapEnd(raycaster);
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
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

#viewportCanvas {
  position: absolute;
  height: 150px;
  width: 150px;
  z-index: 3;
}
</style>