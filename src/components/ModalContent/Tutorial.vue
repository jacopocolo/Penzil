
<template>
  <div>
    <p class="self-destruct">
      This tutorial will self-destruct
      {{ 4 - count === 0 ? "the next" : "in " + countDown + "" }}
      {{ 4 - count > 1 ? "sessions" : "session" }}.
    </p>
    <h1>A quick intro to Penzil v 0.1</h1>

    <p>
      Penzil is a web application for sketching in 3d. It is primarily designed
      for touch screens but it works on desktop as well (although, if you are on
      desktop, I recommend you look into
      <a href="https://www.youtube.com/watch?v=c57qq2nE3B0" target="_blank"
        >Blender's Grease Pencil</a
      >).
    </p>
    <p>
      In Penzil, you draw on a "3d canvas". The "3d canvas" is the white plane
      at the center of the screen. You can only draw on the canvas. By moving
      and rotating the canvas around, you can sketch in 3d.
    </p>
    <h2>Drawing and erasing</h2>
    <p>
      You can draw and erase with the left mouse button, finger or pen on top of
      the "3d canvas".
    </p>
    <p>
      Switch between drawing and erasing using the bar at the top of the screen.
    </p>

    <div class="container">
      <iframe
        src="https://www.youtube.com/embed/p_C60BlV6FA"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        class="video"
      ></iframe>
    </div>

    <h2>Rotate or move the “3d canvas”</h2>
    <p>
      You can move or rotate the "3d canvas" or the camera using the right mouse
      button or swiping with two (rotate) and three (move) fingers.
    </p>

    <p>
      If you are using fingers, the position of your fingers determines the axis
      of rotation or the plane of movement.
    </p>

    <div class="container">
      <iframe
        src="https://www.youtube.com/embed/fXDVgIhZilE"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        class="video"
      ></iframe>
    </div>

    <p>
      From certain points of view, some transformations may be impossible. Try
      moving your point of view somewhere else.
    </p>

    <h2>Look around</h2>
    <p>
      You can look around by selecting the eyes icon in the toolbar on the side.
      You can use your touchpad or scroll wheel to look around and right-click
      to zoom in and out. Or you can use two fingers to look around and zoom,
      and three fingers to pan the camera.
    </p>

    <div class="container">
      <iframe
        src="https://www.youtube.com/embed/pMdb62_gwP8"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        class="video"
      ></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: "Tutorial",
  data() {
    return {
      count: 0,
      countDown: 0,
    };
  },
  mounted() {
    if (localStorage.getItem("tut01") === null) {
      this.count = 0;
    } else {
      this.count = parseInt(window.localStorage.tut01);
    }
    this.countDown = -(this.count - 4);
  },
};
</script>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 95%;
  height: calc(100% + 1px);
}

h1 {
  font-size: 40px;
}

h2 {
  font-size: 18px;
  line-height: 120%;
}

p {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.6em;
}

.self-destruct {
  font-size: 16px;
  background-color: #ffe8b3;
  width: 100%;
  padding-left: 8px;
}

.container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%;
}

.video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>