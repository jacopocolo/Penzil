<template>
  <div>
    <Save />
    <Load />
    <Export />
    <export-video />
  </div>
</template>

<script>
import Save from "./Save.vue";
import Load from "./Load.vue";
import Export from "./Export.vue";
import ExportVideo from "./ExportVideo.vue";

export default {
  name: "Import",
  props: {},
  components: {
    Load,
    Save,
    Export,
    ExportVideo,
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