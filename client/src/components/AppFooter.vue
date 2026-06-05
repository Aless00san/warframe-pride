<script setup>
</script>

<template>
  <footer class="app-footer">
    <div class="footer-strip" aria-hidden="true" />
    <p class="footer-text">Warframe Pride 2026</p>
  </footer>
</template>

<style scoped>
.app-footer {
  flex-shrink: 0;
  text-align: center;
  padding-bottom: 1rem;
}

.footer-strip {
  height: 4px;
  background: linear-gradient(to right,
    var(--pride-red), var(--pride-orange), var(--pride-yellow),
    var(--pride-green), var(--pride-blue), var(--pride-purple)
  );
  margin-bottom: 0.75rem;
}

.footer-text {
  font-size: 0.75rem;
  color: var(--text-dim);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
</style>
