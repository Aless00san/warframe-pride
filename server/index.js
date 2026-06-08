import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import eventsRouter from './routes/events.js'
import adminRouter from './routes/admin.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/events', eventsRouter)
app.use('/api/admin/events', adminRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
