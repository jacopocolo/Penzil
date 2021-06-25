<template>
  <div
    class="transform-toolbar"
    v-bind:style="[
      location == 'above'
        ? {
            top: 'calc(' + posTop + 'px - 100px',
            left: 'calc(' + posLeft + 'px - 110px)',
          }
        : {
            top: 'calc(' + posTop + 'px + 100px',
            left: 'calc(' + posLeft + 'px - 110px)',
          },
    ]"
    v-bind:class="{ hide: !display }"
  >
    <span>
      <span>
        <input
          type="radio"
          id="translate"
          name="transformations"
          value="translate"
          v-model="selectedTransformation"
          checked
        /><label for="translate"> Move</label>
        <div></div>
      </span>
      <span>
        <input
          type="radio"
          id="rotate"
          name="transformations"
          value="rotate"
          v-model="selectedTransformation"
        /><label for="rotate"> Rotate</label>
        <div></div>
      </span>
      <span>
        <input
          type="radio"
          id="scale"
          name="transformations"
          value="scale"
          v-model="selectedTransformation"
        /><label for="scale"> Scale</label>
        <div></div>
      </span>
    </span>

    <button v-bind:class="{ hide: selectedTool == 'model' }" @click="duplicate">
      Duplicate
    </button>
  </div>
</template>

<script>
import { select } from "./select.js";
import { scene, renderer, camera } from "../App.vue";

export default {
  name: "TransformToolbar",
  props: {
    top: Number,
    left: Number,
    location: String,
    display: Boolean,
    selectedTool: String,
  },
  data() {
    return {
      selectedTransformation: "translate",
      posTop: 0,
      posLeft: 0,
    };
  },
  methods: {
    duplicate: function () {
      select.s.duplicate();
    },
  },
  watch: {
    selectedTransformation: function (val) {
      if (this.selectedTool == "select") {
        select.s.controls.mode = val;
        //this maintains the selection from the last used transformation
        this.selectedTransformation = val;
        select.transformMode = val;
        select.s.helper.update();
      }
      if (this.selectedTool == "model") {
        let controls = scene.getObjectByName("canvasTransformControls");
        console.log(controls);
        this.selectedTransformation = val;
        controls.mode = this.selectedTransformation;
      }
      renderer.render(scene, camera);
    },
    display: function (val) {
      if (val) {
        //this maintains the selection from the last used transformation
        if (this.selectedTool == "select") {
          select.s.controls.mode = this.selectedTransformation;
        }
        if (this.selectedTool == "model") {
          let controls = scene.getObjectByName("canvasTransformControls");
          controls.mode = this.selectedTransformation;
        }
      }
    },
    top: function (val) {
      //this needs to be improved further

      if (val >= window.innerHeight) {
        this.posTop = window.innerHeight - 60;
      } else {
        this.posTop = val;
      }
    },
    left: function (val) {
      if (val >= window.innerWidth) {
        this.posLeft = window.innerWidth;
      } else {
        this.posLeft = val;
      }
    },
  },
  mounted() {},
};
</script>

<style scoped>
.transform-toolbar {
  padding: 8px;
  position: absolute;
  z-index: 999;
  background-color: black;
  color: white;
  width: 220px;
  border-radius: 5px;
  align-content: center;
  display: flex;
  flex-direction: row;
}

.transform-toolbar > span {
  display: flex;
}

button {
  width: 100%;
}

.hide {
  display: none;
}
</style>