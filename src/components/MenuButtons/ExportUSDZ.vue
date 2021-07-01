<template>
  <button @click="exportToUsdz">Export USDZ</button>
</template>

<script>
import * as THREE from "three";
import { scene, renderer, camera } from "../../App.vue";
import { TubeGeometryWithVariableWidth } from "../TubeGeometryWithVariableWidth.js";

// let sceneUSDZ;

export default {
  name: "ExportUSDZ",
  props: {},
  data() {
    return {};
  },
  methods: {
    exportToUsdz: function () {
      const json = [];
      scene.children.forEach((obj) => {
        //check if it's a line, if it's in the right layer and that we don't already have its original
        if (
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
            force.push(
              obj.userData.stroke.lineWidth + obj.userData.stroke.force[i] / 5
            );
          }

          //something is off here. I have more vertices than force?
          console.log(vertices.length);
          console.log(force.length);

          var pathBase = new THREE.CatmullRomCurve3(
            vertices,
            false,
            "catmullrom",
            1
          );

          const tubeGeometry = new TubeGeometryWithVariableWidth(
            pathBase,
            force.length,
            force,
            8,
            true
          );
          const material = new THREE.MeshBasicMaterial({
            color: obj.userData.stroke.color,
          });
          const mesh = new THREE.Mesh(tubeGeometry, material);
          scene.add(mesh);
          mesh.geometry.computeBoundingSphere();
          renderer.render(scene, camera);

          //   let line = {};
          //   console.log(obj.geometry);
          //   line.vertices = Array.from(obj.geometry.points);
          //   line.stroke = obj.userData.stroke;
          //   line.fill = obj.userData.fill;
          //   line.mirrorOn = false;
          //   line.position = new THREE.Vector3();
          //   obj.getWorldPosition(line.position);
          //   line.quaternion = new THREE.Quaternion();
          //   obj.getWorldQuaternion(line.quaternion);
          //   line.scale = new THREE.Vector3();
          //   obj.getWorldScale(line.scale);
          //   line.matrix = obj.matrix;
          //   json.push(line);
        }
      });
      console.log(json);

      var dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(json));

      var filename = prompt("Enter filename", "sketch");

      if (filename != null) {
        var el = document.createElement("a");
        el.setAttribute("href", dataStr);
        el.setAttribute("download", filename + ".json");
        el.click();
      }
    },
    test: function () {
      var path = [
        new THREE.Vector3(-1, 1, 0),
        new THREE.Vector3(-1, 1.2, 0),
        new THREE.Vector3(0, 0, 0.5),
        new THREE.Vector3(1, 1.2, 0),
        new THREE.Vector3(1, 1, 0),
      ];
      var pathBase = new THREE.CatmullRomCurve3(path);
      const geometry = new TubeGeometryWithVariableWidth(
        pathBase,
        20,
        [
          0.01, 0.02, 0.03, 0.04, 0.05, 0.05, 0.04, 0.03, 0.02, 0.01, 0.01,
          0.02, 0.03, 0.04, 0.05, 0.05, 0.04, 0.03, 0.02, 0.01,
        ],
        8,
        false
      );
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: false,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      mesh.geometry.computeBoundingSphere();
      renderer.render(scene, camera);
    },
  },
  watch: {},
  mounted() {},
};
</script>

<style scoped>
</style>