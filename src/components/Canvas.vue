
<template>
  <div>
    <button @click="resetTransformation()">Reset</button>
  </div>
</template>

<script>
import * as THREE from "three";
import { TransformControls } from "./touchTransformControls.js";
import { scene, renderer, camera } from "../App.vue";
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
      controls.mode = "rotate";
      controls.setTranslationSnap(0.2);
      controls.setRotationSnap(Math.PI / 10);
      controls.addEventListener("change", () => {
        renderer.render(scene, camera);
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
      this.updatePosition();
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
  },
  mounted() {},
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