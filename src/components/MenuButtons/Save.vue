<template>
  <button @click="exportToJson">Save</button>
</template>

<script>
import * as THREE from "three";
// import { draw } from "./draw.js";
import { scene } from "../../App.vue";

export default {
  name: "Import",
  props: {},
  data() {
    return {};
  },
  methods: {
    exportToJson: function () {
      const json = [];
      scene.children.forEach((obj) => {
        //check if it's a line, if it's in the right layer and that we don't already have its original
        if (
          obj.geometry &&
          obj.geometry.type == "MeshLine" &&
          obj.layers.mask == 2
        ) {
          let line = {};

          console.log(obj.geometry);

          line.vertices = Array.from(obj.geometry.points);
          line.stroke = obj.userData.stroke;
          line.fill = obj.userData.fill;
          line.mirrorOn = false;
          line.position = new THREE.Vector3();
          obj.getWorldPosition(line.position);
          line.quaternion = new THREE.Quaternion();
          obj.getWorldQuaternion(line.quaternion);
          line.scale = new THREE.Vector3();
          obj.getWorldScale(line.scale);
          line.matrix = obj.matrix;
          json.push(line);
        }
      });
      console.log(json);

      var dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(json));

      var filename = prompt("Enter a name for your file", "sketch");

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