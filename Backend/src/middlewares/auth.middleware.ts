import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import env from '../config/env'

export interface AuthRequest extends Request {
  userId?: string
  userAddress?: string
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' })
      return
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string; address: string }

    req.userId = decoded.userId
    req.userAddress = decoded.address

    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export const optionalAuth = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string; address: string }
      req.userId = decoded.userId
      req.userAddress = decoded.address
    }

    next()
  } catch (error) {
    // Continue without auth if token is invalid
    next()
  }
}
