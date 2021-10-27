<template>
  <button @click="importFromJson">{{ text }}</button>
</template>

<script>
import { draw } from "../draw.js";
import { scene, renderer, camera } from "../../App.vue";

export default {
  name: "Import",
  props: {},
  data() {
    return {
      text: "Load",
    };
  },
  methods: {
    importFromJson: function () {
      var file;
      var input = document.createElement("input");
      input.style.display = "none";
      input.type = "file";
      document.body.appendChild(input);
      input.onchange = (event) => {
        file = event.target.files[0];
        function onReaderLoad(event) {
          var json = JSON.parse(event.target.result);
          let i = 0;
          function drawLine(l) {
            draw.fromVertices(
              new Float32Array(l.vertices),
              l.stroke,
              l.fill,
              l.mirrorOn,
              null, //uuid, not necessary to restore in import
              l.position,
              l.quaternion,
              l.scale,
              l.matrix
            );
            if (i < json.length - 1) {
              i++;
              drawLine(json[i]);
            } else {
              renderer.render(scene, camera);
            }
          }
          drawLine(json[i]);
        }
        if (file.type == "application/json") {
          var reader = new FileReader();
          reader.onload = onReaderLoad;
          reader.readAsText(file);
        } else {
          //   app.toast.show = true;
          //   app.toast.text = "Error. File type not correct";
          //   setTimeout(function () {
          //     app.toast.show = false;
          //   }, 2000);
        }
      };
      input.click();
    },
    // updateText: function (index, length) {
    //   this.text = "Loading " + index + "/" + length;
    // },
  },
  watch: {},
  mounted() {},
};
</script>

<style scoped>
</style>