import { Router } from 'express'
import db from '../db.js'
import auth from '../middleware/auth.js'

const router = Router()

router.use(auth)

router.get('/verify', (req, res) => {
  res.json({ ok: true })
})

function tz(ts, offset) {
  if (!ts) return ts
  if (ts.endsWith('Z') || /[-+]\d{2}:\d{2}$/.test(ts)) return ts
  return ts + (offset || '-04:00')
}

router.post('/', (req, res) => {
  const { title, description, twitch_url, image_url, timezone_offset } = req.body
  const scheduled_at = tz(req.body.scheduled_at, timezone_offset)
  if (!title || !scheduled_at) {
    return res.status(400).json({ error: 'title and scheduled_at are required' })
  }
  const stmt = db.prepare(
    `INSERT INTO events (title, description, scheduled_at, twitch_url, image_url)
     VALUES (?, ?, ?, ?, ?)`
  )
  const result = stmt.run(title, description || '', scheduled_at, twitch_url || '', image_url || '')
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(result.lastInsertRowid)
  res.status(201).json(event)
})

router.patch('/:id/end', (req, res) => {
  const existing = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Event not found' })

  db.prepare("UPDATE events SET ended = 1, updated_at = datetime('now') WHERE id = ?").run(req.params.id)
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id)
  res.json(event)
})

router.put('/:id', (req, res) => {
  const { title, description, twitch_url, image_url, timezone_offset } = req.body
  const scheduled_at = tz(req.body.scheduled_at, timezone_offset)
  const existing = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Event not found' })

  db.prepare(
    `UPDATE events
     SET title = ?, description = ?, scheduled_at = ?, twitch_url = ?, image_url = ?,
         updated_at = datetime('now')
     WHERE id = ?`
  ).run(
    title ?? existing.title,
    description ?? existing.description,
    scheduled_at ?? existing.scheduled_at,
    twitch_url ?? existing.twitch_url,
    image_url ?? existing.image_url,
    req.params.id
  )
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id)
  res.json(event)
})

router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Event not found' })

  db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id)
  res.status(204).end()
})

export default router
