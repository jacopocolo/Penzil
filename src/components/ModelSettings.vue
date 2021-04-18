
<template>
  <div class="lineSettings" v-if="selectedTool == 'model'">
    <select name="models" v-model="model">
      <option value="plane">Plane</option>
      <option value="cube">Cube</option>
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
import { scene, renderer, camera, vm } from "../App.vue";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import * as colors from "./colors.js";
// let canvasTexture = new THREE.TextureLoader().load(
//   require("@/assets/drawingPlane/canvas-texture.png")
// );
export let model;
let controls;
let helper;
let position = new THREE.Vector3(0.001, 0.001, 0.001);
let quaternion = new THREE.Quaternion(0.001, 0.002, 0.002, 1);
let scale = new THREE.Vector3(1, 1, 1);
let head;
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
        opacity: 0.95,
        side: THREE.DoubleSide,
        // polygonOffset: true,
        // polygonOffsetFactor: 15,
        // polygonOffsetUnits: -1,
      }),
      startPosition: new THREE.Vector3(0.001, 0.001, 0.001),
      startQuaternion: new THREE.Quaternion(0.001, 0.001, 0.001, 1),
      startScale: new THREE.Vector3(1, 1, 1),
    };
  },
  props: {
    selectedTool: String,
  },
  methods: {
    setUpCube() {
      if (helper) {
        scene.remove(helper);
      }
      const geometry = new THREE.BoxGeometry(1, 1, 1);
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
      scene.add(controls);
      helper = new THREE.BoxHelper(model, colors.selectedColor);
      scene.add(helper);
      helper.geometry.computeBoundingBox();
      helper.visible = false;
      helper.update();
      this.transformToolbarDisplay(true);
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
      controls.attach(model);
      scene.add(controls);
      helper = new THREE.BoxHelper(model, new THREE.Color(0x000000));
      scene.add(helper);
      helper.geometry.computeBoundingBox();
      helper.visible = false;
      helper.update();
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
      controls.attach(model);
      scene.add(controls);
      renderer.render(scene, camera);
    },
    attachControls() {
      controls.attach(model);
      scene.add(helper);
      helper.update();
      this.transformToolbarDisplay(true);
      renderer.render(scene, camera);
    },
    detachControls() {
      this.transformToolbarDisplay(false);
      controls.detach();
      scene.remove(helper);
      renderer.render(scene, camera);
    },
    transformToolbarDisplay(val) {
      this.$emit("transform-toolbar-display", val);
    },
    setUpModel() {
      controls = new TransformControls(camera, document.getElementById("app"));
      controls.name = "canvasTransformControls";
      controls.setRotationSnap(this.rotationSnap);
      controls.setTranslationSnap(this.translationSnap);
      controls.addEventListener("change", function () {
        renderer.render(scene, camera);
      });
      controls.addEventListener("objectChange", function () {
        helper.update();
        renderer.render(scene, camera);
        function calculateTransfromToolbarPosition(controls) {
          if (controls.object == undefined) {
            return;
          }

          //find the center
          let position = helper.geometry.boundingSphere.center;
          position = position.project(camera);

          //find the min and max vertical distance
          let buffArray = helper.geometry.attributes.position.array;
          let vectors = [];
          for (let i = 0; i < buffArray.length; i = i + 3) {
            vectors.push(new THREE.Vector3().fromArray(buffArray, i));
          }
          let vectorsY = [];
          vectors.forEach((v) => {
            v.project(camera);
            let y = (-(v.y - 1) * window.innerHeight) / 2;
            vectorsY.push(y);
          });
          let minY = Math.min(...vectorsY);
          let maxY = Math.max(...vectorsY);

          let location;

          if (controls.children[0].gizmo.translate.children[5].visible) {
            position.y = maxY;
            location = "below";
          } else {
            position.y = minY;
            location = "above";
          }

          return {
            x: ((position.x + 1) * window.innerWidth) / 2,
            y: position.y,
            location: location,
          };
        }
        let transfromToolbarPosition = calculateTransfromToolbarPosition(this);
        vm.$.ctx.setTransformToolbarPosition({
          left: transfromToolbarPosition.x,
          top: transfromToolbarPosition.y,
          location: transfromToolbarPosition.location,
        });
      });
      controls.addEventListener("mouseUp", function () {
        helper.update();
        var endPosition = new THREE.Vector3();
        controls.object.getWorldPosition(endPosition);
        var endQuaternion = new THREE.Quaternion();
        controls.object.getWorldQuaternion(endQuaternion);
        var endScale = new THREE.Vector3();
        controls.object.getWorldScale(endScale);
        position = endPosition;
        quaternion = endQuaternion;
        scale = endScale;
      });
      this.setUpCube();
    },
    updatePosition() {
      helper.update();
      function calculateTransfromToolbarPosition(controls) {
        if (controls.object == undefined) {
          return;
        }

        //find the center
        let position = helper.geometry.boundingSphere.center;
        position = position.project(camera);

        //find the min and max vertical distance
        let buffArray = helper.geometry.attributes.position.array;
        let vectors = [];
        for (let i = 0; i < buffArray.length; i = i + 3) {
          vectors.push(new THREE.Vector3().fromArray(buffArray, i));
        }
        let vectorsY = [];
        vectors.forEach((v) => {
          v.project(camera);
          let y = (-(v.y - 1) * window.innerHeight) / 2;
          vectorsY.push(y);
        });
        let minY = Math.min(...vectorsY);
        let maxY = Math.max(...vectorsY);

        let location;

        if (controls.children[0].gizmo.translate.children[5].visible) {
          position.y = maxY;
          location = "below";
        } else {
          position.y = minY;
          location = "above";
        }

        return {
          x: ((position.x + 1) * window.innerWidth) / 2,
          y: position.y,
          location: location,
        };
      }
      let transfromToolbarPosition = calculateTransfromToolbarPosition(
        controls
      );
      this.$emit("toolbar-position", {
        left: transfromToolbarPosition.x,
        top: transfromToolbarPosition.y,
        location: transfromToolbarPosition.location,
      });
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
    snapToggle: function (val) {
      if (val) {
        controls.setRotationSnap((30 * Math.PI) / 180);
        controls.setTranslationSnap(1);
      } else {
        controls.setRotationSnap(null);
        controls.setTranslationSnap(null);
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