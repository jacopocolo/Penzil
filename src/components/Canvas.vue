
<template>
  <div
    class="canvasSettings"
    v-bind:style="[
      shapeSelectionVisibility === true ? 'z-index: 10' : '',
      selectedTool != 'draw' ? 'display: none' : '',
    ]"
  >
    <span
      class="canvas-button"
      id="canvasShapeDropdown"
      @click="toggleShapeSelectionVisibility()"
      v-bind:class="[!visible ? 'disabled' : '']"
    >
      <span class="icon-and-label" v-if="shape === 'plane'"
        ><img
          src="@/assets/icons/Canvas-Plane.svg"
          alt="Plane shape selected"
        />Plane</span
      >
      <span class="icon-and-label" v-if="shape === 'cube'"
        ><img
          src="@/assets/icons/Canvas-Cube.svg"
          alt="Cube shape selected"
        />Cube</span
      >
      <span class="icon-and-label" v-if="shape === 'cylinder'"
        ><img
          src="@/assets/icons/Canvas-Cylinder.svg"
          alt="Cylinder shape selected"
        />Cylinder</span
      >
      <span class="icon-and-label" v-if="shape === 'sphere'"
        ><img
          src="@/assets/icons/Canvas-Sphere.svg"
          alt="Sphere shape selected"
        />Sphere</span
      >
      <span class="icon-and-label" v-if="shape === 'head'">
        <img
          src="@/assets/icons/Canvas-Head.svg"
          alt="Head shape selected"
        />Head</span
      >
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
      class="canvas-button transform-mode"
      @click="toggleTransformMode()"
      v-bind:class="[!visible ? 'disabled' : '']"
      v-if="!shapeSelectionVisibility"
    >
      <span
        class="icon-and-label"
        v-bind:class="[mode === 'combined' ? 'active' : '']"
      >
        <img src="@/assets/icons/translate.svg" alt="Switch to scale" />
        <span v-if="mode === 'combined'">Move</span>
      </span>
      <span
        class="icon-and-label"
        v-bind:class="[mode === 'scale' ? 'active' : '']"
        ><img
          src="@/assets/icons/scale.svg"
          alt="Switch to move and rotate"
        /><span v-if="mode === 'scale'">Scale</span></span
      ></span
    >
    <span
      class="canvas-button"
      @click="toggleControls()"
      v-bind:class="[
        !visible ? 'disabled' : '',
        !transformationEnabled ? 'active' : '',
      ]"
      v-if="!shapeSelectionVisibility"
      ><span
        v-bind:class="[transformationEnabled ? '' : 'hidden']"
        class="icon-and-label"
        ><img
          src="@/assets/icons/lockControls.svg"
          alt="Hide the canvas controls"
        />Unlocked</span
      >
      <span
        v-bind:class="[!transformationEnabled ? '' : 'hidden']"
        class="icon-and-label"
        ><img
          src="@/assets/icons/unlockControls.svg"
          alt="Show the canvas controls"
        />Locked</span
      >
    </span>
    <span
      class="canvas-button"
      @click="toggleVisibility()"
      v-if="!shapeSelectionVisibility"
      v-bind:class="[!visible ? 'active' : '']"
    >
      <span v-if="visible" class="icon-and-label"
        ><img
          src="@/assets/icons/hideCanvas.svg"
          alt="Hide the canvas controls"
        />Visible</span
      >
      <span v-bind:class="[!visible ? '' : 'hidden']" class="icon-and-label"
        ><img
          src="@/assets/icons/showCanvas.svg"
          alt="Show the canvas controls"
        />Hidden</span
      ></span
    >
    <span
      class="canvas-button"
      @click="toggleSnap()"
      v-if="!shapeSelectionVisibility"
      v-bind:class="[!visible ? 'disabled' : '', snap ? 'active' : '']"
      ><span v-bind:class="[!snap ? '' : 'hidden']" class="icon-and-label"
        ><img src="@/assets/icons/snapOff.svg" alt="Turn off snap" />Snap
        off</span
      >
      <span v-bind:class="[snap ? '' : 'hidden']" class="icon-and-label">
        <img src="@/assets/icons/snapOn.svg" alt="Turn on snap" />Snap on</span
      ></span
    >
    <span
      v-bind:class="[
        transformationResetDisabled ? 'disabled ' : '',
        !visible ? 'disabled' : '',
      ]"
      class="canvas-button"
      @click="resetTransformation()"
      v-if="!shapeSelectionVisibility"
    >
      <img
        src="@/assets/icons/reset.svg"
        alt="Reset canvas position, rotation and scale"
      />
    </span>
    <!-- <span
      v-bind:class="[!visible ? 'disabled' : '']"
      class="canvas-button"
      @click="restoreTransformation()"
      v-if="!shapeSelectionVisibility"
    >
      <img
        src="@/assets/icons/MagicWand.svg"
        alt="Restore canvas position, rotation and scale"
      />
    </span> -->
    <div
      class="canvasShapeSelection"
      v-bind:class="[shapeSelectionVisibility ? '' : 'hidden']"
    >
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
        /></label>
      </span>
      <span @click="setCanvasShape('cube')">
        <input
          type="radio"
          id="shapeCube"
          name="shape"
          value="cube"
          v-model="shape"
        /><label for="cube"
          ><img
            src="@/assets/icons/Canvas-Cube.svg"
            alt="Set the 3d canvas shape to cube"
        /></label> </span
      ><span @click="setCanvasShape('cylinder')">
        <input
          type="radio"
          id="shapeCylinder"
          name="shape"
          value="cylinder"
          v-model="shape"
        /><label for="cylinder"
          ><img
            src="@/assets/icons/Canvas-Cylinder.svg"
            alt="Set the 3d canvas shape to cylinder"
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
  <div
    class="click-outside"
    v-if="shapeSelectionVisibility"
    @click="toggleShapeSelectionVisibility()"
    v-bind:style="[shapeSelectionVisibility ? 'z-index: 9' : '']"
  ></div>
