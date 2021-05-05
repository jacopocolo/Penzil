
<template>
  <div class="lineSettings" v-if="selectedTool == 'model'">
    <select name="models" v-model="model">
      <option value="plane">Plane</option>
      <option value="cube">Cube</option>
      <option value="cylinder">Cylinder</option>
      <option value="head">Head</option>
    </select>
    <br />
    <input
      type="checkbox"
      id="snap"
      name="snap"
      value="false"
      v-model="snapToggle"
    />
    <label for="snap"> Snap</label>
    <br />
    <button @click="resetTransformation()">Reset</button>
  </div>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { scene, renderer, camera } from "../App.vue";
import * as colors from "./colors.js";
import { ObjectControls } from "./objectControls.js";
// let canvasTexture = new THREE.TextureLoader().load(
//   require("@/assets/drawingPlane/canvas-texture.png")
// );
export let model;
let helper;
let position = new THREE.Vector3(0.001, 0.001, 0.001);
let quaternion = new THREE.Quaternion(0.001, 0.002, 0.002, 1);
let scale = new THREE.Vector3(1, 1, 1);
let head;
let ot;
const loader = new GLTFLoader();
loader.load("/asaro.gltf", function (gltf) {
  head = gltf.scene.children[0];
});

export default {
  name: "Modal",
  data() {
    return {
      model: "cube",
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
    selectedTool: String,
    opacity: Number,
    enabled: Boolean,
  },
  methods: {
    setUpCube() {
      if (helper) {
        scene.remove(helper);
      }
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
      helper = new THREE.BoxHelper(model, colors.selectedColor);
      scene.add(helper);
      helper.geometry.computeBoundingBox();
      helper.visible = false;
      helper.update();
      this.transformToolbarDisplay(true);

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
      if (helper) {
        scene.remove(helper);
      }
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
      helper = new THREE.BoxHelper(model, new THREE.Color(0x000000));
      scene.add(helper);
      helper.geometry.computeBoundingBox();
      helper.visible = false;
      helper.update();

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
    setUpCylinder() {
      if (helper) {
        scene.remove(helper);
      }
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
      helper = new THREE.BoxHelper(model, colors.selectedColor);
      scene.add(helper);
      helper.geometry.computeBoundingBox();
      helper.visible = false;
      helper.update();
      this.transformToolbarDisplay(true);
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
      renderer.render(scene, camera);
    },
    attachControls() {
      scene.add(helper);
      helper.update();
      this.transformToolbarDisplay(true);
      renderer.render(scene, camera);
    },
    detachControls() {
      this.transformToolbarDisplay(false);
      scene.remove(helper);
      renderer.render(scene, camera);
    },
    transformToolbarDisplay(val) {
      this.$emit("transform-toolbar-display", val);
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
      this.updatePosition();
    },
  },
  watch: {
    model: function (val) {
      this.detachControls();
      switch (val) {
        case "plane":
          scene.remove(model);
          this.setUpPlane();
          this.attachControls();
          break;
        case "cube":
          scene.remove(model);
          this.setUpCube();
          this.attachControls();
          break;
        case "cylinder":
          scene.remove(model);
          this.setUpCylinder();
          this.attachControls();
          break;
        case "head":
          scene.remove(model);
          this.setUpHead();
          this.attachControls();
          break;
        default:
          break;
      }
      this.updatePosition();
    },
    selectedTool: function (val) {
      if (val == "model") {
        this.updatePosition();
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
      if (val == true) {
        ot.enabled = true;
      } else {
        ot.enabled = false;
      }
    },
  },
  mounted() {
    // this.setUpModel();
  },
};
</script>

<style>
.lineSettings {
  z-index: 2;
  position: absolute;
  top: 0;
  right: 10px;
}
</style>