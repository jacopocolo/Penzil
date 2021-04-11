<template>
  <button @click="exportToGp">Export</button>
</template>

<script>
import * as THREE from "three";
// import { draw } from "./draw.js";
import { scene } from "../App.vue";

export default {
  name: "Import",
  props: {},
  data() {
    return {};
  },
  methods: {
    exportToGp: function () {
      const json = [];
      scene.children.forEach((obj) => {
        //check if it's a line, if it's in the right layer and that we don't already have its original
        if (
          obj.geometry &&
          obj.geometry.type == "MeshLine" &&
          obj.layers.mask == 2
        ) {
          let line = {};

          let geometry = obj.geometry.clone();
          geometry.applyMatrix(obj.matrix);

          line.vertices = Array.from(geometry.attributes.position.array);
          line.stroke = obj.userData.stroke;
          line.fill = obj.userData.fill;
          line.mirrorOn = false;
          line.position = new THREE.Vector3(0, 0, 0);
          line.quaternion = new THREE.Quaternion(0, 0, 0, 1);
          line.scale = new THREE.Vector3(1, 1, 1);
          line.matrix = obj.matrix;
          json.push(line);
        }
      });
      console.log(json);

      var dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(json));

      var filename = prompt("Enter filename", "gp_");

      if (filename != null) {
        var el = document.createElement("a");
        el.setAttribute("href", dataStr);
        el.setAttribute("download", filename + ".json");
        el.click();
      }
    },
  },
  watch: {},
  mounted() {},
};
</script>

<style scoped>
</style>