<script setup>
</script>

<template>
  <div class="pride-banner" aria-hidden="true" />
</template>

<style scoped>
.pride-banner {
  height: 40px;
  flex-shrink: 0;
  margin: 0;
  background:
    linear-gradient(to bottom,
      transparent 60%,
      rgba(15,15,26,0.262) 67.6%,
      rgba(15,15,26,0.459) 73.6%,
      rgba(15,15,26,0.618) 78.8%,
      rgba(15,15,26,0.722) 82.6%,
      rgba(15,15,26,0.806) 86%,
      rgba(15,15,26,0.874) 89.2%,
      rgba(15,15,26,0.925) 92.1%,
      rgba(15,15,26,0.958) 94.4%,
      rgba(15,15,26,0.979) 96.4%,
      rgba(15,15,26,0.992) 98.1%,
      rgba(15,15,26,0.998) 99.3%,
      var(--bg) 100%),
    linear-gradient(to right,
      var(--pride-white) 0%, var(--pride-white) 9.09%,
      var(--pride-pink) 9.09%, var(--pride-pink) 18.18%,
      var(--pride-cyan) 18.18%, var(--pride-cyan) 27.27%,
      var(--pride-brown) 27.27%, var(--pride-brown) 36.36%,
      var(--pride-black) 36.36%, var(--pride-black) 45.45%,
      var(--pride-red) 45.45%, var(--pride-red) 54.54%,
      var(--pride-orange) 54.54%, var(--pride-orange) 63.63%,
      var(--pride-yellow) 63.63%, var(--pride-yellow) 72.72%,
      var(--pride-green) 72.72%, var(--pride-green) 81.81%,
      var(--pride-blue) 81.81%, var(--pride-blue) 90.90%,
      var(--pride-purple) 90.90%, var(--pride-purple) 100%
    );
  background-blend-mode: normal;
}
</style>
