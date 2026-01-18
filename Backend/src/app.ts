import express, { Express } from 'express'
import cors from 'cors'
import env from './config/env'
import { errorHandler } from './middlewares/error.middleware'

// Routes
import authRoutes from './modules/auth/auth.routes'
import marketRoutes from './modules/market/market.routes'
import ordersRoutes from './modules/orders/orders.routes'

export function createApp(): Express {
  const app = express()

  // Middleware
  app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  // Test route to verify routing works
  app.get('/test', (_req, res) => {
    res.json({ message: 'Routes are working', routes: ['/auth', '/market', '/orders'] })
  })

  // API Routes
  app.use('/auth', authRoutes)
  app.use('/market', marketRoutes)
  app.use('/orders', ordersRoutes)

  // Debug: Log all registered routes (development only)
  if (env.NODE_ENV === 'development') {
    console.log('📋 Registered routes:')
    console.log('  POST /auth/login')
    console.log('  POST /auth/verify')
    console.log('  GET  /auth/me')
    console.log('  GET  /market/wholeblock')
    console.log('  GET  /market/preconf')
    console.log('  GET  /market/trades')
    console.log('  POST /orders/place')
    console.log('  GET  /orders/my')
    console.log('  POST /orders/cancel')
  }

  // Error handling (must be last)
  app.use(errorHandler)

  return app
}
