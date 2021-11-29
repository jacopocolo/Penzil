
<template>
  <div>
    <h1>Export for Procreate</h1>
    <div class="row">
      <div id="scene-usdz-canvas" class="column">
        <canvas id="usdz-canvas"></canvas>
        <span class="canvas-instructions"
          >Tap or click on a fill (visible face or edge) to flip it</span
        >
      </div>
      <div id="usdz-options" class="column">
        <p>
          <input type="checkbox" name="strokes" v-model="mergeLines" />
          <label for="strokes"
            >Merge strokes (reccomended)
            <p>
              All strokes will appear as a single layer in Procreate. You will
              lose individual stroke colors but you'll be able to repaint them
              in Procreate. This settings allows you to import bigger Penzil
              sketches before your artwork exceeds the device capabilities for
              import.
            </p></label
          >
          <br />
          <input type="checkbox" name="fills" v-model="checkFills" />
          <label for="fills"
            >Manually check your fills. Tap or click on a visible face or edge
            to flip it
            <p>
              Procrete only support single face meshes and you can only paint
              their front side. Check that your fills are facing the direction
              you want. If you just see an outline you are looking at the back
              of a fill. Tap on its edge or turn it around and tap on it to flip
              it.
            </p>
          </label>
        </p>
        <button @click="exportToUSDZ">Export</button>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import { scene } from "../../App.vue";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { USDZExporter } from "three/examples/jsm/exporters/USDZExporter.js";
import {
  convertMeshlineToGeometry,
  convertMeshlineFillToGeometry,
} from "../convertMeshlineToGeometry.js";
import CameraControls from "camera-controls";
CameraControls.install({ THREE: THREE });

let raycaster = new THREE.Raycaster();
raycaster.params.Line.threshold = 0.1;
// let texture = new THREE.TextureLoader().load("/watercolor.jpg");
// texture.wrapS = THREE.RepeatWrapping;
// texture.wrapT = THREE.RepeatWrapping;
// texture.repeat.set(1, 1);
let sceneUSDZ = new THREE.Scene();
let sceneExport = new THREE.Scene();
let rendererUSDZ = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
let cameraUSDZ = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
let clock, cameraControls;

