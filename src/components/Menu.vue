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
  right: 10px;
  background-color: white;
  filter: drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.08));
  height: 44px;
  border-radius: 8px;
}

button {
  align-content: center;
  background-color: rgba(0, 0, 0, 0);
  border: none;
  height: 44px;
  padding-left: 16px;
  padding-right: 16px;
  border-right: 2px solid #ffe8b3;
}
</style>