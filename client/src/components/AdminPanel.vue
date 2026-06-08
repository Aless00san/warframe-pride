<script setup>
import { ref, onMounted } from 'vue'
import { getEvents, createEvent, updateEvent, deleteEvent, endEvent } from '../api.js'

const apiKeyInput = ref('')
const apiKey = ref(sessionStorage.getItem('wf_api_key') || '')
const events = ref([])
const loading = ref(false)
const error = ref('')

const form = ref({ title: '', description: '', scheduled_at: '', twitch_url: '', timezone_offset: '-04:00' })
const editingId = ref(null)

async function fetchEvents() {
  events.value = await getEvents()
}

async function submitKey() {
  if (!apiKeyInput.value) return
  apiKey.value = apiKeyInput.value
  sessionStorage.setItem('wf_api_key', apiKey.value)
  loading.value = true
  error.value = ''
  try {
    await fetchEvents()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    await fetchEvents()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function submit() {
  error.value = ''
  const payload = {
    title: form.value.title,
    description: form.value.description,
    scheduled_at: form.value.scheduled_at,
    twitch_url: form.value.twitch_url,
    timezone_offset: form.value.timezone_offset,
  }
  try {
    if (editingId.value) {
      await updateEvent(editingId.value, payload, apiKey.value)
    } else {
      await createEvent(payload, apiKey.value)
    }
    form.value = { title: '', description: '', scheduled_at: '', twitch_url: '', timezone_offset: '-04:00' }
    editingId.value = null
    await fetchEvents()
  } catch (e) {
    error.value = e.message
  }
}

function edit(event) {
  const match = event.scheduled_at.match(/[+-]\d{2}:\d{2}$/)
  editingId.value = event.id
  form.value = {
    title: event.title,
    description: event.description,
    scheduled_at: event.scheduled_at.slice(0, 16),
    twitch_url: event.twitch_url,
    timezone_offset: match ? match[0] : '-04:00',
  }
}

function cancelEdit() {
  editingId.value = null
  form.value = { title: '', description: '', scheduled_at: '', twitch_url: '' }
}

async function remove(id) {
  if (!confirm('Delete this event?')) return
  error.value = ''
  try {
    await deleteEvent(id, apiKey.value)
    await fetchEvents()
  } catch (e) {
    error.value = e.message
  }
}

async function end(id) {
  if (!confirm('Mark this stream as ended?')) return
  error.value = ''
  try {
    await endEvent(id, apiKey.value)
    await fetchEvents()
  } catch (e) {
    error.value = e.message
  }
}

onMounted(() => {
  if (apiKey.value) load()
})
</script>

<template>
  <div class="admin-panel">
    <router-link to="/" class="back-link">&larr; Back to countdown</router-link>
    <h1>Admin Panel</h1>

    <div v-if="!apiKey" class="key-prompt">
      <p>Enter your API key to manage events:</p>
      <input v-model="apiKeyInput" type="password" placeholder="API key" @keyup.enter="submitKey" />
      <button :disabled="loading" @click="submitKey">
        {{ loading ? 'Loading...' : 'Submit' }}
      </button>
    </div>

    <template v-else>
      <div v-if="loading" class="loading-panel">Loading events...</div>
      <template v-else>
        <p v-if="error" class="error">{{ error }}</p>

        <form @submit.prevent="submit" class="event-form">
          <h2>{{ editingId ? 'Edit Event' : 'New Event' }}</h2>
          <input v-model="form.title" placeholder="Title" required />
          <textarea v-model="form.description" placeholder="Description" rows="3"></textarea>
          <label class="field-label">
            <span>Scheduled at</span>
            <input v-model="form.scheduled_at" type="datetime-local" required />
          </label>
          <label class="field-label">
            <span>Timezone</span>
            <select v-model="form.timezone_offset">
              <option value="-10:00">HST (UTC-10)</option>
              <option value="-09:00">AKT (UTC-9)</option>
              <option value="-08:00">PT (UTC-8)</option>
              <option value="-07:00">MT (UTC-7)</option>
              <option value="-06:00">CT (UTC-6)</option>
              <option value="-05:00">ET (UTC-5)</option>
              <option value="-04:00">ET (UTC-4, EDT)</option>
              <option value="+00:00">UTC</option>
              <option value="+01:00">CET (UTC+1)</option>
              <option value="+02:00">EET (UTC+2)</option>
              <option value="+03:00">MSK (UTC+3)</option>
              <option value="+05:30">IST (UTC+5:30)</option>
              <option value="+08:00">CST (UTC+8)</option>
              <option value="+09:00">JST (UTC+9)</option>
              <option value="+10:00">AET (UTC+10)</option>
              <option value="+12:00">NZST (UTC+12)</option>
            </select>
          </label>
          <input v-model="form.twitch_url" placeholder="Twitch URL (optional)" />
          <div class="form-actions">
            <button type="submit">{{ editingId ? 'Update' : 'Create' }}</button>
            <button v-if="editingId" type="button" class="cancel" @click="cancelEdit">Cancel</button>
          </div>
        </form>

        <div class="event-list">
          <div v-for="ev in events" :key="ev.id" class="event-row" :class="{ ended: ev.ended }">
            <div class="event-info">
              <strong>{{ ev.title }}</strong>
              <span class="ev-date">{{ new Date(ev.scheduled_at).toLocaleString() }}</span>
              <span v-if="ev.ended" class="ended-badge">Ended</span>
            </div>
            <div class="event-actions">
              <button v-if="!ev.ended" class="end" @click="end(ev.id)">End Stream</button>
              <button class="edit" @click="edit(ev)">Edit</button>
              <button class="delete" @click="remove(ev.id)">Delete</button>
            </div>
          </div>
          <p v-if="!events.length" class="empty">No events yet.</p>
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped>
.admin-panel {
  flex: 1;
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
}

.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.back-link:hover {
  opacity: 1;
}

h1 {
  margin-bottom: 1.5rem;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

h2 {
  font-size: 1.125rem;
  margin-bottom: 0.75rem;
}

.key-prompt {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 320px;
}

.key-prompt input {
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--surface);
  color: var(--text);
  font-size: 1rem;
  font-family: inherit;
}

.key-prompt button {
  align-self: flex-start;
}

.error {
  color: #ff4444;
  margin-bottom: 1rem;
}

.event-form {
  background: var(--surface);
  border: 1px solid var(--border);
  border-top: 4px solid;
  border-image: linear-gradient(to right,
    var(--pride-red), var(--pride-orange), var(--pride-yellow),
    var(--pride-green), var(--pride-blue), var(--pride-purple)
  ) 1;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.event-form input,
.event-form textarea,
.event-form select {
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg);
  color: var(--text);
  font-size: 1rem;
  font-family: inherit;
}

.event-form textarea {
  resize: vertical;
}

.field-label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.field-label span {
  font-size: 0.8rem;
  color: var(--text-dim);
}

.form-actions {
  display: flex;
  gap: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  background: var(--accent);
  color: #000;
  font-weight: 600;
  font-family: inherit;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button.cancel {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text);
}

button.edit {
  background: transparent;
  border: 1px solid var(--accent-dim);
  color: var(--accent);
}

button.end {
  background: transparent;
  border: 1px solid #ff8800;
  color: #ff8800;
}

button.delete {
  background: transparent;
  border: 1px solid #ff4444;
  color: #ff4444;
}

.event-row.ended {
  opacity: 0.5;
}

.ended-badge {
  font-size: 0.75rem;
  color: #ff4444;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.loading-panel {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-dim);
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.event-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.75rem 1rem;
}

.event-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.ev-date {
  font-size: 0.8rem;
  color: var(--text-dim);
}

.event-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.empty {
  color: var(--text-dim);
  text-align: center;
  padding: 2rem;
}
</style>
