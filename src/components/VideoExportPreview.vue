
<template>
  <div v-if="previewing" class="fade">
    <div class="fade-controls">
      <button @click="cancel()">Cancel</button>
      <span class="rightAlign">
        <input
          type="radio"
          name="360"
          value="360"
          id="360"
          v-model="loop"
          :disabled="recording"
        />
        <label for="360">360</label>
        <input
          type="radio"
          name="bf"
          value="bf"
          id="bf"
          v-model="loop"
          :disabled="recording"
        />
        <label for="bf">Back and forth</label>
        <button @click="startRecording()" :disabled="recording" v>
          {{ !recording ? "Start recording" : "Recording..." }}
        </button>
      </span>
      <span v-if="recording"
        >Recording frame {{ currentLength }} of {{ length }}</span
      >
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import { renderer, camera, scene, cameraControls } from "../App.vue";
import * as HME from "h264-mp4-encoder";

export default {
  name: "VideoExport",
  components: {},
  data() {
    return {
      previewing: false,
      recording: false,
      loop: "360",
      length: 240, //in frames
      currentLength: 0, //current frame
      startAzimuthAngle: undefined,
      polarAngle: undefined,
      pos: [],
    };
  },
  emits: ["stop-previewing"],
  props: {
    show: Boolean,
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
          (this.startAzimuthAngle / 100) * 5,
          this.length
        );
      }
    },
    animate(ctx, encoder) {
      if (!this.previewing) {
        return;
      }
      renderer.render(scene, camera);
      let f = this.easing(this.loop);
      cameraControls.rotateTo(f, this.polarAngle, false);
      if (!this.recording) {
        //animate in loop
        if (this.currentLength < this.length) {
          requestAnimationFrame(this.animate);
          this.currentLength++;
        } else {
          this.currentLength = 0;
          requestAnimationFrame(this.animate);
          //cameraControls.enabled = true;
        }
      } else {
        //record and exit
        //only record after the fist frame, it's needed to let the camera riposition properly
        if (this.currentLength > 0) {
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
        }

        if (this.currentLength < this.length) {
          requestAnimationFrame(() => {
            this.animate(ctx, encoder);
          });
          this.currentLength++;
        } else {
          encoder.finalize();
          const uint8Array = encoder.FS.readFile(encoder.outputFilename);
          this.download(
            URL.createObjectURL(new Blob([uint8Array], { type: "video/mp4" }))
          );
          encoder.delete();
          this.cancel();
        }
      }
    },
    startRecording() {
      // cameraControls.rotateTo(this.startAzimuthAngle, this.polarAngle, false);
      // renderer.render(scene, camera);
      HME.createH264MP4Encoder().then((encoder) => {
        let ctx = renderer.getContext();
        encoder.width = ctx.drawingBufferWidth;
        encoder.height = ctx.drawingBufferHeight;
        encoder.initialize();
        this.recording = true;
        this.currentLength = 0;
        this.animate(ctx, encoder);
      });
    },
    startPreview() {
      // this.$emit("show", false);
      cameraControls.normalizeRotations();
      this.startAzimuthAngle = cameraControls.azimuthAngle;
      this.polarAngle = cameraControls.polarAngle;
      this.previewing = true;
      cameraControls.dampingFactor = 0.5;
      // cameraControls.enabled = false;
      camera.layers.disable(0);
      this.animate();
    },
    download(url, filename) {
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename || "download";
      anchor.click();
    },
    cancel: function () {
      this.previewing = false;
      this.recording = false;
      this.currentLength = 0;
      this.pos = [];
      camera.layers.enable(0);
      this.loop = "360";
      cameraControls.dampingFactor = 0.5;
      cameraControls.rotateTo(this.startAzimuthAngle, this.polarAngle, true);
      this.startAzimuthAngle = undefined;
      this.polarAngle = undefined;
      // cameraControls.enabled = true;
      setTimeout(() => {
        cameraControls.dampingFactor = 20;
        cameraControls.normalizeRotations();
      }, 100);
      renderer.render(scene, camera);
      this.$emit("stop-previewing", false);
    },
  },
  watch: {
    show: function (val) {
      if (val === true) {
        this.startPreview();
      }
    },
    loop: function () {
      this.currentLength = 0;
    },
  },
  mounted() {},
};
</script>

<style>
.fade {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fade-controls {
  background-color: white;
  color: black;
  margin: 0 auto;
  position: absolute;
  bottom: 0px;
  padding: 10px;
  width: 100vw;
  z-index: 5;
}

.rightAlign > label {
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

button {
  align-content: center;
  background-color: rgba(0, 0, 0, 0);
  border: none;
  height: 44px;
  padding-left: 16px;
  padding-right: 16px;
  margin-right: 2px;
}

.rightAlign {
  float: right;
  display: flex;
}
</style>