</template>

<script>
import * as THREE from "three";
import { TransformControls } from "./transformControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { scene, renderer, camera, vm } from "../App.vue";

export let canvas, controls, currentShape;
let raycaster;
let canvasMirror;
let geometry = new THREE.PlaneGeometry(5, 5);
let headGeometry;

export default {
  name: "Canvas",
  data() {
    return {
      material: new THREE.MeshToonMaterial({
        color: 0xe6edf5,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: 2.5,
        polygonOffsetUnits: -1,
        emissive: new THREE.Color("rgb(255,255,255)"),
        emissiveIntensity: 0.3,
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
      snap: false,
      shapeSelectionVisibility: false,
      restoringTransformation: false,
    };
  },
  props: {
    selectedShape: String,
    selectedTool: String,
    mirror: [Boolean, String],
    mouse: Object,
  },
  emits: ["selected-canvas-shape", "set-tool-enabled"],
  methods: {
    setUp() {
      const material = this.material;
      canvas = new THREE.Mesh(geometry, material);
      scene.add(canvas);

      controls = new TransformControls(camera, renderer.domElement);
      controls.mode = "combined";
      // controls.scale.set(1.1, 1.1, 1.1);
      controls.addEventListener("change", () => {
        //this is not very elegant but…
        if (vm != undefined) {
          vm.$refs.raycastCanvas.transformationResetDisabled = false;
        }

        if (canvasMirror !== undefined) {
          var position = new THREE.Vector3();
          canvas.getWorldPosition(position);
          var quaternion = new THREE.Quaternion();
          canvas.getWorldQuaternion(quaternion);
          var scale = new THREE.Vector3();
          canvas.getWorldScale(scale);
          switch (vm.$refs.raycastCanvas.mirror) {
            case "x":
              canvasMirror.position.set(-position.x, position.y, position.z);
              canvasMirror.quaternion.set(
                -quaternion.x,
                quaternion.y,
                quaternion.z,
                -quaternion.w
              );
              canvasMirror.scale.set(-scale.x, scale.y, scale.z);
              canvasMirror.matrixWorldNeedsUpdate = true;
              break;
            case "y":
              canvasMirror.position.set(position.x, -position.y, position.z);
              canvasMirror.quaternion.set(
                quaternion.x,
                -quaternion.y,
                quaternion.z,
                -quaternion.w
              );
              canvasMirror.scale.set(scale.x, -scale.y, scale.z);
              canvasMirror.matrixWorldNeedsUpdate = true;
              break;
            case "z":
              canvasMirror.position.set(position.x, position.y, -position.z);
              canvasMirror.quaternion.set(
                quaternion.x,
                quaternion.y,
                -quaternion.z,
                -quaternion.w
              );
              canvasMirror.scale.set(scale.x, scale.y, -scale.z);
              canvasMirror.matrixWorldNeedsUpdate = true;
              break;
            default:
              return;
          }
        }
        renderer.render(scene, camera);
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
    restoreTransformation() {
      this.$emit("set-tool-enabled", false);
      this.restoringTransformation = true;
    },
    setShapeAndMatrix(shape, position, quaternion, scale) {
      this.setCanvasShape(shape);
      console.log(position);
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
    toggleTransformMode() {
      if (this.mode === "combined") {
        this.mode = "scale";
        controls.mode = "scale";
        renderer.render(scene, camera);
      } else {
        this.mode = "combined";
        controls.mode = "combined";
        renderer.render(scene, camera);
      }
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

        if (this.transformationEnabled === true) {
          controls.visible = false;
        }

        //if controls are enabled we temporary disable them without overriding the setting
        if (controls.enabled === true) {
          controls.enabled = false;
        }

        canvas.visible = false;
        renderer.render(scene, camera);
      } else {
        this.visible = true;

        if (this.transformationEnabled === true) {
          controls.visible = true;
        }

        //if controls were enabled, restore them to be enabled
        if (controls.enabled === false && this.transformationEnabled === true) {
          controls.enabled = true;
        }

        canvas.visible = true;

        renderer.render(scene, camera);
      }
    },
    toggleSnap() {
      if (this.snap === true) {
        this.snap = !this.snap;
        controls.translationSnap = null;
        controls.rotationSnap = null;
      } else {
        this.snap = !this.snap;
        controls.translationSnap = 1 / 3;
        controls.rotationSnap = Math.PI / 6;
      }
    },
    toggleShapeSelectionVisibility() {
      this.shapeSelectionVisibility = !this.shapeSelectionVisibility;
    },
    setCanvasShape(val) {
      this.shape = val;
      currentShape = val;
      this.$emit("selected-canvas-shape", val);
      this.shapeSelectionVisibility = false;
    },
    setUpMirror(val) {
      switch (val) {
        case "x":
          canvasMirror = canvas.clone();
          canvasMirror.applyMatrix4(canvas.matrixWorld.makeScale(-1, 1, 1));
          scene.add(canvasMirror);
          renderer.render(scene, camera);
          break;

        case "y":
          break;

        case "z":
          break;

        default:
          break;
      }
    },
    removeMirror() {
      scene.remove(canvasMirror);
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
      canvas.geometry.dispose();

      switch (val) {
        case "plane":
          canvas.geometry = new THREE.PlaneGeometry(5, 5);

          break;
        case "cube":
          canvas.geometry = new THREE.BoxGeometry(5, 5, 5);
          break;
        case "cylinder":
          canvas.geometry = new THREE.CylinderGeometry(2.5, 2.5, 5, 15);
          break;
        case "sphere":
          canvas.geometry = new THREE.SphereGeometry(2.5, 15, 15);
          break;
        case "head":
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
          break;

        default:
          break;
      }

      canvas.geometry.needsUpdate = true;
      renderer.render(scene, camera);

      // if (val === "plane") {
      //   canvas.geometry.dispose();
      //   canvas.geometry = new THREE.PlaneGeometry(5, 5);
      //   canvas.geometry.needsUpdate = true;
      //   renderer.render(scene, camera);
      // } else if (val === "sphere") {
      //   canvas.geometry.dispose();
      //   canvas.geometry = new THREE.SphereGeometry(2.5, 15, 15);
      //   canvas.geometry.needsUpdate = true;
      //   renderer.render(scene, camera);
      // } else if (val === "head") {
      //   if (headGeometry === undefined) {
      //     const loader = new GLTFLoader();
      //     loader.load("/asaro.glb", function (gltf) {
      //       headGeometry = gltf.scene.children[0].geometry;
      //       canvas.geometry.dispose();
      //       canvas.geometry = headGeometry;
      //       canvas.geometry.needsUpdate = true;
      //       renderer.render(scene, camera);
      //     });
      //   } else {
      //     canvas.geometry.dispose();
      //     canvas.geometry = headGeometry;
      //     canvas.geometry.needsUpdate = true;
      //     renderer.render(scene, camera);
      //   }
      // }
    },
    mirror: function (val) {
      if (val === false) {
        this.removeMirror();
      } else {
        this.setUpMirror(val);
      }
    },
    mouse: function (val) {
      if (this.restoringTransformation === true) {
        raycaster = new THREE.Raycaster();
        try {
          raycaster.setFromCamera(new THREE.Vector2(val.x, val.y), camera);
          raycaster.params.Line.threshold = 0.05;
          raycaster.layers.set(1);
          let obj = raycaster.intersectObjects(scene.children)[0].object;
          if (obj != undefined && obj.geometry.type == "MeshLine") {
            this.setShapeAndMatrix(
              obj.userData.canvas.shape,
              obj.userData.canvas.position,
              obj.userData.canvas.quaternion,
              obj.userData.canvas.scale
            );
          }
        } catch (error) {
          console.log(error);
        }
        this.$emit("set-tool-enabled", true);
        this.restoringTransformation = false;
      }
    },
  },
  mounted() {
    this.setCanvasShape(this.shape);
  },
};
</script>

<style scoped>
.canvasSettings {
  z-index: 2;
  position: absolute;
  top: 12px;
  left: 12px;
  font-weight: 900;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

#canvasShapeDropdown {
  max-width: 140px;
}

.canvasShapeSelection {
  font-size: 0.45em;
  color: #1c1c1e;
  white-space: discard;
  display: flex;
  flex-direction: column;
  filter: drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.08));
  border-radius: 8px;
  overflow: hidden;
  position: absolute;
  z-index: 10;
  top: calc(44px + 8px);
  width: 60px;
}

.canvasShapeSelection > span > label {
  display: flex;
  flex-direction: row;
  align-items: initial;
}

.click-outside {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
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

.canvas-button {
  height: 44px;
  /* max-width: 44px; */
  border-radius: 22px;
  background-color: rgba(255, 255, 255, 1);
  font-size: 2em;
  line-height: 1em;
  color: rgba(255, 255, 255, 1);
  justify-content: center;
  align-content: center;
  text-align: center;
  z-index: 2;
  filter: drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.08));
  display: flex;
  align-items: center;
  width: fit-content;
}

.icon-and-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  font-size: 0.5em;
  border-radius: 22px;
  color: #1c1c1e;
  padding: 0px 12px 0px 4px;
}

.transform-mode {
  padding: 0px 2px;
}

.active {
  box-shadow: inset 0px 0px 0px 1px #fff;
  background-color: #ffe8b3;
}

.hidden {
  display: none;
}

label {
  display: flex;
  width: 60px;
  height: 44px;
  align-content: center;
  justify-content: center;
  margin: 0px;
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

@media (min-width: 320px) and (max-width: 480px) {
  .canvasSettings {
    top: 80px;
  }

  .icon-and-label {
    max-width: 32px;
    overflow: hidden;
  }
}
</style>