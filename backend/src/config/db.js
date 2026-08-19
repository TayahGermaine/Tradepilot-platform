import mongoose from 'mongoose'
import { Resolver } from 'dns'

export async function connectDB(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Copy .env.example to .env and configure it.')
  }

  // Try to use Google's DNS (8.8.8.8) to resolve MongoDB Atlas if local DNS fails
  if (uri.includes('mongodb+srv://')) {
    const resolver = new Resolver()
    resolver.setServers(['8.8.8.8', '8.8.4.4'])
  }

  mongoose.set('strictQuery', true)

  mongoose.connection.on('connected', () => {
    console.log('[mongo] connected')
  })
  mongoose.connection.on('error', (err) => {
    console.error('[mongo] connection error:', err.message)
  })
  mongoose.connection.on('disconnected', () => {
    console.warn('[mongo] disconnected')
  })

  await mongoose.connect(uri)
  return mongoose.connection
}

export async function disconnectDB() {
  await mongoose.disconnect()
}
