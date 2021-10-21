<template>
  <button @click="importFromJson">{{ text }}</button>
</template>

<script>
import { draw } from "../draw.js";

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
        let _this = this;
        file = event.target.files[0];
        function onReaderLoad(event) {
          var json = JSON.parse(event.target.result);
          try {
            for (let i = 0; i < json.length; i++) {
              console.log(i);
              _this.text = "Loading";
              let l = json[i];
              setTimeout(() => {
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
              }, 1);
            }
            // json.forEach((l, index) => {
            //   if (l.vertices.length === 0) {
            //     console.log(l);
            //   } else {
            //     _this.updateText(index, json.length);
            //     draw.fromVertices(
            //       new Float32Array(l.vertices),
            //       l.stroke,
            //       l.fill,
            //       l.mirrorOn,
            //       null, //uuid, not necessary to restore in import
            //       l.position,
            //       l.quaternion,
            //       l.scale,
            //       l.matrix
            //     );
            //   }
            // });
            _this.text = "Load";
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