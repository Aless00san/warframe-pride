import test from 'node:test'
import assert from 'node:assert/strict'
import express from 'express'
import adminRouter from './admin.js'

test('admin verification rejects invalid keys and accepts valid ones', async () => {
  process.env.API_KEY = 'test-key'

  const app = express()
  app.use(express.json())
  app.use('/api/admin/events', adminRouter)

  const server = app.listen(0)
  const { port } = server.address()

  try {
    const invalid = await fetch(`http://127.0.0.1:${port}/api/admin/events/verify`)
    assert.equal(invalid.status, 401)

    const valid = await fetch(`http://127.0.0.1:${port}/api/admin/events/verify`, {
      headers: { 'x-api-key': 'test-key' },
    })

    assert.equal(valid.status, 200)
    assert.deepEqual(await valid.json(), { ok: true })
  } finally {
    server.close()
  }
})
