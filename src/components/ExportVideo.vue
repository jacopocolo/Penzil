<template>
  <button @click="exportToMp4('360')">Export 360</button>
  <button @click="exportToMp4('bf')">Export b&f</button>
</template>

<script>
import * as THREE from "three";
import { renderer, camera, scene, cameraControls } from "../App.vue";
import * as HME from "h264-mp4-encoder";

export default {
  name: "Import",
  props: {},
  data() {
    return {};
  },
  methods: {
    //api here: https://github.com/TrevorSundberg/h264-mp4-encoder
    exportToMp4: function (loop) {
      const download = (url, filename) => {
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = filename || "download";
        anchor.click();
      };

      HME.createH264MP4Encoder().then((encoder) => {
        var ctx = renderer.getContext();
        encoder.width = ctx.drawingBufferWidth;
        encoder.height = ctx.drawingBufferHeight;
        encoder.initialize();
        let length = 240;
        let currentLength = 0;
        cameraControls.enabled = false;
        camera.layers.disable(0);
        let startAzimuthAngle = cameraControls.azimuthAngle;
        let polarAngle = cameraControls.polarAngle;
        let pos = [];

        function easing(loop) {
          //easing function: http://gizma.com/easing/

          function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return (c / 2) * t * t + b;
            t--;
            return (-c / 2) * (t * (t - 2) - 1) + b;
          }

          function easeInOutQuadYoyo(t, b, c, d) {
            if (t <= d / 2) {
              pos.push(easeInOutQuad(t, b, c, d / 2));
              let v = pos[pos.length - 1];
              return v;
            } else {
              let v = pos.pop();
              return v;
            }
          }
          if (loop == "360") {
            return easeInOutQuad(
              currentLength,
              startAzimuthAngle,
              360 * THREE.MathUtils.DEG2RAD,
              length
            );
          } else if (loop == "bf") {
            return easeInOutQuadYoyo(
              currentLength,
              startAzimuthAngle,
              startAzimuthAngle + 60 * THREE.MathUtils.DEG2RAD,
              length
            );
          }
        }

        function animate() {
          renderer.render(scene, camera);
          let f = easing(loop);
          cameraControls.rotateTo(f, polarAngle, false);
          var buf = new Uint8Array(
            ctx.drawingBufferWidth * ctx.drawingBufferHeight * 4
          );
          ctx.readPixels(
            0,
            0,
            ctx.drawingBufferWidth,
            ctx.drawingBufferHeight,
            ctx.RGBA,
            ctx.UNSIGNED_BYTE,
            buf
          );
          var halfHeight = (ctx.drawingBufferHeight / 2) | 0; // the | 0 keeps the result an int
          var bytesPerRow = ctx.drawingBufferWidth * 4;
          // make a temp buffer to hold one row
          var temp = new Uint8Array(ctx.drawingBufferWidth * 4);
          for (var y = 0; y < halfHeight; ++y) {
            var topOffset = y * bytesPerRow;
            var bottomOffset = (ctx.drawingBufferHeight - y - 1) * bytesPerRow;
            // make copy of a row on the top half
            temp.set(buf.subarray(topOffset, topOffset + bytesPerRow));
            // copy a row from the bottom half to the top
            buf.copyWithin(topOffset, bottomOffset, bottomOffset + bytesPerRow);
            // copy the copy of the top half row to the bottom half
            buf.set(temp, bottomOffset);
          }
          encoder.addFrameRgba(buf);

          if (currentLength < length) {
            requestAnimationFrame(animate);
            currentLength++;
          } else {
            encoder.finalize();
            const uint8Array = encoder.FS.readFile(encoder.outputFilename);
            download(
              URL.createObjectURL(new Blob([uint8Array], { type: "video/mp4" }))
            );
            encoder.delete();
            camera.layers.enable(0);
            cameraControls.enabled = true;
          }
        }
        animate();
      });
    },
  },
  watch: {},
  mounted() {},
};
</script>

<style scoped>
</style>