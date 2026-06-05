<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getNextEvent } from '../api.js'
import EventCard from './EventCard.vue'

const event = ref(null)
const now = ref(Date.now())
let interval

onMounted(async () => {
  event.value = await getNextEvent()
  interval = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onUnmounted(() => clearInterval(interval))

const timeLeft = computed(() => {
  if (!event.value) return null
  const diff = new Date(event.value.scheduled_at) - now.value
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
})

const isLive = computed(() => {
  if (!event.value) return false
  return new Date(event.value.scheduled_at) <= now.value
})
</script>

<template>
  <div class="countdown-page">
    <h1>Warframe Pride Streams</h1>
    <template v-if="event">
      <div class="countdown-wrap">
        <div class="countdown">
          <div class="time-unit">
            <span class="number">{{ String(timeLeft.days).padStart(2, '0') }}</span>
            <span class="label">days</span>
          </div>
          <div class="time-unit">
            <span class="number">{{ String(timeLeft.hours).padStart(2, '0') }}</span>
            <span class="label">hours</span>
          </div>
          <div class="time-unit">
            <span class="number">{{ String(timeLeft.minutes).padStart(2, '0') }}</span>
            <span class="label">minutes</span>
          </div>
          <div class="time-unit">
            <span class="number">{{ String(timeLeft.seconds).padStart(2, '0') }}</span>
            <span class="label">seconds</span>
          </div>
        </div>
      </div>

      <p v-if="isLive" class="live-badge">LIVE NOW</p>

      <EventCard :event="event" />
    </template>

    <p v-else class="no-event">No upcoming streams scheduled</p>
  </div>
</template>

<style scoped>
.countdown-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 1.5rem 2rem;
  overflow-y: auto;
}

h1 {
  font-size: 1rem;
  color: var(--accent);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.countdown-wrap {
  position: relative;
}

.countdown-wrap::before {
  content: '';
  position: absolute;
  inset: -50%;
  background: linear-gradient(to right,
    var(--pride-red), var(--pride-orange), var(--pride-yellow),
    var(--pride-green), var(--pride-blue), var(--pride-purple)
  );
  opacity: 0.08;
  border-radius: 50%;
  filter: blur(40px);
  pointer-events: none;
}

.countdown {
  position: relative;
  display: flex;
  gap: 1rem;
}

.time-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.number {
  font-size: 3.5rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  min-width: 2ch;
  text-align: center;
  color: var(--text);
}

.label {
  font-size: 0.875rem;
  text-transform: uppercase;
  color: var(--text-dim);
  letter-spacing: 0.1em;
}

.live-badge {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ff4444;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

@media (min-width: 1600px) {
  .countdown-page {
    zoom: 1.35;
  }
}

.no-event {
  color: var(--text-dim);
  font-size: 1.125rem;
}
</style>
