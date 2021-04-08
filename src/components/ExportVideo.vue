<template>
  <div v-if="previewing" class="fade">
    <button>Cancel</button>
    <button>Record</button>
  </div>
  <button @click="previewExport('360')">Export 360</button>
  <button @click="previewExport('bf')">Export b&f</button>
</template>

<script>
import * as THREE from "three";
import { renderer, camera, scene, cameraControls } from "../App.vue";
// import * as HME from "h264-mp4-encoder";

export default {
  name: "Import",
  props: {},
  data() {
    return {
      previewing: false,
      recording: false,
      loop: undefined,
      length: 240, //in frames
      currentLength: 0, //current frame
      startAzimuthAngle: undefined,
      polarAngle: undefined,
      pos: [],
    };
  },
  methods: {
    easeInOutQuad(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    },
    easeInOutQuadYoyo(t, b, c, d) {
      if (t <= d / 2) {
        this.pos.push(this.easeInOutQuad(t, b, c, d / 2));
        let v = this.pos[this.pos.length - 1];
        return v;
      } else {
        let v = this.pos.pop();
        return v;
      }
    },
    easing(loop) {
      //easing function: http://gizma.com/easing/
      if (loop == "360") {
        return this.easeInOutQuad(
          this.currentLength,
          this.startAzimuthAngle,
          360 * THREE.MathUtils.DEG2RAD,
          this.length
        );
      } else if (loop == "bf") {
        return this.easeInOutQuadYoyo(
          this.currentLength,
          this.startAzimuthAngle,
          this.startAzimuthAngle + 60 * THREE.MathUtils.DEG2RAD,
          this.length
        );
      }
    },
    animate(record) {
      console.log(record);
      renderer.render(scene, camera);
      let f = this.easing(this.loop);
      cameraControls.rotateTo(f, this.polarAngle, false);
      if (
        this.previewing &&
        !this.recording &&
        this.currentLength < this.length
      ) {
        requestAnimationFrame(this.animate);
        this.currentLength++;
      } else {
        this.currentLength = 0;
        requestAnimationFrame(this.animate);
        //cameraControls.enabled = true;
      }
    },
    previewExport: function (loop) {
      this.startAzimuthAngle = cameraControls.azimuthAngle;
      this.polarAngle = cameraControls.polarAngle;
      this.loop = loop;
      this.previewing = true;
      cameraControls.enabled = false;
      camera.layers.disable(0);
      this.animate();
    },
    //api here: https://github.com/TrevorSundberg/h264-mp4-encoder
    // exportToMp4: function (loop) {
    //   const download = (url, filename) => {
    //     const anchor = document.createElement("a");
    //     anchor.href = url;
    //     anchor.download = filename || "download";
    //     anchor.click();
    //   };

    //   HME.createH264MP4Encoder().then((encoder) => {
    //     var ctx = renderer.getContext();
    //     encoder.width = ctx.drawingBufferWidth;
    //     encoder.height = ctx.drawingBufferHeight;
    //     encoder.initialize();
    //     camera.layers.disable(0);

    //     function animate() {
    //       renderer.render(scene, camera);
    //       let f = easing(loop);
    //       cameraControls.rotateTo(f, polarAngle, false);
    //       var buf = new Uint8Array(
    //         ctx.drawingBufferWidth * ctx.drawingBufferHeight * 4
    //       );
    //       ctx.readPixels(
    //         0,
    //         0,
    //         ctx.drawingBufferWidth,
    //         ctx.drawingBufferHeight,
    //         ctx.RGBA,
    //         ctx.UNSIGNED_BYTE,
    //         buf
    //       );
    //       var halfHeight = (ctx.drawingBufferHeight / 2) | 0; // the | 0 keeps the result an int
    //       var bytesPerRow = ctx.drawingBufferWidth * 4;
    //       // make a temp buffer to hold one row
    //       var temp = new Uint8Array(ctx.drawingBufferWidth * 4);
    //       for (var y = 0; y < halfHeight; ++y) {
    //         var topOffset = y * bytesPerRow;
    //         var bottomOffset = (ctx.drawingBufferHeight - y - 1) * bytesPerRow;
    //         // make copy of a row on the top half
    //         temp.set(buf.subarray(topOffset, topOffset + bytesPerRow));
    //         // copy a row from the bottom half to the top
    //         buf.copyWithin(topOffset, bottomOffset, bottomOffset + bytesPerRow);
    //         // copy the copy of the top half row to the bottom half
    //         buf.set(temp, bottomOffset);
    //       }
    //       encoder.addFrameRgba(buf);

    //       if (currentLength < length) {
    //         requestAnimationFrame(animate);
    //         currentLength++;
    //       } else {
    //         encoder.finalize();
    //         const uint8Array = encoder.FS.readFile(encoder.outputFilename);
    //         download(
    //           URL.createObjectURL(new Blob([uint8Array], { type: "video/mp4" }))
    //         );
    //         encoder.delete();
    //         camera.layers.enable(0);
    //         cameraControls.enabled = true;
    //       }
    //     }
    //     animate();
    //   });
    // },
    cancel: function () {
      this.previewing = false;
      this.recording = false;
      this.currentLength = 0;
      this.loop = undefined;
    },
  },
  watch: {},
  mounted() {},
};
</script>

<style scoped>
.fade {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
}
</style>