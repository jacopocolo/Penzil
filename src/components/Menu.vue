<template>
  <div class="popup" v-if="show">
    <About @modal="showModal" />
    <Feedback @modal="showModal" />
    <Save />
    <Load />
    <Export @modal="showModal" />
    <start-preview @preview="startPreview" />
  </div>
  <button class="toggle-menu" @click="show = !show">···</button>
  <div class="fade" v-if="show" @click="show = false"></div>
  <feedback />
</template>

<script>
import About from "./MenuButtons/About.vue";
import Save from "./MenuButtons/Save.vue";
import Load from "./MenuButtons/Load.vue";
import Export from "./MenuButtons/Export.vue";
import StartPreview from "./MenuButtons/StartPreview.vue";
import Feedback from "./MenuButtons/Feedback.vue";

export default {
  name: "Import",
  props: {},
  components: {
    About,
    Load,
    Save,
    Export,
    StartPreview,
    Feedback,
  },
  emits: ["modal-set", "preview"],
  data() {
    return {
      show: false,
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
  mounted() {},
};
</script>

<style scoped>
.fade {
  position: absolute;
  z-index: 5;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0);
}

.toggle-menu {
  position: absolute;
  z-index: 6;
  bottom: 10px;
  right: 10px;
  background-color: white;
  filter: drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.08));
  border-radius: 8px;
}

div {
  position: absolute;
  z-index: 6;
  bottom: 60px;
  right: 10px;
  background-color: white;
  filter: drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.08));
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

button {
  align-content: center;
  background-color: rgba(0, 0, 0, 0);
  border: none;
  height: 44px;
  padding-left: 16px;
  padding-right: 16px;
  border-bottom: 1px solid #ffe8b3;
}

button:last-child {
  border-bottom: none;
}
</style>