
<template>
  <div>
    <p class="self-destruct">
      This tutorial will self-destruct
      {{ 4 - count === 0 ? "the next" : "in " + countDown + "" }}
      {{ 4 - count > 1 ? "sessions" : "session" }}.
    </p>
    <h1>A quick intro to Penzil v 0.2</h1>

    <p>
      Penzil is a web application for sketching in 3d. It is primarily designed
      for touch screens but it works on desktop as well (although, if you are on
      desktop, I recommend you look into
      <a href="https://www.youtube.com/watch?v=c57qq2nE3B0" target="_blank"
        >Blender's Grease Pencil</a
      >).
    </p>
    <p>
      In Penzil, you draw on a "3d canvas". The "3d canvas" is the white surface
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
        src="https://www.youtube.com/embed/yeyGktOCNfk"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        class="video"
      ></iframe>
    </div>

    <h2>Rotate or move the “3d canvas”</h2>
    <p>
      You can move the "3d canvas" by grabbing the arrow heads at the center of
      the "3d canvas". You can rotate the "3d canvas" by grabbing the arcs. You
      grab arrow heads and arcs simply by tapping on them or clicking with the
      left mouse and dragging.
    </p>

    <div class="container">
      <iframe
        src="https://www.youtube.com/embed/sPfi9Alqugk"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        class="video"
      ></iframe>
    </div>

    <h2>Look around and pan</h2>
    <p>
      You can look around using two fingers, using a trackpad or a trackball.
      You can pan by swiping with three fingers or by pressing the spacebar and
      clicking with the left button.<br />You can also use the cube in the top
      right corner to look around. To position the camera precisely, tap on any
      of the faces of the cube.
    </p>

    <div class="container">
      <iframe
        src="https://www.youtube.com/embed/ON1rNnmjKbQ"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        class="video"
      ></iframe>
    </div>

    <h2>"3d canvas" shapes</h2>
    <p>
      Penzil comes with several "3d canvas" shapes. The default one is a flat
      plane but you can also pick: a cube, a cylinder, a sphere and a simplified
      head model. They all behave the same: draw on them and your lines will
      stick to the surface of the "3d canvas".
    </p>

    <div class="container">
      <iframe
        src="https://www.youtube.com/embed/iwI_lWCxttE"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        class="video"
      ></iframe>
    </div>

    <h2>"3d canvas" settings</h2>
    <p>
      There are several settings available for the "3d canvas". Most are
      self-explanatory: you can lock and unlock the movement of the "3d canvas"
      and you can show or hide it. But you can also switch the transformation
      tools between Move and Scale.<br />The Scale tool allows you to resize the
      "3d canvas". Note that depth transformations are not availalbe for flat
      surfaceses like the plane.<br />The snap toggle allows you to turn on or
      off snapping. The snapping allows you to move and rotate the "3d canvas"
      in fixed increments.<br />Finally the reset button resets all the
      transformations applies to the "3d canvas".
    </p>

    <div class="container">
      <iframe
        src="https://www.youtube.com/embed/cXAbjI5YEM0"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        class="video"
      ></iframe>
    </div>

    <h2>Stroke and fill settings</h2>
    <p>
      The round icon next to the draw tool at the top allows you to change the
      size and the color of the stroke, and the color of fill. Stroke and fill
      can also be toggled on independently.
      <br />When using fill, note that results may vary when drawing on surfaces
      that are not flat. To improve quality of the fill, try to draw the same
      shape but slower.
    </p>

    <div class="container">
      <iframe
        src="https://www.youtube.com/embed/8A0j1mu0i_Y"
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
      this.count = parseInt(window.localStorage.tut02);
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