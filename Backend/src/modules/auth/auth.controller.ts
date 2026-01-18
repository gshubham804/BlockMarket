import { Request, Response, NextFunction } from 'express'
import authService from './auth.service'
import { LoginSchema, VerifyLoginSchema } from '../../models/User.model'

export class AuthController {
  /**
   * POST /auth/login
   * Initiate wallet login - returns challenge message
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log('🔵 [Backend] POST /auth/login received')
    console.log('  Request body:', req.body)

    try {
      console.log('🔵 [Backend] Validating request body...')
      const data = LoginSchema.parse(req.body)
      console.log('✅ [Backend] Validation passed:', { address: data.address })

      console.log('🔵 [Backend] Calling authService.initiateLogin()...')
      const result = await authService.initiateLogin(data)
      console.log('✅ [Backend] initiateLogin() completed:', {
        nonceHash: result.nonceHash,
        status: result.status,
        hasEip712Message: !!result.eip712Message,
      })

      res.json(result)
    } catch (error: any) {
      console.error('❌ [Backend] /auth/login error:', error)
      console.error('  Error name:', error.name)
      console.error('  Error message:', error.message)
      if (error.issues) {
        console.error('  Validation errors:', error.issues)
      }
      next(error)
    }
  }

  /**
   * POST /auth/verify
   * Verify signed challenge and complete login
   */
  async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log('🔵 [Backend] POST /auth/verify received')
    console.log('  Request body:', {
      address: req.body.address,
      nonceHash: req.body.nonceHash,
      signature: req.body.signature ? req.body.signature.slice(0, 20) + '...' : 'missing',
    })

    try {
      console.log('🔵 [Backend] Validating request body...')
      const data = VerifyLoginSchema.parse(req.body)
      console.log('✅ [Backend] Validation passed:', {
        address: data.address,
        nonceHash: data.nonceHash,
        hasSignature: !!data.signature,
      })

      console.log('🔵 [Backend] Calling authService.verifyLogin()...')
      const result = await authService.verifyLogin(data)
      console.log('✅ [Backend] verifyLogin() completed:', {
        hasToken: !!result.token,
        user: result.user ? { id: result.user.id, address: result.user.address } : null,
      })

      res.json(result)
    } catch (error: any) {
      console.error('❌ [Backend] /auth/verify error:', error)
      console.error('  Error name:', error.name)
      console.error('  Error message:', error.message)
      if (error.issues) {
        console.error('  Validation errors:', error.issues)
      }
      next(error)
    }
  }

  /**
   * GET /auth/me
   * Get current authenticated user info
   */
  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).userId
      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' })
        return
      }

      const user = await authService.getCurrentUser(userId)
      res.json({ user })
    } catch (error) {
      next(error)
    }
  }
}

export default new AuthController()
