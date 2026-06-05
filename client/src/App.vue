<script setup>
import { RouterView } from 'vue-router'
import ProgressPrideBanner from './components/ProgressPrideBanner.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <ProgressPrideBanner />
  <RouterView />
  <AppFooter />
</template>
