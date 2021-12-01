<template>
  <button @click="exportToGltf()">Export to GLTF</button>
</template>

<script>
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { scene, renderer, camera } from "../../App.vue";
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

      for (let o = 0; o <= scene.children.length; o++) {
        let obj = scene.children[o];

        if (
          obj != undefined &&
          obj.geometry &&
          obj.geometry.type == "MeshLine" &&
          obj.layers.mask == 2 &&
          obj.geometry.attributes.position.array.length > 0
        ) {
          // The stroke
          if (obj.userData.stroke.show_stroke === true) {
            let geometry = obj.geometry.clone();
            geometry.applyMatrix4(obj.matrix);
            let vertices = [];
            let points = Array.from(geometry.attributes.position.array);

            for (let i = 0; i <= points.length; i = i + 6) {
              let v3 = new THREE.Vector3(
                points[i],
                points[i + 1],
                points[i + 2]
              );
              //why do I have 0,0,0 points in my positions? :thinking:
              if (v3.x != 0 && v3.y != 0 && v3.z != 0) {
                vertices.push(v3);
              }
            }

            //if the line is too short, we skip this iteration
            if (vertices.length < 2) continue;

            const lineGeometry = new THREE.BufferGeometry().setFromPoints(
              vertices
            );
            const line = new THREE.Line(lineGeometry, material);
            const material = new THREE.LineBasicMaterial({
              color: obj.userData.stroke.color,
            });
            line.userData.stroke = obj.userData.stroke;
            line.userData.fill = obj.userData.fill;

            sceneGLTF.add(line);
          }

          renderer.render(scene, camera);
        }
      }

      sceneGLTF.scale.set(0.1, 0.1, 0.1);
      sceneGLTF.updateMatrixWorld(true);

      const exporter = new GLTFExporter();
      exporter.parse(sceneGLTF, function (result) {
        if (result instanceof ArrayBuffer) {
          saveArrayBuffer(result, "scene.glb");
        } else {
          const output = JSON.stringify(result, null, 2);
          saveString(output, "scene.gltf");
        }
      });
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