export default {
  name: "Export",
  data() {
    return {
      mergeLines: true,
      checkFills: false,
    };
  },
  methods: {
    previewUSDZ: function () {
      sceneUSDZ.background = new THREE.Color(0xf0f0f0);

      rendererUSDZ = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        canvas: document.getElementById("usdz-canvas"),
      });

      rendererUSDZ.setPixelRatio(window.devicePixelRatio);

      cameraUSDZ.zoom = 3;
      cameraUSDZ.position.set(5, 5, 10);
      cameraUSDZ.updateProjectionMatrix();

      clock = new THREE.Clock();

      cameraControls = new CameraControls(cameraUSDZ, rendererUSDZ.domElement);
      cameraControls.dampingFactor = 20;
      cameraControls.draggingDampingFactor = 200;
      cameraControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
      cameraControls.mouseButtons.wheel = CameraControls.ACTION.ROTATE;
      document.addEventListener("keydown", (event) => {
        if (event.code === "Space") {
          cameraControls.mouseButtons.left = CameraControls.ACTION.TRUCK;
          this.toolEnabled = false;
        }
      });
      document.addEventListener("keyup", (event) => {
        if (event.code === "Space") {
          cameraControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
          this.toolEnabled = true;
        }
      });
      document.addEventListener("keydown", (event) => {
        if (event.code === "AltLeft") {
          cameraControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
          this.toolEnabled = false;
        }
      });
      document.addEventListener("keyup", (event) => {
        if (event.code === "AltLeft") {
          cameraControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
          this.toolEnabled = true;
        }
      });
      cameraControls.mouseButtons.middle = CameraControls.ACTION.DOLLY;
      cameraControls.mouseButtons.right = CameraControls.ACTION.ZOOM;
      cameraControls.touches.one = CameraControls.ACTION.TOUCH_ROTATE;
      cameraControls.touches.two = CameraControls.ACTION.TOUCH_ZOOM_ROTATE;
      cameraControls.touches.three = CameraControls.ACTION.TOUCH_DOLLY_TRUCK;
      cameraControls.enabled = true;
      cameraControls.maxZoom = 4000;
      cameraControls.minZoom = 1.5;

      // const group = new THREE.Group();

      scene.children.forEach((obj) => {
        if (
          obj != undefined &&
          obj.geometry &&
          obj.geometry.type == "MeshLine" &&
          obj.layers.mask == 2 &&
          obj.geometry.attributes.position.array.length > 6
        ) {
          // The stroke
          if (obj.userData.stroke.show_stroke === true) {
            sceneUSDZ.add(convertMeshlineToGeometry(obj, "basic"));
          }

          // The fill
          if (obj.userData.fill.show_fill === true) {
            sceneUSDZ.add(convertMeshlineFillToGeometry(obj, "basic", true));
          }
        }
      });

      // sceneUSDZ.add(group);
      sceneUSDZ.updateMatrixWorld(true);

      rendererUSDZ.render(sceneUSDZ, cameraUSDZ);

      rendererUSDZ.domElement.addEventListener("pointerup", this.flipFace);
      window.addEventListener("resize", this.onWindowResize);
      window.addEventListener("orientationchange", this.onWindowResize);
      this.onWindowResize();
    },
    onWindowResize: function () {
      const canvas = rendererUSDZ.domElement;
      cameraUSDZ.aspect = canvas.clientWidth / canvas.clientHeight;
      cameraUSDZ.updateProjectionMatrix();
      rendererUSDZ.setSize(canvas.clientWidth, canvas.clientHeight);
      // renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
      rendererUSDZ.render(sceneUSDZ, cameraUSDZ);
    },
    flipFace: function (event) {
      let canvasBounds = rendererUSDZ.context.canvas.getBoundingClientRect();
      let x =
        ((event.clientX - canvasBounds.left) /
          (canvasBounds.right - canvasBounds.left)) *
          2 -
        1;
      let y =
        -(
          (event.clientY - canvasBounds.top) /
          (canvasBounds.bottom - canvasBounds.top)
        ) *
          2 +
        1;
      raycaster.setFromCamera(new THREE.Vector2(x, y), cameraUSDZ);
      var intersectedObject = raycaster.intersectObjects(sceneUSDZ.children)[0];
      if (intersectedObject != undefined) {
        if (intersectedObject.object.type === "LineSegments") {
          let renderOrder = intersectedObject.object.parent.renderOrder;
          let lineRenderOrder = intersectedObject.object.renderOrder;
          intersectedObject.object.parent.geometry.index.array =
            intersectedObject.object.parent.geometry.index.array.reverse();
          intersectedObject.object.parent.geometry.index.needsUpdate = true;
          intersectedObject.object.renderOrder = lineRenderOrder;
          intersectedObject.object.parent.renderOrder = renderOrder;
        } else {
          let renderOrder = intersectedObject.object.renderOrder;
          intersectedObject.object.geometry.index.array =
            intersectedObject.object.geometry.index.array.reverse();
          intersectedObject.object.geometry.index.needsUpdate = true;
          intersectedObject.object.renderOrder = renderOrder;
        }
      }
      rendererUSDZ.render(sceneUSDZ, cameraUSDZ);
    },
    animtateSceneUSDZ: function () {
      const delta = clock.getDelta();
      let hasCameraControlsUpdated = cameraControls.update(delta);

      requestAnimationFrame(this.animtateSceneUSDZ);
      if (hasCameraControlsUpdated) {
        rendererUSDZ.render(sceneUSDZ, cameraUSDZ);
      }
    },
    exportToUSDZ: async function () {
      sceneExport = new THREE.Scene();
      const group = new THREE.Group();
      let geometries = [];
      let uvs = [];

      //potentially UVs could be kept by scaling and ofsetting
      //https://stackoverflow.com/questions/23530449/rotate-scale-and-translate-2d-coordinates

      for (let o = 0; o < sceneUSDZ.children.length; o++) {
        const obj = sceneUSDZ.children[o];
        if (obj.material?.type === "MeshBasicMaterial") {
          let newObj = obj.clone();
          newObj.material = new THREE.MeshStandardMaterial({
            color: obj.material.color,
          });
          if (
            this.mergeLines === true &&
            obj.geometry?.type === "TubeBufferGeometry"
          ) {
            //these are strokes
            let geometry = obj.geometry;
            geometries.push(geometry);

            let uv = Array.from(obj.geometry.attributes.uv.array);
            uvs.push(uv);
          } else {
            //these are fills
            sceneExport.add(newObj);
          }
        }
      }

      if (geometries.length > 0) {
        const material = new THREE.MeshStandardMaterial({
          color: 0x1c1c1e,
          flatShading: true,
        });
        const mergedGeometry = mergeBufferGeometries(geometries, false);

        const cells = Math.ceil(Math.sqrt(uvs.length));
        const offset = 1 / cells;
        let count = 0;

        console.log({ uvs_length: uvs.length, cells: cells, offset: offset });

        for (let y = 0; y < cells; y++) {
          for (let x = 0; x < cells; x++) {
            let i = count;
            if (i > uvs.length - 1) {
              continue;
            } else {
              for (let z = 0; z < uvs[i].length; z = z + 2) {
                uvs[i][z] = uvs[i][z] + (x / offset) * offset;
                uvs[i][z + 1] = uvs[i][z + 1] + (y / offset) * offset;
              }
              count++;
            }
          }
        }

        let mergedUvs = [].concat.apply([], uvs);
        for (let a = 0; a < mergedUvs.length; a++) {
          mergedUvs[a] = mergedUvs[a] * offset;
        }
        mergedGeometry.setAttribute(
          "uv",
          new THREE.Float32BufferAttribute(mergedUvs, 2)
        );
        mergedGeometry.attributes.uv.needsUpdate = true;

        const mesh = new THREE.Mesh(mergedGeometry, material);

        sceneExport.add(mesh);
        group.add(mesh);
        sceneExport.add(group);
      }

      const exporter = new USDZExporter();
      const arraybuffer = await exporter.parse(sceneExport);
      const blob = new Blob([arraybuffer], {
        type: "application/octet-stream",
      });
      var el = document.createElement("a");
      el.setAttribute("href", URL.createObjectURL(blob));
      el.setAttribute("download", "sketch.usdz");
      el.click();
    },
    clear: function (obj) {
      while (obj.children.length > 0) {
        this.clear(obj.children[0]);
        obj.remove(obj.children[0]);
      }
      if (obj.geometry) obj.geometry.dispose();

      if (obj.material) {
        Object.keys(obj.material).forEach((prop) => {
          if (!obj.material[prop]) return;
          if (
            obj.material[prop] !== null &&
            typeof obj.material[prop].dispose === "function"
          )
            obj.material[prop].dispose();
        });
        obj.material.dispose();
      }
    },
  },
  mounted() {
    this.previewUSDZ();
    this.animtateSceneUSDZ();
    const canvas = rendererUSDZ.domElement;
    rendererUSDZ.setSize(canvas.clientWidth, canvas.clientHeight);
  },
  unmounted() {
    this.clear(sceneUSDZ);
    this.clear(sceneExport);
  },
};
</script>

