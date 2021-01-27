<template>
  <div>
    <button @click="importFromJson">Import</button>
  </div>
</template>

<script>
import * as THREE from "three";
import { draw } from "./draw.js";
import { mirror } from "./mirror.js";
import { scene, renderer, camera } from "../App.vue";

export default {
  name: "Import",
  props: {},
  data() {
    return {};
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

          // var lightestColor = getComputedStyle(
          //   document.documentElement
          // ).getPropertyValue("--line-color-lightest");
          // var lightColor = getComputedStyle(
          //   document.documentElement
          // ).getPropertyValue("--line-color-light");
          // var mediumColor = getComputedStyle(
          //   document.documentElement
          // ).getPropertyValue("--line-color-medium");
          // var darkColor = getComputedStyle(
          //   document.documentElement
          // ).getPropertyValue("--line-color-dark");

          try {
            json.forEach((importedLine) => {
              if (importedLine.g.length > 1) {
                //Let's make sure there are at least 2 points in the line
                var vertices = [];

                for (var i = 0; i < importedLine.g.length; i = i + 4) {
                  vertices.push(
                    new THREE.Vector4().fromArray(importedLine.g, i)
                  );
                }

                // var color;
                // switch (true) {
                //   case importedLine.c == 0:
                //     color = lightestColor;
                //     break;
                //   case importedLine.c == 1:
                //     color = lightColor;
                //     break;
                //   case importedLine.c == 2:
                //     color = mediumColor;
                //     break;
                //   case importedLine.c == 3:
                //     color = darkColor;
                //     break;
                //   default:
                //     color = lightestColor; //safe
                // }

                //console.log(color);

                var l = line.fromVertices(
                  vertices,
                  //color,
                  importedLine.w,
                  importedLine.a,
                  importedLine.p,
                  importedLine.q,
                  importedLine.s
                );

                mirror.updateMirrorOf(l, scene);
              }
            });
            renderer.render(scene, camera);
            //console.log(scene);
            // app.ui.showOverflowMenu = false;
          } catch (err) {
            console.log(err);
            // app.toast.show = true;
            // app.toast.text = "Error. No line data found";
            // setTimeout(function () {
            //   app.toast.show = false;
            // }, 2000);
          }
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
  },
  watch: {},
  mounted() {},
};
</script>

<style scoped>
button {
  position: absolute;
  z-index: 2;
  bottom: 10px;
  left: 10px;
}
</style>