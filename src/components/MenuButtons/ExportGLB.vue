<template>
  <button @click="exportToGltf()">Export to GLB</button>
</template>

<script>
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { scene } from "../../App.vue";
import {
  convertMeshlineToGeometry,
  convertMeshlineFillToGeometry,
} from "../convertMeshlineToGeometry.js";
let sceneGLTF;

export default {
  name: "ExportGLTF",
  props: {},
  data() {
    return {};
  },
  methods: {
    exportToGltf: async function () {
      this.text = "Exporting...";
      sceneGLTF = new THREE.Scene();

      const group = new THREE.Group();

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
            group.attach(convertMeshlineToGeometry(obj));
          }

          // The fill
          if (obj.userData.fill.show_fill === true) {
            sceneGLTF.add(convertMeshlineFillToGeometry(obj));
          }
        }
      });

      sceneGLTF.add(group);
      sceneGLTF.scale.set(0.1, 0.1, 0.1);
      sceneGLTF.updateMatrixWorld(true);
      console.log(sceneGLTF);

      const exporter = new GLTFExporter();
      exporter.parse(
        sceneGLTF,
        function (result) {
          if (result instanceof ArrayBuffer) {
            saveArrayBuffer(result, "scene.glb");
          } else {
            const output = JSON.stringify(result, null, 2);
            saveString(output, "scene.gltf");
          }
        },
        { binary: true }
      );
      const link = document.createElement("a");
      link.style.display = "none";
      document.body.appendChild(link);

      function save(blob, filename) {
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();

        // URL.revokeObjectURL( url ); breaks Firefox...
      }

      function saveString(text, filename) {
        save(new Blob([text], { type: "text/plain" }), filename);
      }

      function saveArrayBuffer(buffer, filename) {
        save(
          new Blob([buffer], { type: "application/octet-stream" }),
          filename
        );
      }
    },
  },
  watch: {},
  mounted() {},
};
</script>

<style scoped>
button {
  border-bottom: 1px solid #ffe8b3;
}

.ar {
  width: 100%;
  align-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0);
  border: none;
  height: 44px;
  padding-top: 6px;
  padding-left: 12px;
  padding-right: 12px;
  border-bottom: 1px solid #ffe8b3;
  box-sizing: border-box;
}

.ar > img {
  width: auto;
}
</style>