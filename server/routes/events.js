import { Router } from 'express'
import db from '../db.js'

const router = Router()

router.get('/', (req, res) => {
  const events = db.prepare('SELECT * FROM events ORDER BY scheduled_at DESC').all()
  res.json(events)
})

router.get('/next', (req, res) => {
  const event = db
    .prepare("SELECT * FROM events WHERE ended = 0 AND scheduled_at > datetime('now') ORDER BY scheduled_at ASC LIMIT 1")
    .get()
  if (!event) return res.json(null)
  res.json(event)
})

export default router
