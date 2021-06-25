<template>
  <button @click="startPreview">Make video</button>
</template>

<script>
export default {
  name: "StartPreview",
  props: {},
  data() {
    return {};
  },
  methods: {
    startPreview: function () {
      this.$emit("preview", true);
    },
  },
  watch: {},
  mounted() {},
};
</script>

<style scoped>
</style>