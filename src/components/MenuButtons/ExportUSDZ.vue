<template>
  <button
    v-bind:class="[mode === 'default' || mode === 'exporting' ? '' : 'hidden']"
    @click="mode === 'default' ? exportForAr() : ''"
  >
    {{ mode === "default" ? "Export for AR" : "Exporting..." }}
  </button>
  <a v-bind:class="[mode === 'view' ? 'ar' : 'ar hidden']" id="ar" rel="ar">
    <img src="@/assets/icons/View_in_AR.svg" />
  </a>
  <a
    id="download"
    v-bind:class="[mode === 'view' ? 'ar' : 'ar hidden']"
    download="sketch.usdz"
    target="_blank"
  >
    Download USDZ
  </a>
</template>

<script>
import * as THREE from "three";
import { USDZExporter } from "three/examples/jsm/exporters/USDZExporter.js";
import { scene } from "../../App.vue";
import {
  convertMeshlineToGeometry,
  convertMeshlineFillToGeometry,
} from "../convertMeshlineToGeometry.js";
let sceneUSDZ;

export default {
  name: "ExportUSDZ",
  props: {},
  data() {
    return {
      lightbox: false,
      text: "Export for AR",
      mode: "default", //default || exporting || view
      url: undefined,
    };
  },
  methods: {
    exportForAr: function () {
      this.mode = "exporting";
      //there are better ways but this is good enough. The export floods the processor so vue doesn't update even with nextTick
      setTimeout(() => {
        this.viewInAr();
      }, 500);
    },
    viewInAr: async function () {
      sceneUSDZ = new THREE.Scene();

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
            sceneUSDZ.add(convertMeshlineToGeometry(obj, "standard"));
          }

          // The fill
          if (obj.userData.fill.show_fill === true) {
            convertMeshlineFillToGeometry(obj, "standard", false, true).forEach(
              (mesh) => {
                sceneUSDZ.add(mesh);
              }
            );
          }
        }
      });

      // for (let o = 0; o <= scene.children.length; o++) {
      //   let obj = scene.children[o];

      //   if (
      //     obj != undefined &&
      //     obj.geometry &&
      //     obj.geometry.type == "MeshLine" &&
      //     obj.layers.mask == 2 &&
      //     obj.geometry.attributes.position.array.length > 0
      //   ) {
      //     // The stroke
      //     if (obj.userData.stroke.show_stroke === true) {
      //       let geometry = obj.geometry.clone();
      //       geometry.applyMatrix4(obj.matrix);
      //       let vertices = [];
      //       let points = Array.from(geometry.attributes.position.array);

      //       for (let i = 0; i <= points.length; i = i + 6) {
      //         let v3 = new THREE.Vector3(
      //           points[i],
      //           points[i + 1],
      //           points[i + 2]
      //         );
      //         //why do I have 0,0,0 points in my positions? :thinking:
      //         if (v3.x != 0 && v3.y != 0 && v3.z != 0) {
      //           vertices.push(v3);
      //         }
      //       }

      //       //if the line is too short, we skip this iteration
      //       if (vertices.length < 2) continue;

      //       let force = [0];
      //       for (let i = 0; i < obj.userData.stroke.force.length; i++) {
      //         let length = obj.userData.stroke.force.length;
      //         let minWidth = 0;
      //         let baseWidth = obj.userData.stroke.lineWidth;

      //         //https://github.com/spite/THREE.MeshLine/blob/master/src/THREE.MeshLine.js#L424
      //         //in the shader it seems like it's base witdth * width
      //         let width = obj.userData.stroke.force[i] / (baseWidth * 10000);
      //         let tailLength = 3;

      //         //Beginning of the line
      //         if (i < tailLength) {
      //           let n = map(
      //             i,
      //             minWidth,
      //             tailLength,
      //             minWidth,
      //             baseWidth + width
      //           );

      //           force.push(n);
      //         }
      //         //End of the line
      //         else if (i > length - tailLength) {
      //           let n = map(
      //             i,
      //             length - tailLength,
      //             length - 1,
      //             baseWidth + width,
      //             minWidth
      //           );

      //           force.push(n);
      //         }
      //         //bulk of the line
      //         else {
      //           force.push(baseWidth + width);
      //         }
      //       }

      //       var pathBase = new THREE.CatmullRomCurve3(vertices);
      //       const tubeGeometry = new TubeBufferGeometry(
      //         pathBase,
      //         vertices.length,
      //         force,
      //         8,
      //         !true
      //       );

      //       const material = new THREE.MeshStandardMaterial({
      //         color: obj.userData.stroke.color,
      //         flatShading: true,
      //         roughness: 1,
      //         shininess: 0,
      //         metalness: 1,
      //       });
      //       const mesh = new THREE.Mesh(tubeGeometry, material);
      //       if (mesh.geometry.attributes.uv != undefined) {
      //         group.attach(mesh);
      //         sceneUSDZ.add(mesh);
      //       } else {
      //         continue;
      //       }
      //     }

      //     // The fill
      //     if (obj.userData.fill.show_fill === true) {
      //       let fill = obj.children[0].clone();
      //       let fillGeometry = obj.children[0].geometry.clone();

      //       // let flippedFaces = obj.children[0].geometry.clone();
      //       // let flippedArray = flippedFaces.index.array.reverse();
      //       // flippedFaces.index.array = flippedArray;
      //       // const mergedFaces = new Uint16Array(
      //       //   fillGeometry.index.array.length + flippedFaces.index.array.length
      //       // );
      //       // for (var f = 0; f < fillGeometry.index.array.length; f++)
      //       //   mergedFaces[f] = fillGeometry.index.array[f];
      //       // for (var e = 0; e < flippedFaces.index.array.length; e++)
      //       //   mergedFaces[fillGeometry.index.array.lenght + e] =
      //       //     flippedFaces.index.array[e];
      //       // fillGeometry.index.array = mergedFaces;
      //       // fillGeometry.index.count = mergedFaces.length;

      //       fill.geometry = fillGeometry;
      //       fill.geometry.applyMatrix4(obj.matrix);
      //       fill.position.set(0, 0, 0);
      //       fill.rotation.set(0, 0, 0);
      //       fill.scale.set(1, 1, 1);

      //       fill.material = new THREE.MeshStandardMaterial({
      //         color: obj.userData.fill.color,
      //         side: THREE.DoubleSide,
      //       });

      //       let texture;
      //       if (obj.children[0].material.map) {
      //         texture = obj.children[0].material.map.clone();
      //         fill.material.map = texture;
      //       }

      //       sceneUSDZ.add(fill);

      //       let fillFlipped = fill.clone();
      //       let fillFlippedGeometry = fill.geometry.clone();
      //       fillFlippedGeometry.index.array =
      //         fillFlippedGeometry.index.array.reverse();
      //       fillFlipped.geometry = fillFlippedGeometry;
      //       fillFlipped.material = new THREE.MeshStandardMaterial({
      //         color: obj.userData.fill.color,
      //         side: THREE.DoubleSide,
      //       });
      //       sceneUSDZ.add(fillFlipped);
      //     }
      //   }
      // }

      sceneUSDZ.scale.set(0.1, 0.1, 0.1);
      sceneUSDZ.updateMatrixWorld(true);

      const exporter = new USDZExporter();
      const arraybuffer = await exporter.parse(sceneUSDZ);
      //.parse ( input : Object3D, onCompleted : Function)
      const blob = new Blob([arraybuffer], {
        type: "application/octet-stream",
      });
      // var el = document.createElement("a");
      var el = document.getElementById("ar");
      el.setAttribute("href", URL.createObjectURL(blob));
      el.setAttribute("download", "sketch.usdz");
      document
        .getElementById("download")
        .setAttribute("href", URL.createObjectURL(blob));
      this.mode = "view";
    },
  },
  watch: {},
  mounted() {},
};
</script>

<style scoped>
button {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-weight: 900;
  font-size: 0.8em;
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

a.ar {
  color: #1c1c1e;
  font-weight: 900;
  line-height: 30px;
  text-align: center;
  font-size: 0.8em;
}

.ar > img {
  width: auto;
}
</style>