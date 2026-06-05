<script setup>
defineProps({
  event: { type: Object, required: true },
})

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}
</script>

<template>
  <div class="event-card">
    <h2>{{ event.title }}</h2>
    <p class="date">{{ formatDate(event.scheduled_at) }}</p>
    <p v-if="event.description" class="description">{{ event.description }}</p>
    <a
      v-if="event.twitch_url"
      :href="event.twitch_url"
      target="_blank"
      rel="noopener noreferrer"
      class="twitch-link"
    >
      Watch on Twitch
    </a>
  </div>
</template>

<style scoped>
.event-card {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.5rem;
  max-width: 480px;
  width: 100%;
  text-align: center;
  overflow: hidden;
}

.event-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom,
    var(--pride-red), var(--pride-orange), var(--pride-yellow),
    var(--pride-green), var(--pride-blue), var(--pride-purple)
  );
}

h2 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.date {
  font-size: 0.875rem;
  color: var(--text-dim);
  margin-bottom: 0.75rem;
}

.description {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.twitch-link {
  display: inline-block;
  background: #9146ff;
  color: white;
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-weight: 600;
  transition: background 0.2s;
}
.twitch-link:hover {
  background: #772ce8;
  text-decoration: none;
}
</style>
