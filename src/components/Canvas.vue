
<template>
  <div class="canvasSettings">
    <span class="canvas-button" @click="toggleShapeSelectionVisibility()">
      <img
        v-if="shape === 'plane'"
        src="@/assets/icons/Canvas-Plane.svg"
        alt="Plane shape selected"
      />
      <img
        v-if="shape === 'sphere'"
        src="@/assets/icons/Canvas-Sphere.svg"
        alt="Sphere shape selected"
      />
      <img
        v-if="shape === 'head'"
        src="@/assets/icons/Canvas-Head.svg"
        alt="Head shape selected"
      />
      <img
        src="@/assets/icons/Dropdown.svg"
        v-bind:style="[
          shapeSelectionVisibility
            ? { transform: 'rotate(180deg)' }
            : { transform: 'rotate(0deg)' },
        ]"
        style="margin-right: 10px"
        alt="Click to show options"
      />
    </span>
    <span
      class="canvas-button"
      @click="toggleControls()"
      v-bind:class="[!visible ? 'disabled' : '']"
    >
      <img
        v-if="transformationEnabled"
        src="@/assets/icons/lockControls.svg"
        alt="Hide the canvas controls"
      />
      <img
        v-if="!transformationEnabled"
        src="@/assets/icons/unlockControls.svg"
        alt="Show the canvas controls"
      />
    </span>
    <span class="canvas-button" @click="toggleVisibility()">
      <img
        v-if="visible"
        src="@/assets/icons/hideCanvas.svg"
        alt="Hide the canvas controls"
      />
      <img
        v-if="!visible"
        src="@/assets/icons/showCanvas.svg"
        alt="Show the canvas controls"
      /> </span
    ><span
      v-bind:class="[transformationResetDisabled ? 'disabled ' : '']"
      class="canvas-button"
      @click="resetTransformation()"
    >
      <img
        src="@/assets/icons/reset.svg"
        alt="Reset canvas position and rotation"
      />
    </span>
    <div class="canvasShapeSelection" v-if="shapeSelectionVisibility">
      <span @click="setCanvasShape('plane')">
        <input
          type="radio"
          id="shapePlane"
          name="shape"
          value="plane"
          v-model="shape"
        /><label for="plane"
          ><img
            src="@/assets/icons/Canvas-Plane.svg"
            alt="Set the 3d canvas shape to plane"
        /></label> </span
      ><span @click="setCanvasShape('sphere')">
        <input
          type="radio"
          id="shapeSphere"
          name="shape"
          value="sphere"
          v-model="shape" /><label for="sphere"
          ><img
            src="@/assets/icons/Canvas-Sphere.svg"
            alt="Set the 3d canvas shape to shphere" /></label></span
      ><span @click="setCanvasShape('head')">
        <input
          type="radio"
          id="shapeHead"
          name="shape"
          value="head"
          v-model="shape"
        /><label for="head"
          ><img
            src="@/assets/icons/Canvas-Head.svg"
            alt="Set the 3d canvas shape to head"
        /></label>
      </span>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import { TransformControls } from "./transformControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { scene, renderer, camera, vm } from "../App.vue";
export let canvas, controls;
// let position = new THREE.Vector3(0.001, 0.001, 0.001);
// let quaternion = new THREE.Quaternion(0.001, 0.002, 0.002, 1);
// let scale = new THREE.Vector3(1, 1, 1);
let geometry = new THREE.PlaneGeometry(5, 5);
let headGeometry;

