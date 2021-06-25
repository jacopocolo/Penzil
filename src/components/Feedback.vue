<template>
  <button @click="showFeedbackModal">Feedback</button>
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
      console.log("showFeedbackModal");
    },
  },
  watch: {},
  mounted() {},
};
</script>

<style scoped>
</style>