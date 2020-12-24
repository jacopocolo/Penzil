
<template>
  <div v-if="show" class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div v-if="mode == 'modal'" class="modal-body">
          <div class="modal-button-close" @click="close()">Close</div>

          <slot name="body">
            <div class="modal-header">
              <slot name="header">
                {{ title }}
              </slot>
            </div>

            <video
              style="margin-bottom: 16px"
              :src="source"
              controls
              autoplay
              loop
            ></video>
            <a class="primaryButton" download="video.mp4" :href="helptext"
              >Download</a
            >
          </slot>
        </div>

        <div v-else class="modal-body modal-centered">
          <div class="modal-header">
            <slot name="header">
              {{ title }}
            </slot>
          </div>

          <div class="modal-helptext">
            <slot name="helptext">
              {{ helptext }}
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  data() {
    return {
      show: false,
      mode: "modal",
      title: "here's your file",
      helptext: "",
      source: "",
    };
  },
  methods: {
    close: function () {
      this.show = false;
    },
  },
};
</script>

<style>
/*MODAL*/
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 40%;
  max-width: 600px;
  height: auto;
  margin: 0px auto;
  padding: 14px;
  /* background-color: var(--ui-bg-color); */
  color: #ffffff;
  border-radius: 2px;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33); */
  box-sizing: content-box;
  transition: all 0.3s ease;
  font-weight: 400;
  -webkit-touch-callout: default;
  -webkit-user-select: default;
  -khtml-user-select: default;
  -moz-user-select: default;
  -ms-user-select: default;
}

.modal-body {
  display: inline-block;
  -webkit-touch-callout: default;
  -webkit-user-select: default;
  -khtml-user-select: default;
  -moz-user-select: default;
  -ms-user-select: default;
}

.modal-centered {
  width: 100%;
  text-align: center;
  margin: 0;
}

.modal-header {
  font-size: 1em;
  line-height: 1.3em;
  display: block;
  margin-bottom: 1em;
}

.modal-helptext {
  font-size: 1em;
  line-height: 1.3em;
  display: block;
  margin-bottom: 1em;
}

.modal-centered .modal-helptext {
  margin-bottom: 0;
}

.modal-left-column {
  width: 50%;
  float: left;
}

.modal-left-column > img {
  max-width: 90%;
  border: 1px solid white;
}

.modal-right-column {
  width: 50%;
  float: right;
}

.modal-button {
  margin-top: 3em;
  width: 50%;
  float: right;
}

.modal-button-close {
  position: absolute;
  top: 16px;
  right: 16px;
  color: white;
  height: 40px;
}

.modal-footer {
  height: fit-content;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>