<template>
  <div class="popup" v-if="show">
    <export-for-blender @modal="showModal" />
    <export-for-procreate @modal="showModal" />
    <ExportUSDZ v-if="isSafari" />
    <ExportGLB />
    <start-preview @preview="startPreview" />
  </div>
  <button
    class="toggle-menu"
    @click="show = !show"
    v-bind:style="[show === true ? 'z-index: 10' : '']"
  >
    <img src="@/assets/icons/share.svg" alt="Share your sketch" />
  </button>
  <div class="fade" v-if="show" @click="show = false"></div>
</template>

<script>
import ExportForBlender from "./MenuButtons/ExportForBlender.vue";
import ExportForProcreate from "./MenuButtons/ExportForProcreate.vue";
import StartPreview from "./MenuButtons/StartPreview.vue";
import ExportUSDZ from "./MenuButtons/ExportUSDZ.vue";
import ExportGLB from "./MenuButtons/ExportGLB.vue";

export default {
  name: "Import",
  props: {},
  components: {
    ExportForBlender,
    ExportForProcreate,
    StartPreview,
    ExportUSDZ,
    ExportGLB,
  },
  emits: ["modal-set", "preview"],
  data() {
    return {
      show: false,
      isSafari: false,
    };
  },
  methods: {
    hide: function () {
      this.show = false;
    },
    showModal: function (val) {
      this.$emit("modal-set", val);
      this.hide();
    },
    startPreview: function (val) {
      this.$emit("preview", val);
      this.hide();
    },
  },
  watch: {},
  mounted() {
    this.isSafari =
      navigator.vendor &&
      navigator.vendor.indexOf("Apple") > -1 &&
      navigator.userAgent &&
      navigator.userAgent.indexOf("CriOS") == -1 &&
      navigator.userAgent.indexOf("FxiOS") == -1;
  },
};
</script>

<style scoped>
.fade {
  position: absolute;
  z-index: 9;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
}

.toggle-menu {
  position: absolute;
  z-index: 5;
  bottom: 12px;
  right: 62px;
  width: 44px;
  height: 44px;
  background-color: white;
  filter: drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.08));
  border-radius: 22px;
  padding: 0;
}

div {
  position: absolute;
  z-index: 10;
  bottom: 64px;
  right: 68px;
  background-color: white;
  filter: drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.08));
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

button {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  align-content: center;
  background-color: rgba(0, 0, 0, 0);
  border: none;
  height: 44px;
  padding-left: 12px;
  padding-right: 12px;
  border-bottom: 1px solid #ffe8b3;
  font-size: 0.8em;
}

button:last-child,
.toggle-menu {
  border-bottom: none;
}
</style>