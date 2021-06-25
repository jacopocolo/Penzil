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
      console.log("showAboutModal");
    },
  },
  watch: {},
  mounted() {},
};
</script>

<style scoped>
</style>