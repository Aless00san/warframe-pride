const BASE = import.meta.env.VITE_API_URL || '/api'

async function parseError(res) {
  try {
    const body = await res.json()
    return body.error || res.statusText
  } catch {
    return res.statusText || `Request failed (${res.status})`
  }
}

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, options)
  if (!res.ok) throw new Error(await parseError(res))
  return res.status === 204 ? null : res.json()
}

export function getNextEvent() {
  return request('/events/next')
}

export function getEvents() {
  return request('/events')
}

export function verifyApiKey(apiKey) {
  return request('/admin/events/verify', {
    headers: { 'x-api-key': apiKey },
  })
}

export function createEvent(data, apiKey) {
  return request('/admin/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify(data),
  })
}

export function updateEvent(id, data, apiKey) {
  return request(`/admin/events/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify(data),
  })
}

export function deleteEvent(id, apiKey) {
  return request(`/admin/events/${id}`, {
    method: 'DELETE',
    headers: { 'x-api-key': apiKey },
  })
}

export function endEvent(id, apiKey) {
  return request(`/admin/events/${id}/end`, {
    method: 'PATCH',
    headers: { 'x-api-key': apiKey },
  })
}
