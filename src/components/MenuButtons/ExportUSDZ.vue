<template>
  <button @click="exportToUsdz">Export USDZ</button>
</template>

<script>
import * as THREE from "three";
import { USDZExporter } from "three/examples/jsm/exporters/USDZExporter.js";
import { scene } from "../../App.vue";
// import { TubeGeometryWithVariableWidth } from "../TubeGeometryWithVariableWidth.js";
let sceneUSDZ;

export default {
  name: "ExportUSDZ",
  props: {},
  data() {
    return {};
  },
  methods: {
    exportToUsdz: async function () {
      sceneUSDZ = new THREE.Scene();

      const group = new THREE.Group();

      function map(n, start1, stop1, start2, stop2) {
        return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
      }

      for (let o = 0; o <= scene.children.length; o++) {
        let obj = scene.children[o];

        if (
          obj != undefined &&
          obj.geometry &&
          obj.geometry.type == "MeshLine" &&
          obj.layers.mask == 2
        ) {
          //https://github.com/mrdoob/three.js/blob/master/src/geometries/TubeGeometry.js
          let geometry = obj.geometry.clone();
          geometry.applyMatrix(obj.matrix);
          // console.log(obj);
          let vertices = [];
          let points = Array.from(geometry.attributes.position.array);

          for (let i = 0; i <= points.length; i = i + 3) {
            let v3 = new THREE.Vector3(points[i], points[i + 1], points[i + 2]);

            //why do I have 0,0,0 points in my positions? :thinking:
            if (v3.x != 0 && v3.y != 0 && v3.z != 0) {
              vertices.push(v3);
            }
          }

          let force = [];

          for (let i = 0; i <= obj.userData.stroke.force.length; i++) {
            let length = obj.userData.stroke.force.length;
            let minWidth = 0;
            let baseWidth = obj.userData.stroke.lineWidth;
            let width = obj.userData.stroke.force[i] / 16;
            // let width = obj.userData.stroke.lineWidth;
            let tailLength = 3;

            //Beginning of the line
            if (i < tailLength) {
              let n = map(i, minWidth, tailLength, minWidth, baseWidth + width);

              force.push(n);
            }
            //End of the line
            else if (i > length - tailLength) {
              let n = map(
                i,
                length - tailLength,
                length - 1,
                baseWidth + width,
                minWidth
              );

              force.push(n);
            }
            //bulk of the line
            else {
              force.push(baseWidth + width);
            }

            force
              .push
              // obj.userData.stroke.lineWidth + obj.userData.stroke.force[i] / 5
              ();
          }

          var pathBase = new THREE.CatmullRomCurve3(
            vertices,
            false,
            "catmullrom",
            0.5
          );

          // const tubeGeometry = new TubeGeometryWithVariableWidth(
          //   pathBase,
          //   force.length,
          //   force,
          //   8,
          //   true
          // );

          const tubeGeometry = new THREE.TubeGeometry(
            pathBase,
            force.length,
            0.01,
            8,
            false
          );
          const material = new THREE.MeshStandardMaterial({
            // color: 0x00ff00,
            // color: obj.userData.stroke.color,
          });
          const mesh = new THREE.Mesh(tubeGeometry, material);
          group.attach(mesh);
          mesh.geometry.computeBoundingSphere();
          // renderer.render(scene, camera);
        }
      }

      sceneUSDZ.add(group);

      // const geometry = new THREE.BoxGeometry(1, 1, 1);
      // const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
      // const cube = new THREE.Mesh(geometry, material);
      // sceneUSDZ.add(cube);

      const exporter = new USDZExporter();
      const arraybuffer = await exporter.parse(sceneUSDZ);
      const blob = new Blob([arraybuffer], {
        type: "application/octet-stream",
      });
      var el = document.createElement("a");
      el.setAttribute("href", URL.createObjectURL(blob));
      el.setAttribute("download", "sketch.usdz");
      el.click();
    },
  },
  watch: {},
  mounted() {},
};
</script>

<style scoped>
</style>