export default {
  name: "Canvas",
  data() {
    return {
      material: new THREE.MeshToonMaterial({
        color: 0xeeeeee,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: 2.5,
        polygonOffsetUnits: -1,
        emissive: new THREE.Color("rgb(255,255,255)"),
        emissiveIntensity: 0.5,
        // wireframe: true,
      }),
      startPosition: new THREE.Vector3(0.001, 0.001, 0.001),
      startQuaternion: new THREE.Quaternion(0.001, 0.001, 0.001, 1),
      startScale: new THREE.Vector3(1, 1, 1),
      transformationResetDisabled: true,
      transformationEnabled: true,
      visible: true,
      mode: "combined",
      shape: "plane",
      shapeSelectionVisibility: false,
    };
  },
  props: {
    selectedCanvasShape: String,
  },
  methods: {
    setUp() {
      const material = this.material;
      canvas = new THREE.Mesh(geometry, material);
      scene.add(canvas);

      controls = new TransformControls(camera, renderer.domElement);
      controls.mode = "combined";
      controls.scale.set(1.1, 1.1, 1.1);
      controls.addEventListener("change", () => {
        renderer.render(scene, camera);
        //this is not very elegant but…
        if (vm != undefined) {
          vm.$refs.raycastCanvas.transformationResetDisabled = false;
        }
      });
      controls.enabled = true;
      scene.add(controls);
      controls.attach(canvas);
      renderer.render(scene, camera);
    },
    resetTransformation() {
      canvas.position.set(
        this.startPosition.x,
        this.startPosition.y,
        this.startPosition.z
      );
      canvas.quaternion.set(
        this.startQuaternion.x,
        this.startQuaternion.y,
        this.startQuaternion.z,
        this.startQuaternion.w
      );
      canvas.scale.set(this.startScale.x, this.startScale.y, this.startScale.z);
      renderer.render(scene, camera);
      this.transformationResetDisabled = true;
    },
    toggleControls() {
      if (controls.visible === true) {
        this.transformationEnabled = false;
        controls.enabled = false;
        controls.visible = false;
        renderer.render(scene, camera);
      } else {
        this.transformationEnabled = true;
        controls.enabled = true;
        controls.visible = true;
        renderer.render(scene, camera);
      }
    },
    toggleVisibility() {
      if (canvas.visible === true) {
        this.visible = false;
        this.transformationEnabled = false;
        controls.enabled = false;
        controls.visible = false;
        canvas.visible = false;
        renderer.render(scene, camera);
      } else {
        this.transformationEnabled = true;
        this.visible = true;
        controls.enabled = true;
        controls.visible = true;
        canvas.visible = true;
        renderer.render(scene, camera);
      }
    },
    toggleShapeSelectionVisibility() {
      this.shapeSelectionVisibility = !this.shapeSelectionVisibility;
    },
    setCanvasShape(val) {
      this.shape = val;
      this.$emit("selected-canvas-shape", val);
    },
  },
  watch: {
    opacity: function (val) {
      this.material.opacity = val;
      if (val == 0) {
        this.material.visible = false;
      } else {
        this.material.visible = true;
      }
      renderer.render(scene, camera);
    },
    shape: function (val) {
      if (val === "plane") {
        canvas.geometry.dispose();
        canvas.geometry = new THREE.PlaneGeometry(5, 5);
        canvas.geometry.needsUpdate = true;
        renderer.render(scene, camera);
      } else if (val === "sphere") {
        canvas.geometry.dispose();
        canvas.geometry = new THREE.SphereGeometry(2.5, 15, 15);
        canvas.geometry.needsUpdate = true;
        renderer.render(scene, camera);
      } else if (val === "head") {
        if (headGeometry === undefined) {
          const loader = new GLTFLoader();
          loader.load("/asaro.glb", function (gltf) {
            headGeometry = gltf.scene.children[0].geometry;
            canvas.geometry.dispose();
            canvas.geometry = headGeometry;
            canvas.geometry.needsUpdate = true;
            renderer.render(scene, camera);
          });
        } else {
          canvas.geometry.dispose();
          canvas.geometry = headGeometry;
          canvas.geometry.needsUpdate = true;
          renderer.render(scene, camera);
        }
      }
    },
  },
  mounted() {
    this.setCanvasShape("plane");
  },
};
</script>

<style scoped>
.canvasSettings {
  z-index: 2;
  position: absolute;
  top: 12px;
  left: 12px;
  /* background-color: white;
  filter: drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.08));
  height: 44px;
  border-radius: 8px; */
  font-weight: 900;
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.canvasShapeSelection {
  font-size: 0.5em;
  color: #1c1c1e;
  white-space: discard;
  display: flex;
  flex-direction: column;
  filter: drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.08));
  border-radius: 8px;
  overflow: hidden;
  position: absolute;
  top: calc(44px + 8px + 8px);
  width: 60px;
}

.canvasShapeSelection > span > label {
  display: flex;
  flex-direction: row;
  /* width: 100px; */
  /* align-items: center; */
  align-items: initial;
}

/* .canvasShapeSelection > span > label > span {
  flex-grow: 1;
} */

/* .canvasShapeSelection > span > label {
  min-width: 200px;
} */

/* #shapeSphere > img {
  left: 0;
  margin-left: 12px;
} */

.reset-canvas {
  height: 44px;
  width: 44px;
  border-radius: 22px;
  background-color: rgba(255, 255, 255, 1);
  font-size: 2em;
  line-height: 1em;
  color: rgba(255, 255, 255, 1);
  opacity: 1;
  justify-content: center;
  align-content: center;
  text-align: center;
  z-index: 2;
  filter: drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.08));
}

.canvas-button {
  height: 44px;
  width: 44px;
  border-radius: 22px;
  background-color: rgba(255, 255, 255, 1);
  font-size: 2em;
  line-height: 1em;
  color: rgba(255, 255, 255, 1);
  opacity: 1;
  justify-content: center;
  align-content: center;
  text-align: center;
  z-index: 2;
  filter: drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.08));
  display: flex;
  align-items: center;
  width: auto;
}

#transform-mode {
  background-color: white;
  border: none;
  padding: 8px;
  border-radius: 8px;
  font-weight: 900;
  filter: drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.08));
}

@media (pointer: coarse) {
  #transform-mode {
    display: none;
  }
}
</style>