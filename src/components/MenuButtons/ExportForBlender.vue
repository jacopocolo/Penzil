<template>
  <button @click="showExportModal">Export for Blender</button>
</template>

<script>
export default {
  name: "Export",
  props: {},
  data() {
    return {};
  },
  methods: {
    showExportModal: function () {
      this.$emit("modal", { display: true, mode: "blender" });
    },
  },
  watch: {},
  mounted() {},
};
</script>

<style scoped>
</style>