<style scoped>
.row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  padding-top: 1em;
  padding-bottom: 1em;
}

@media (orientation: portrait) {
  .row {
    flex-direction: column;
  }

  #usdz-options {
    padding-left: 0px;
  }
}

@media (orientation: landscape) {
  #usdz-options {
    padding-left: 1px;
  }
}

.column {
  display: flex;
  flex-direction: column;
  flex: 1;
  /* flex-basis: 100%; */
}

#usdz-canvas {
  position: relative;
  top: 0;
  width: 95%;
  height: 100%;
}

.canvas-instructions {
  position: relative;
  top: 0.5em;
  text-align: center;
  width: 90%;
  margin-bottom: 1em;
}

input > label {
  text-indent: 1.25em;
}

label {
  margin-left: 0.25em;
  font-weight: 900;
}

label > p {
  margin-left: 1em;
  margin-top: 0.5em;
  font-size: 1em;
}

h1 {
  font-size: 2em;
  display: inline;
}

h1 > h2 {
  display: inline;
}

h2 {
  font-size: 18px;
  line-height: 120%;
}

p {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5em;
  margin-top: 1em;
}

button {
  align-content: center;
  background-color: rgba(0, 0, 0, 0);
  border: none;
  height: 44px;
  width: 50%;
  padding-left: 16px;
  padding-right: 16px;
  border: 1px solid #ffb000;
  border-radius: 8px;
  margin-top: 1.5em;
}
</style>