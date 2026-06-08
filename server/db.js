import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { seedEvents } from './seed-data.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = process.env.DATA_DIR || path.join(__dirname, '..')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
const db = new Database(path.join(dataDir, 'data.sqlite'))

db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    description TEXT DEFAULT '',
    scheduled_at TEXT NOT NULL,
    twitch_url  TEXT DEFAULT '',
    image_url   TEXT DEFAULT '',
    ended       INTEGER DEFAULT 0,
    created_at  TEXT DEFAULT (datetime('now')),
    updated_at  TEXT DEFAULT (datetime('now'))
  )
`)

try {
  db.exec('ALTER TABLE events ADD COLUMN ended INTEGER DEFAULT 0')
} catch {
  // column already exists
}

const { count } = db.prepare('SELECT COUNT(*) as count FROM events').get()
if (count === 0 && seedEvents.length) {
  const stmt = db.prepare(
    'INSERT INTO events (title, description, scheduled_at, twitch_url, image_url) VALUES (?, ?, ?, ?, ?)'
  )
  for (const ev of seedEvents) {
    stmt.run(ev.title, ev.description, ev.scheduled_at, ev.twitch_url, ev.image_url)
  }
  console.log(`Seeded ${seedEvents.length} events`)
}

export default db
