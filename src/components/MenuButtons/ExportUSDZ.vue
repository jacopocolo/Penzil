<template>
  <button @click="exportToUsdz">Export USDZ</button>
</template>

<script>
import * as THREE from "three";
import { USDZExporter } from "three/examples/jsm/exporters/USDZExporter.js";
import { scene, renderer, camera } from "../../App.vue";
// import { TubeBufferGeometry } from "../TubeGeometryVW.js";
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
          obj.layers.mask == 2 &&
          obj.geometry.attributes.position.array.length > 0
        ) {
          // The stroke
          if (obj.userData.stroke.show_stroke === true) {
            let geometry = obj.geometry.clone();
            geometry.applyMatrix4(obj.matrix);
            let vertices = [];
            let points = Array.from(geometry.attributes.position.array);

            for (let i = 0; i <= points.length; i = i + 3) {
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

            let force = [];

            for (let i = 0; i <= obj.userData.stroke.force.length; i++) {
              let length = obj.userData.stroke.force.length;
              let minWidth = 0;
              let baseWidth = obj.userData.stroke.lineWidth;
              let width = obj.userData.stroke.force[i] / 16;
              let tailLength = 3;

              //Beginning of the line
              if (i < tailLength) {
                let n = map(
                  i,
                  minWidth,
                  tailLength,
                  minWidth,
                  baseWidth + width
                );

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
            }

            var pathBase = new THREE.CatmullRomCurve3(
              vertices,
              false,
              "catmullrom",
              0.1
            );

            // parabola thinning
            // (i) =>
            //     Math.pow(4 * i * (1 - i), 1) *
            //     obj.userData.stroke.lineWidth *
            //     2

            // const tubeGeometry = new TubeBufferGeometry(
            //   pathBase,
            //   vertices.length,
            //   (i) =>
            //     Math.pow(4 * i * (1 - i), 1) * obj.userData.stroke.lineWidth,
            //   8,
            //   !true
            // );

            const tubeGeometry = new THREE.TubeGeometry(
              pathBase,
              vertices.length,
              0.02,
              8,
              false
            );

            const material = new THREE.MeshStandardMaterial({
              color: obj.userData.stroke.color,
              wireframe: 1,
              // metalness: 0,
              // roughness: 1,
            });
            const mesh = new THREE.Mesh(tubeGeometry, material);
            mesh.geometry.computeBoundingSphere();
            group.attach(mesh);
            sceneUSDZ.add(mesh);
          }

          // The fill
          if (obj.userData.fill.show_fill === true) {
            let fill = obj.children[0].clone();
            let fillGeometry = obj.children[0].geometry.clone();
            fill.geometry = fillGeometry;
            fill.geometry.applyMatrix4(obj.matrix);
            fill.position.set(0, 0, 0);
            fill.rotation.set(0, 0, 0);
            fill.scale.set(1, 1, 1);
            fill.material = new THREE.MeshStandardMaterial({
              color: obj.userData.fill.color,
            });
            sceneUSDZ.add(fill);
          }

          renderer.render(scene, camera);
        }
      }

      sceneUSDZ.add(group);
      sceneUSDZ.scale.set(0.1, 0.1, 0.1);
      sceneUSDZ.updateMatrixWorld(true);
      console.log(group);

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
      // el.click();
    },
  },
  watch: {},
  mounted() {},
};
</script>

<style scoped>
</style>