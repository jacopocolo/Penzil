
<template>
  <div class="modelSettings">
    <select name="models" v-model="model">
      <option value="plane">Plane</option>
      <option value="cube">Cube</option>
      <option value="cylinder">Cylinder</option>
      <option value="head">Head</option>
    </select>
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
      <!-- <span
        class="reset-model"
        @click="resetModel()"
        @touchstart="resetModel()"
        v-bind:class="[modelResetDisabled ? 'disabled ' : '']"
        >↺</span
      > -->
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { scene, renderer, camera } from "../App.vue";
import { ObjectControls } from "./objectControls.js";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// let canvasTexture = new THREE.TextureLoader().load(
//   require("@/assets/drawingPlane/canvas-texture.png")
// );
export let model, modelRenderer, modelScene, modelCamera;

let position = new THREE.Vector3(0.001, 0.001, 0.001);
let quaternion = new THREE.Quaternion(0.001, 0.002, 0.002, 1);
let scale = new THREE.Vector3(1, 1, 1);
let ot;

let head;
const loader = new GLTFLoader();
loader.load("/asaro.gltf", function (gltf) {
  head = gltf.scene.children[0];
});

export default {
  name: "Modal",
  data() {
    return {
      model: "plane",
      rotationSnap: null,
      translationSnap: null,
      snapToggle: false,
      material: new THREE.MeshPhongMaterial({
        color: 0xfefefe,
        transparent: true,
        opacity: this.opacity,
        side: THREE.DoubleSide,
        // depthTest: false,
        // depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: 2.5,
        polygonOffsetUnits: -1,
      }),
      startPosition: new THREE.Vector3(0.001, 0.001, 0.001),
      startQuaternion: new THREE.Quaternion(0.001, 0.001, 0.001, 1),
      startScale: new THREE.Vector3(1, 1, 1),
    };
  },
  props: {
    quaternion: Array,
    opacity: Number,
    enabled: String,
  },
  methods: {
    setUpCube() {
      const geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
      const material = this.material;
      const cube = new THREE.Mesh(geometry, material);
      model = cube;
      scene.add(cube);
      model.position.set(position.x, position.y, position.z);
      model.quaternion.set(
        quaternion.x,
        quaternion.y,
        quaternion.z,
        quaternion.w
      );
      model.scale.set(scale.x, scale.y, scale.z);
      let drawingCanvas = document.getElementById("twod");
      ot = new ObjectControls(model, camera, drawingCanvas);
      ot.translateSpeed = 0.2;
      ot.addEventListener(
        "change",
        () => {
          console.log("update");
          ot.update();
          renderer.render(scene, camera);
        },
        false
      );
      ot.update();
      renderer.render(scene, camera);
    },
    setUpPlane() {
      const geometry = new THREE.PlaneGeometry(5, 5, 5);
      const material = this.material;
      const plane = new THREE.Mesh(geometry, material);
      model = plane;
      scene.add(plane);
      model.position.set(position.x, position.y, position.z);
      model.quaternion.set(
        quaternion.x,
        quaternion.y,
        quaternion.z,
        quaternion.w
      );
      model.scale.set(scale.x, scale.y, scale.z);
      let drawingCanvas = document.getElementById("twod");
      ot = new ObjectControls(model, camera, drawingCanvas);
      ot.translateSpeed = 0.2;
      ot.addEventListener(
        "change",
        () => {
          ot.update();
          renderer.render(scene, camera);
          modelScene.children[1].quaternion.copy(ot.object.quaternion);
          modelRenderer.render(modelScene, modelCamera);
        },
        false
      );
      ot.update();
      let modelClone = model.clone();
      modelClone.scale.copy(ot.object.scale).multiplyScalar(0.2);
      modelScene.add(modelClone);
      let om = new ObjectControls(
        modelClone,
        modelCamera,
        modelRenderer.domElement
      );
      om.addEventListener("change", () => {
        om.update();
        model.quaternion.copy(modelClone.quaternion);
        renderer.render(scene, camera);
        modelRenderer.render(modelScene, modelCamera);
      });
      om.update();
      renderer.render(scene, camera);
      modelRenderer.render(modelScene, modelCamera);
    },
    setUpCylinder() {
      const geometry = new THREE.CylinderGeometry(0.5, 0.5, 2.5, 32);
      const material = this.material;
      const cylinder = new THREE.Mesh(geometry, material);
      model = cylinder;
      scene.add(cylinder);
      model.position.set(position.x, position.y, position.z);
      model.quaternion.set(
        quaternion.x,
        quaternion.y,
        quaternion.z,
        quaternion.w
      );
      model.scale.set(scale.x, scale.y, scale.z);
      let drawingCanvas = document.getElementById("twod");
      ot = new ObjectControls(model, camera, drawingCanvas);
      ot.translateSpeed = 0.2;
      ot.addEventListener(
        "change",
        () => {
          console.log("update");
          ot.update();
          renderer.render(scene, camera);
        },
        false
      );
      ot.update();
      renderer.render(scene, camera);
    },
    setUpHead() {
      model = head;
      head.material = this.material;
      scene.add(head);
      model.position.set(position.x, position.y, position.z);
      model.quaternion.set(
        quaternion.x,
        quaternion.y,
        quaternion.z,
        quaternion.w
      );
      model.scale.set(scale.x, scale.y, scale.z);
      let drawingCanvas = document.getElementById("twod");
      ot = new ObjectControls(model, camera, drawingCanvas);
      ot.translateSpeed = 0.2;
      ot.addEventListener(
        "change",
        () => {
          console.log("update");
          ot.update();
          renderer.render(scene, camera);
        },
        false
      );
      ot.update();
      renderer.render(scene, camera);
    },
    setUpModel() {
      this.setUpPlane();
    },
    resetTransformation() {
      model.position.set(
        this.startPosition.x,
        this.startPosition.y,
        this.startPosition.z
      );
      model.quaternion.set(
        this.startQuaternion.x,
        this.startQuaternion.y,
        this.startQuaternion.z,
        this.startQuaternion.w
      );
      model.scale.set(this.startScale.x, this.startScale.y, this.startScale.z);
      renderer.render(scene, camera);
    },
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
      modelCamera.zoom = 10;
      // const controls = new OrbitControls(modelCamera, modelRenderer.domElement);
      // controls.update();
      // controls.addEventListener(
      //   "change",
      //   () => {
      //     modelRenderer.render(modelScene, modelCamera);
      //   },
      //   false
      // );

      modelScene = new THREE.Scene();
      modelScene.name = "modelScene";

      const light = new THREE.HemisphereLight(0xffffff, 0x222222, 1); //0x080820
      light.position.set(0, 1, 5);
      modelScene.add(light);

      // this.addModelCube();
      this.render();
    },
    addModelCube: function () {
      // let right = new THREE.TextureLoader().load(
      //   require("@/assets/viewport/right.png")
      // );
      // let left = new THREE.TextureLoader().load(
      //   require("@/assets/viewport/left.png")
      // );
      // let top = new THREE.TextureLoader().load(
      //   require("@/assets/viewport/top.png")
      // );
      // let bottom = new THREE.TextureLoader().load(
      //   require("@/assets/viewport/bottom.png")
      // );
      // let front = new THREE.TextureLoader().load(
      //   require("@/assets/viewport/front.png")
      // );
      // let back = new THREE.TextureLoader().load(
      //   require("@/assets/viewport/back.png"),
      //   () => {
      //     this.render();
      //   }
      // );

      // const materials = [
      //   new THREE.MeshBasicMaterial({
      //     map: right,
      //   }),
      //   new THREE.MeshBasicMaterial({
      //     map: left,
      //   }),
      //   new THREE.MeshBasicMaterial({
      //     map: top,
      //   }),
      //   new THREE.MeshBasicMaterial({
      //     map: bottom,
      //   }),
      //   new THREE.MeshBasicMaterial({
      //     map: front,
      //   }),
      //   new THREE.MeshBasicMaterial({
      //     map: back,
      //   }),
      // ];

      // const geometry = new THREE.BoxGeometry(1, 1, 1);
      // const cube = new THREE.Mesh(geometry, materials);
      modelScene.add(model);
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
  },
  watch: {
    model: function (val) {
      position.copy(model.position);
      quaternion.copy(model.quaternion);
      scale.copy(model.scale);

      switch (val) {
        case "plane":
          scene.remove(model);
          modelScene.remove(modelScene.children[1]);
          this.setUpPlane();
          break;
        case "cube":
          scene.remove(model);
          modelScene.remove(modelScene.children[1]);
          this.setUpCube();
          break;
        case "cylinder":
          scene.remove(model);
          modelScene.remove(modelScene.children[1]);
          this.setUpCylinder();
          break;
        case "head":
          scene.remove(model);
          modelScene.remove(modelScene.children[1]);
          this.setUpHead();
          break;
        default:
          break;
      }
    },
    opacity: function (val) {
      this.material.opacity = val;
      if (val == 0) {
        this.material.visible = false;
      } else {
        this.material.visible = true;
      }
      renderer.render(scene, camera);
    },
    enabled: function (val) {
      if (val == "canvas") {
        ot.enabled = true;
      } else {
        ot.enabled = false;
      }
    },
    quaternion(val) {
      modelScene.setRotationFromQuaternion(
        new THREE.Quaternion(val[0], val[1], val[2], val[3]).invert()
      );
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
.modelSettings {
  position: absolute;
  height: 150px;
  width: 150px;
  bottom: 10px;
  z-index: 2;
}

#viewportM {
  height: 150px;
  width: 150px;
}

#viewportModel {
  position: absolute;
  height: 150px;
  width: 150px;
  z-index: 3;
  background-color: none;
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