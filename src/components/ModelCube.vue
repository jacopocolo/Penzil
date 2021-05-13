
<template>
  <div
    @touchstart="handleInput"
    @touchmove="handleInput"
    @touchend="handleInput"
    @mousedown="handleInput"
    @mousemove="handleInput"
    @mouseup="handleInput"
    id="viewportM"
  >
    <canvas id="viewportModel"></canvas>
    <span
      class="reset-model"
      @click="resetModel()"
      @touchstart="resetModel()"
      v-bind:class="[modelResetDisabled ? 'disabled ' : '']"
      >↺</span
    >
  </div>
</template>

<script>
import * as THREE from "three";

let modelRenderer, modelScene, modelCamera;

export default {
  name: "ViewportCube",
  props: { modelResetDisabled: Boolean },
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
      modelRenderer.render(modelScene, modelCamera);
    },
    init: function () {
      modelRenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas: document.getElementById("viewportModel"),
      });
      modelRenderer.setPixelRatio(window.devicePixelRatio);
      modelRenderer.setSize(150, 150);

      modelCamera = new THREE.OrthographicCamera();
      modelCamera.position.set(0, 0, 10);
      modelCamera.zoom = 160;

      modelScene = new THREE.Scene();

      this.addModelCube();
      this.render();
    },
    addModelCube: function () {
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
      modelScene.add(cube);
    },
    rotate: function (deltaX, deltaY) {
      let w = 150;
      var PI_2 = Math.PI * 2;
      var speed = 0.5;
      var theta = (PI_2 * speed * deltaX) / w;
      var phi = (PI_2 * speed * deltaY) / w;
      console.log(theta, phi);
      //   cameraControls.rotate(theta, phi, false);
    },
    evalFaceIndexAndRepositionModel: function (index) {
      //This is a slight hack to allow the triangulate function that generates the fill to work in any scenario. See: https://github.com/mapbox/earcut/issues/21
      //   let adj = 0.0001;

      console.log(index);

      //   switch (index) {
      //     case 0:
      //       break;
      //     case 1:
      //       break;
      //     case 2:
      //       break;
      //     case 3:
      //       break;
      //     case 4:
      //       break;
      //     case 5:
      //       break;
      //     case 6:
      //       break;
      //     case 7:
      //       break;
      //     case 8:
      //       break;
      //     case 9:
      //       break;
      //     case 10:
      //       break;
      //     case 11:
      //       break;
      //     default:
      //       console.log(index);
      //   }
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
          modelCamera
        );

        try {
          this.evalFaceIndexAndRepositionCamera(
            raycaster.intersectObjects(modelScene.children)[0].faceIndex
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
    resetModel: function () {
      console.log("model");
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
      console.log(val);
      this.render();
    },
  },
  mounted() {
    this.init();
    this.render();
  },
};
</script>

<style>
#viewportM {
  position: absolute;
  height: 150px;
  width: 150px;
  bottom: 0;
  z-index: 2;
}

#viewportModel {
  position: absolute;
  height: 150px;
  width: 150px;
  z-index: 3;
  background-color: black;
}

.reset-camera {
  height: 32px;
  width: 32px;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.2);
  font-size: 2em;
  line-height: 1em;
  position: absolute;
  color: rgba(255, 255, 255, 1);
  opacity: 1;
  bottom: 8px;
  right: 8px;
  justify-content: center;
  align-content: center;
  text-align: center;
  z-index: 4;
}
</style>