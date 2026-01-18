import mongoose from 'mongoose'
import env from './env'

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.DATABASE_URL)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await mongoose.connection.close()
  console.log('MongoDB connection closed')
})

export default connectDB
