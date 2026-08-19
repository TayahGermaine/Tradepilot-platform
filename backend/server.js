import 'dotenv/config'
import { createApp } from './src/app.js'
import { connectDB } from './src/config/db.js'

const PORT = process.env.PORT || 4000

async function start() {
  try {
    await connectDB(process.env.MONGODB_URI)

    const app = createApp()
    app.listen(PORT, () => {
      console.log(`[server] TradePilot API listening on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('[server] Failed to start:', err.message)
    process.exit(1)
  }
}

start()

process.on('unhandledRejection', (err) => {
  console.error('[unhandledRejection]', err)
})
