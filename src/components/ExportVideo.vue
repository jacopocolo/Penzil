<template>
  <button @click="exportToMp4">Export video</button>
</template>

<script>
import * as THREE from "three";
import { renderer, camera, scene, cameraControls } from "../App.vue";
import { video } from "./makeVideo.js";

export default {
  name: "Import",
  props: {},
  data() {
    return {};
  },
  methods: {
    exportToMp4: function () {
      let v = new video();
      let length = 119;
      let currentLength = 0;
      camera.layers.disable(0);

      function download(blob) {
        let encodedVideo = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.style = "display: none";
        var url = encodedVideo;
        a.href = url;
        a.download = "video.mp4";
        document.body.appendChild(a);
        a.click();
        camera.layers.enable(0);
      }

      function animate() {
        renderer.render(scene, camera);
        cameraControls.rotate(3 * THREE.MathUtils.DEG2RAD, 0, true);
        v.addFrame(renderer);
        console.log(v.message);
        if (currentLength < length) {
          requestAnimationFrame(animate);
          currentLength++;
        } else {
          v.encode(
            (message) => {
              console.log(message);
            },
            (blob) => {
              download(blob);
            }
          );
        }
      }
      animate();
    },
  },
  watch: {},
  mounted() {},
};
</script>

<style scoped>
</style>