
<template>
  <div class="canvasSettings">
    <span
      v-bind:class="[transformationResetDisabled ? 'disabled ' : '']"
      class="reset-canvas"
      @click="resetTransformation()"
    >
      <img
        src="@/assets/icons/reset.svg"
        alt="Reset canvas position and rotation"
      />
    </span>
    <select name="mode" id="transform-mode" v-model="mode">
      <option value="rotate">Rotate</option>
      <option value="translate">Move</option>
    </select>
  </div>
</template>

<script>
import * as THREE from "three";
import { TransformControls } from "./touchTransformControls.js";
import { scene, renderer, camera, vm } from "../App.vue";
export let canvas, controls;
let position = new THREE.Vector3(0.001, 0.001, 0.001);
let quaternion = new THREE.Quaternion(0.001, 0.002, 0.002, 1);
let scale = new THREE.Vector3(1, 1, 1);

export default {
  name: "Canvas",
  data() {
    return {
      material: new THREE.MeshPhongMaterial({
        color: 0xfefefe,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: 2.5,
        polygonOffsetUnits: -1,
        // wireframe: true,
      }),
      startPosition: new THREE.Vector3(0.001, 0.001, 0.001),
      startQuaternion: new THREE.Quaternion(0.001, 0.001, 0.001, 1),
      startScale: new THREE.Vector3(1, 1, 1),
      transformationResetDisabled: true,
      mode: "rotate",
    };
  },
  props: {
    enabled: String,
  },
  methods: {
    setUp() {
      const geometry = new THREE.PlaneGeometry(5, 5);
      const material = this.material;
      const plane = new THREE.Mesh(geometry, material);
      canvas = plane;
      scene.add(plane);

      controls = new TransformControls(camera, renderer.domElement);
      controls.mode = this.mode;
      // controls.setTranslationSnap(0);
      // controls.setRotationSnap(Math.PI / 10);
      controls.addEventListener("change", () => {
        renderer.render(scene, camera);
        //this is not very elegant but…
        if (vm != undefined) {
          vm.$refs.raycastCanvas.transformationResetDisabled = false;
        }
      });

      controls.attach(plane);
      controls.enabled = this.enabled;
      scene.add(controls);

      canvas.position.set(position.x, position.y, position.z);
      canvas.quaternion.set(
        quaternion.x,
        quaternion.y,
        quaternion.z,
        quaternion.w
      );
      canvas.scale.set(scale.x, scale.y, scale.z);
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
    enabled: function (val) {
      if (val == "canvas") {
        controls.enabled = true;
        this.material.opacity = 0.9;
      } else {
        controls.enabled = false;
        this.material.opacity = 0.3;
      }
      renderer.render(scene, camera);
    },
    mode: function (val) {
      console.log(controls);
      controls.setMode(val);
    },
  },
  mounted() {},
};
</script>

<style>
.canvasSettings {
  z-index: 2;
  position: absolute;
  bottom: 12px;
  left: 12px;
  /* background-color: white;
  filter: drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.08));
  height: 44px;
  border-radius: 8px; */
  font-weight: 900;
  display: flex;
  flex-direction: row;
  gap: 16px;
}

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