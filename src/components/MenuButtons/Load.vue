<template>
  <button @click="importFromJson">Load</button>
</template>

<script>
import { draw } from "../draw.js";

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
          try {
            json.forEach((l) => {
              console.log(l);

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
            });
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
</style>