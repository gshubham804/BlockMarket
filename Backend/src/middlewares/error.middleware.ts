import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message)
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export const errorHandler = (
  err: Error | AppError | ZodError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    })
  }

  // Custom application errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
    })
  }

  // Default to 500 server error
  console.error('Unhandled error:', err)
  return res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
  })
}
