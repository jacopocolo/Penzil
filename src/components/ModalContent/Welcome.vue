
<template>
  <div>
    <h1>Penzil</h1>
    <h2>Ver 0.2</h2>

    <h2>
      Penzil is a 3d sketching app designed and developed by
      <a href="http://twitter.com/jacopocolo" target="_blank">Jacopo Colò</a>
    </h2>
    <p>
      Penzil is built on top of the work of many people: the whole community
      behind
      <a href="https://github.com/vuejs/vue" target="_blank">vue.js</a>, the
      whole community behind
      <a href="https://github.com/mrdoob/three.js/" target="_blank">three.js</a
      >,
      <a href="https://github.com/spite/THREE.MeshLine" target="_blank"
        >THREE.Meshline</a
      >
      by spite,
      <a href="https://github.com/yomotsu/camera-controls" target="_blank"
        >camera controls</a
      >
      by yomotsu,
      <a
        href="https://github.com/Fyrestar/THREE.InfiniteGridHelper"
        target="_blank"
        >InfiniteGridHelper</a
      >
      by Fyrestar,
      <a
        href="https://github.com/ArthurClemens/Javascript-Undo-Manager"
        target="_blank"
        >Undo-Manager</a
      >
      by ArthurClemens,
      <a
        href="https://github.com/TrevorSundberg/h264-mp4-encoder"
        target="_blank"
        >h264-mp4-encoder</a
      >
      by TrevorSundberg. This project would have been impossible without the
      work of these people.
    </p>
  </div>
</template>

<script>
export default {
  name: "Welcome",
  data() {
    return {};
  },
};
</script>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

h1 {
  font-size: 60px;
}

h2 {
  font-size: 18px;
}

p {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5em;
}
</style>