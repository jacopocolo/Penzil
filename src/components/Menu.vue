<template>
  <div>
    <Save />
    <Load />
  </div>
</template>

<script>
import Save from "./Save.vue";
import Load from "./Load.vue";

export default {
  name: "Import",
  props: {},
  components: {
    Load,
    Save,
  },
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
  bottom: 10px;
  left: 10px;
}
</style>