<template>
  <button @click="showAboutModal">About</button>
</template>

<script>
export default {
  name: "Import",
  props: {},
  data() {
    return {};
  },
  methods: {
    showAboutModal: function () {
      this.$emit("modal", { display: true, mode: "about" });
    },
  },
  watch: {},
  mounted() {},
};
</script>

<style scoped>
</style>