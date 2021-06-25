
<template>
  <div v-if="modalProp.display" class="fade" @click.self="hideModal">
    <div class="modal">
      <Welcome v-if="modalProp.mode === 'about'" />
      <Feedback v-if="modalProp.mode === 'feedback'" />
      <ExportForBlender v-if="modalProp.mode === 'export'" />
    </div>
  </div>
</template>

<script>
import Welcome from "./ModalContent/Welcome.vue";
import Feedback from "./ModalContent/Feedback.vue";
import ExportForBlender from "./ModalContent/ExportForBlender.vue";

export default {
  name: "VideoExportPreview",
  components: {
    Welcome,
    Feedback,
    ExportForBlender,
  },
  data() {
    return {};
  },
  props: {
    modalProp: Object,
  },
  methods: {
    hideModal: function () {
      this.$emit("modal-set", { show: false, mode: "about" });
    },
  },
  watch: {
    modalProp: function (val) {
      console.log(val);
    },
  },
};
</script>

<style>
.fade {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  width: 40%;
  height: 40%;
  background-color: white;
  filter: drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.08));
  border-radius: 8px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  touch-action: none;
  padding: 32px;
  overflow: scroll;
}
</style>