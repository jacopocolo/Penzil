
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
    <span
      class="reset-camera"
      @click="resetCamera()"
      @touchstart="resetCamera()"
      v-bind:class="[cameraResetDisabled ? 'disabled ' : '']"
      ><img src="@/assets/icons/reset.svg" alt="Reset camera position and zoom"
    /></span>
  </div>
</template>

<script>
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { cameraControls } from "../App.vue";

let viewPortRenderer, viewPortScene, viewPortCamera;

export default {
  name: "ViewportCube",
  props: {
    quaternion: Array,
    cameraResetDisabled: Boolean,
    cameraControlsEnabled: String,
  },
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
      //This is a slight hack to allow the triangulate function that generates the fill to work in any scenario. See: https://github.com/mapbox/earcut/issues/21
      let adj = 0.0001;

      let lookAt = function (x, y, z) {
        cameraControls.dampingFactor = 0.5;
        cameraControls.enabled = false;
        cameraControls.setLookAt(x, y, z, target.x, target.y, target.z, true);
        cameraControls.enabled =
          this.cameraControlsEnabled === "camera" ? true : false;
        setTimeout(() => {
          cameraControls.dampingFactor = 10;
        }, 100);
        cameraControls.update();
      };

      switch (index) {
        case 0:
          lookAt(target.x + 10, target.y + adj, target.z + adj);
          break;
        case 1:
          lookAt(target.x + 10, target.y + adj, target.z + adj);
          break;
        case 2:
          lookAt(target.x - 10, target.y + adj, target.z + adj);
          break;
        case 3:
          lookAt(target.x - 10, target.y + adj, target.z + adj);
          break;
        case 4:
          lookAt(target.x, target.y + 10, target.z + adj);
          break;
        case 5:
          lookAt(target.x, target.y + 10, target.z + adj);
          break;
        case 6:
          lookAt(target.x, target.y - 10, target.z + adj);
          break;
        case 7:
          lookAt(target.x, target.y - 10, target.z + adj);
          break;
        case 8:
          lookAt(target.x + adj, target.y, target.z + 10);
          break;
        case 9:
          lookAt(target.x + adj, target.y, target.z + 10);
          break;
        case 10:
          lookAt(target.x + adj, target.y, target.z - 10);
          break;
        case 11:
          lookAt(target.x + adj, target.y, target.z - 10);
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
    resetCamera: function () {
      cameraControls.dampingFactor = 0.5;
      cameraControls.enabled = false;
      cameraControls.setLookAt(0, 0, 10, 0, 0, 0, true);
      cameraControls.zoomTo(3, true);
      cameraControls.enabled =
        this.cameraControlsEnabled === "camera" ? true : false;
      setTimeout(() => {
        cameraControls.dampingFactor = 20;
      }, 100);
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
          this.onTapEnd(raycaster);
          break;
        case "mouseup":
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
    cameraControlsEnabled: function (val) {
      console.log(val);
    },
  },
  mounted() {
    this.init();
    this.render();
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
}

#viewportCanvas {
  position: absolute;
  height: 150px;
  width: 150px;
  z-index: 3;
  background-color: rgba(0, 0, 0, 0);
}

.reset-camera {
  height: 44px;
  width: 44px;
  border-radius: 22px;
  background-color: rgba(255, 255, 255, 1);
  font-size: 2em;
  line-height: 1em;
  position: absolute;
  color: rgba(255, 255, 255, 1);
  opacity: 1;
  bottom: 0px;
  right: 0px;
  justify-content: center;
  align-content: center;
  text-align: center;
  z-index: 4;
  filter: drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.08));
}
</style>