<template>
  <div
    v-bind:style="{ top: x + 'px', left: y + 'px' }"
    v-bind:class="{ hide: !display }"
  >
    <span>
      <span>
        <input
          type="radio"
          id="translate"
          name="transformations"
          value="translate"
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
        /><label for="rotate"> Rotate</label>
        <div></div>
      </span>
      <span>
        <input
          type="radio"
          id="scale"
          name="transformations"
          value="scale"
        /><label for="scale"> Scale</label>
        <div></div>
      </span>
    </span>
    <!-- <button v-if="selectedTool === 'select'" id="duplicate" class="button">
      Duplicate
    </button> -->
  </div>
</template>

<script>
//

export default {
  name: "TransformToolbar",
  props: { x: Number, y: Number, display: Boolean },
  data() {
    return {};
  },
  methods: {},
  watch: {},
  mounted() {},
};
</script>

<style scoped>
div {
  position: absolute;
  z-index: 2;
  background-color: white;
}

.hide {
  display: none;
}
</style>