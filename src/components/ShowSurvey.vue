<template>
  <button v-if="show" class="soapbar" @click="showSurvey">Evaluate this experiment</button>
</template>

<script>
export default {
  name: "BottomCenterButton",
  components: {},
  emits: ["showSurvey"],
  data() {
    return {};
  },
  props: {
    show: Boolean,
  },
  methods: {
    showSurvey: function () {
      this.$emit("modal-set", { display: true, mode: "survey" });
    },
  },
  watch: {},
  mounted() {},
};
</script>

<style scoped>
.soapbar {
  position: absolute;
  z-index: 6;
  width: 150px;
  bottom: 12px;
  right: calc(50% - 150px / 2);
  background-color: white;
  filter: drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.08));
  border-radius: 8px;
}

button {
  align-content: center;
  background-color: rgba(0, 0, 0, 0);
  border: none;
  height: 44px;
  padding-left: 16px;
  padding-right: 16px;
  align-content: center;
  align-items: center;
  justify-content: center;
}
</style>
