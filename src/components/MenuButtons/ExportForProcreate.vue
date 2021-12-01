<template>
  <button @click="showExportModal">Export for Procreate</button>
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
      this.$emit("modal", { display: true, mode: "procreate" });
    },
  },
  watch: {},
  mounted() {},
};
</script>

<style scoped>
</style>