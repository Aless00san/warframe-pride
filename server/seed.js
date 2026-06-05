import db from './db.js'

const events = db.prepare('SELECT title, description, scheduled_at, twitch_url, image_url FROM events ORDER BY id').all()

const code = `export const seedEvents = ${JSON.stringify(events, null, 2)}\n`

import { writeFileSync } from 'fs'
writeFileSync('server/seed-data.js', code)
console.log(`Wrote ${events.length} events to server/seed-data.js`)
