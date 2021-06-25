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
    showFeedbackModal: function () {
      this.$emit("modal", { display: true, mode: "feedback" });
    },
  },
  watch: {},
  mounted() {},
};
</script>

<style scoped>
</style>