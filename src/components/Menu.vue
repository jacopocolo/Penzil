<template>
  <div class="popup" v-if="show">
    <About @modal="showModal" />
    <Feedback @modal="showModal" />
    <Save />
    <Load ref="load" />
  </div>
  <button class="toggle-menu" @click="show = !show">
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14.5" cy="21.5" r="2" fill="#1C1C1E" stroke="black" />
      <circle cx="22.5" cy="21.5" r="2" fill="#1C1C1E" stroke="black" />
      <circle cx="30.5" cy="21.5" r="2" fill="#1C1C1E" stroke="black" />
    </svg>
  </button>
  <div class="fade" v-if="show" @click="show = false"></div>
  <feedback />
</template>

<script>
import About from "./MenuButtons/About.vue";
import Save from "./MenuButtons/Save.vue";
import Load from "./MenuButtons/Load.vue";
import Feedback from "./MenuButtons/Feedback.vue";

export default {
  name: "Import",
  props: {},
  components: {
    About,
    Load,
    Save,
    Feedback,
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
  z-index: 7;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
}

.toggle-menu {
  position: absolute;
  z-index: 8;
  bottom: 12px;
  right: 12px;
  width: 44px;
  height: 44px;
  background-color: white;
  filter: drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.08));
  border-radius: 22px;
  padding: 0;
}

div {
  position: absolute;
  z-index: 8;
  bottom: 64px;
  right: 12px;
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