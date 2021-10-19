<template>
  <div>
    <iframe
      src="https://docs.google.com/forms/d/e/1FAIpQLSccJWlem-HLrgscUJLXLqKpFXOC3LnDkUUJOoF7Saxrq3gNKQ/viewform?embedded=true"
      width="100%"
      height="2478"
      frameborder="0"
      marginheight="0"
      marginwidth="0"
      >Loading…</iframe
    >
  </div>
</template>

<script>
export default {
  name: "Survey",
  data() {
    return {};
  },
  mounted() {},
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
