
<template>
  <div class="lineSettings">
    <span class="lineTools">
      <div class="toolbarLabel">Width</div>
      <span id="lineWidth">
        <span>
          <input
            type="radio"
            id="smallestLineWidth"
            value="1"
            name="smallestLineWidth"
            v-model="width"
          />
          <label for="smallestLineWidth">
            <span
              id="smallestLineWidthIndicator"
              class="indicator"
              v-bind:style="{ backgroundColor: color }"
            ></span>
          </label>
          <div></div>
        </span>
        <span>
          <input
            type="radio"
            id="smallLineWidth"
            value="3"
            name="smallLineWidth"
            v-model="width"
          />
          <label for="smallLineWidth">
            <span
              id="smallLineWidthIndicator"
              class="indicator"
              v-bind:style="{ backgroundColor: color }"
            ></span>
          </label>
          <div></div>
        </span>
        <span>
          <input
            type="radio"
            id="mediumLineWidth"
            value="10"
            name="mediumLineWidth"
            v-model="width"
          />
          <label for="mediumLineWidth"
            ><span
              id="mediumLineWidthIndicator"
              class="indicator"
              v-bind:style="{ backgroundColor: color }"
            ></span
          ></label>
          <div></div>
        </span>
        <span>
          <input
            type="radio"
            id="largeLineWidth"
            value="30"
            name="largeLineWidth"
            v-model="width"
          />
          <label for="largeLineWidth"
            ><span
              id="largeLineWidthIndicator"
              class="indicator"
              v-bind:style="{ backgroundColor: color }"
            ></span
          ></label>
          <div></div>
        </span>
      </span>

      <div class="toolbarLabel">Color</div>
      <span id="lineColor">
        <span>
          <input
            type="radio"
            id="lightestColor"
            value="lightest"
            name="lightestColor"
            v-model="color"
          />
          <label for="lightestColor">
            <span
              class="colorSelector indicator"
              id="lightestColorSelector"
            ></span>
          </label>
          <div></div>
        </span>
        <span>
          <input
            type="radio"
            id="lightColor"
            value="light"
            name="lightColor"
            v-model="color"
          />
          <label for="lightColor">
            <span
              class="colorSelector indicator"
              id="lightColorSelector"
            ></span>
          </label>
          <div></div>
        </span>
        <span>
          <input
            type="radio"
            id="mediumColor"
            value="medium"
            name="mediumColor"
            v-model="color"
          />
          <label for="mediumColor">
            <span
              class="colorSelector indicator"
              id="mediumColorSelector"
            ></span>
          </label>
          <div></div>
        </span>
        <span>
          <input
            type="radio"
            id="darkColor"
            value="dark"
            name="darkColor"
            v-model="color"
          />
          <label for="darkColor">
            <span class="colorSelector indicator" id="darkColorSelector"></span>
          </label>
          <div></div>
        </span>
      </span>

      <div class="toolbarLabel">Mirror</div>
      <span id="mirror">
        <span>
          <input
            type="radio"
            value="false"
            name="noMirror"
            id="noMirror"
            v-model="mirror"
          />
          <label for="noMirror">
            <span class="mirrorRadio indicator">No</span>
          </label>
          <div></div>
        </span>
        <span>
          <input
            type="radio"
            value="x"
            name="mirrorX"
            id="mirrorX"
            v-model="mirror"
          />
          <label for="mirrorX">
            <span class="mirrorRadio indicator">X</span>
          </label>
          <div></div>
        </span>
        <span>
          <input
            type="radio"
            value="y"
            name="mirrorY"
            id="mirrorY"
            v-model="mirror"
          />
          <label for="mirrorY">
            <span class="mirrorRadio indicator">Y</span>
          </label>
          <div></div>
        </span>
        <span>
          <input
            type="radio"
            value="z"
            name="mirrorZ"
            id="mirrorZ"
            v-model="mirror"
          />
          <label for="mirrorZ">
            <span class="mirrorRadio indicator">Z</span>
          </label>
          <div></div>
        </span>
      </span>
    </span>
  </div>
</template>

<script>
export default {
  name: "Modal",
  data() {
    return {
      width: 1,
      color: "lightest",
      mirror: false,
      smooth: 8,
      tipLength: 3,
    };
  },
  methods: {},
};
</script>

<style>
.lineSettings {
  background-color: rgba(
    var(--ui-bg-color-r),
    var(--ui-bg-color-g),
    var(--ui-bg-color-b),
    0.8
  );
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 8px;
  color: white;
  z-index: 5;
  display: block;
  border-radius: 6px;
  width: -moz-fit-content;
  width: fit-content;
}
</style>