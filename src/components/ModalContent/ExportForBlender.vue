
<template>
  <div>
    <h1>Export for Blender</h1>

    <p>
      You can export your drawing for Beldner with the button below but there
      isn't a proper improter yet, just a script. Hop in
      <a href="https://discord.gg/jvzjNpZGCk" target="_blank">Penzil Discord</a>
      server and I'll guide you along.
    </p>
    <button @click="exportToGp">Export for Blender</button>
  </div>
</template>

<script>
import * as THREE from "three";
import { scene } from "../../App.vue";

export default {
  name: "Export",
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
};
</script>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

h1 {
  font-size: 60px;
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
}
</style>