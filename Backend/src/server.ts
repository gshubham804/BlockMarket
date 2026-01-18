import env from './config/env'
import { createApp } from './app'
import connectDB from './config/db'

const app = createApp()

const PORT = parseInt(env.PORT, 10)

// Connect to MongoDB
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 BlockMarket Backend running on port ${PORT}`)
    console.log(`📡 Environment: ${env.NODE_ENV}`)
    console.log(`🌐 CORS Origin: ${env.CORS_ORIGIN}`)
    console.log(`\n📋 Available endpoints:`)
    console.log(`  POST /auth/login`)
    console.log(`  POST /auth/verify`)
    console.log(`  GET  /auth/me`)
    console.log(`  GET  /market/wholeblock`)
    console.log(`  GET  /market/preconf`)
    console.log(`  GET  /market/trades`)
    console.log(`  POST /orders/place`)
    console.log(`  GET  /orders/my`)
    console.log(`  POST /orders/cancel`)
  })
})
