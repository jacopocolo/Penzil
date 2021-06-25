<template>
  <div
    @touchstart="handleInput"
    @touchmove="handleInput"
    @touchend="handleInput"
    @mousedown="handleInput"
    @mousemove="handleInput"
    @mouseup="handleInput"
    class="display-touches"
  >
    <svg
      v-if="displayTouches"
      class="cursor"
      :style="{
        top: 0 - 52 / 2 + 'px',
        left: 0 - 52 / 2 + 'px',
      }"
      width="52"
      height="52"
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="26" cy="24" r="22" fill="url(#paint0_radial)" />
      <g filter="url(#filter0_d)">
        <circle
          cx="26"
          cy="24"
          r="22"
          stroke="white"
          stroke-opacity="0.38"
          stroke-width="0.5"
        />
      </g>
      <defs>
        <filter
          id="filter0_d"
          x="0.75"
          y="0.75"
          width="50.5"
          height="50.5"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="1.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>
        <radialGradient
          id="paint0_radial"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(26 24) rotate(90) scale(22)"
        >
          <stop stop-color="white" stop-opacity="0" />
          <stop offset="1" stop-color="white" stop-opacity="0.42" />
        </radialGradient>
      </defs>
    </svg>
  </div>
</template>

<script>
export default {
  name: "DisplayTouches",
  data() {
    return {
      displayTouches: true,
      touches: [],
    };
  },
  props: {},
  onStart: function (event) {
    for (let i = 0; i < event.touches.length; i++) {
      this.touches.push(event.touches[i]);
    }
  },
  onMove: function (event) {
    for (let i = 0; i < event.touches.length; i++) {
      this.touches.push(event.touches[i]);
    }
  },
  onEnd: function (event) {
    if (event.touches.length == 0) {
      this.touches = [];
    }
  },
  handleInput: function (event) {
    this.updateMouseCoordinates(event);

    switch (event.type) {
      case "touchstart":
        this.onStart(event);
        break;
      case "touchmove":
        this.onMove(event);
        break;
      case "touchend":
        this.onEnd(event);
        break;
      default:
      //nothing;
    }
  },
  watch: {
    touches: function (val) {
      console.log(val);
    },
  },
  mounted() {},
};
</script>

<style>
.display-touches {
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0);
  position: absolute;
  top: 0px;
  right: 0px;
}

.cursor {
  position: absolute;
  z-index: 6;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  touch-action: none;
}

#touches {
  width: 100%;
  height: 100%;
}
</style>