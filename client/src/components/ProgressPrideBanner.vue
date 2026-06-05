<script setup>
</script>

<template>
  <div class="pride-banner" aria-hidden="true" />
</template>

<style scoped>
.pride-banner {
  height: 40px;
  flex-shrink: 0;
  background: linear-gradient(to right,
    var(--pride-red) 0%, var(--pride-red) 9.09%,
    var(--pride-orange) 9.09%, var(--pride-orange) 18.18%,
    var(--pride-yellow) 18.18%, var(--pride-yellow) 27.27%,
    var(--pride-green) 27.27%, var(--pride-green) 36.36%,
    var(--pride-blue) 36.36%, var(--pride-blue) 45.45%,
    var(--pride-purple) 45.45%, var(--pride-purple) 54.54%,
    var(--pride-white) 54.54%, var(--pride-white) 63.63%,
    var(--pride-pink) 63.63%, var(--pride-pink) 72.72%,
    var(--pride-cyan) 72.72%, var(--pride-cyan) 81.81%,
    var(--pride-brown) 81.81%, var(--pride-brown) 90.90%,
    var(--pride-black) 90.90%, var(--pride-black) 100%
  );
}
</style>
