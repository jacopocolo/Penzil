<template>
  <div
    v-bind:style="[
      location == 'above'
        ? {
            top: 'calc(' + top + 'px - 60px',
            left: 'calc(' + left + 'px - 110px)',
          }
        : {
            top: 'calc(' + top + 'px + 10px',
            left: 'calc(' + left + 'px - 110px)',
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

    <button @click="duplicate">Duplicate</button>
  </div>
</template>

<script>
import { select } from "./select.js";
import { scene, renderer, camera } from "../App.vue";

export default {
  name: "TransformToolbar",
  props: { top: Number, left: Number, location: String, display: Boolean },
  data() {
    return {
      selectedTransformation: "translate",
    };
  },
  methods: {
    duplicate: function () {
      select.s.duplicate();
    },
  },
  watch: {
    selectedTransformation: function (val) {
      select.s.controls.mode = val;
      //this maintains the selection from the last used transformation
      this.selectedTransformation = val;
      select.transformMode = val;
      select.s.helper.update();
      renderer.render(scene, camera);
    },
    display: function (val) {
      if (val) {
        //this maintains the selection from the last used transformation
        select.s.controls.mode = this.selectedTransformation;
      }
    },
  },
  mounted() {},
};
</script>

<style scoped>
div {
  position: absolute;
  z-index: 2;
  background-color: black;
  color: white;
  width: 220px;
  border-radius: 5px;
  align-content: center;
}

button {
  width: 100%;
}

.hide {
  display: none;
}
</style>