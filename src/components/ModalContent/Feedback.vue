
<template>
  <div>
    <h1>Feedback</h1>
    <p>Thanks for trying out Penzil.</p>
    <p>
      There are two ways to send feedback: first of all, you can reach out
      <a href="http://twitter.com/jacopocolo" target="_blank"
        >directly to me on Twitter</a
      >. Otherwise, you can join the
      <a href="https://discord.gg/jvzjNpZGCk" target="_blank">Penzil Discord</a>
      server and post there. If you found something that you think it's a bug,
      you can also
      <a href="https://github.com/jacopocolo/Penzil/issues" target="_blank"
        >open a new issue on Github</a
      >.
    </p>
  </div>
</template>

<script>
export default {
  name: "Feedback",
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
  display: inline;
}

h1 > h2 {
  display: inline;
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