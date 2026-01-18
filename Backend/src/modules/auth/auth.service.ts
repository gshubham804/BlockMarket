import { User } from '../../models/User.model'
import ethgasClient from '../../utils/ethgas.client'
import { LoginInput, VerifyLoginInput } from '../../models/User.model'
import { AppError } from '../../middlewares/error.middleware'
import jwt from 'jsonwebtoken'
import env from '../../config/env'
import { ETHGasLoginResponse, ETHGasEIP712Message } from '../../types/ethgas'

export class AuthService {
  /**
   * Step 1: Initiate wallet login with ETHGas
   * Returns EIP-712 message structure that user must sign
   */
  async initiateLogin(data: LoginInput): Promise<{
    eip712Message: ETHGasEIP712Message
    nonceHash: string
    status: string
  }> {
    console.log('🟣 [Backend] AuthService.initiateLogin() called')
    console.log('  Address:', data.address)

    try {
      console.log('🟣 [Backend] Calling ETHGas login API...')
      // Call ETHGas login API
      const result: ETHGasLoginResponse = await ethgasClient.login(data.address)
      console.log('✅ [Backend] ETHGas login response received:', {
        success: result.success,
        hasData: !!result.data,
        nonceHash: result.data?.nonceHash,
        status: result.data?.status,
      })
      
      if (!result.success || !result.data) {
        console.error('❌ [Backend] Invalid ETHGas response structure')
        throw new Error('Invalid response from ETHGas API')
      }

      console.log('🟣 [Backend] Parsing EIP-712 message...')
      // Parse the EIP-712 message JSON string
      let eip712Message: ETHGasEIP712Message
      try {
        eip712Message = JSON.parse(result.data.eip712Message)
        console.log('✅ [Backend] EIP-712 message parsed:', {
          primaryType: eip712Message.primaryType,
          domain: eip712Message.domain,
          messageKeys: Object.keys(eip712Message.message),
        })
      } catch (parseError: any) {
        console.error('❌ [Backend] Failed to parse EIP-712 message:', parseError)
        throw new Error('Failed to parse EIP-712 message from ETHGas')
      }
      
      console.log('🟣 [Backend] Finding/creating user in database...')
      // Find or create user in our database
      await User.findOneAndUpdate(
        { address: data.address },
        { address: data.address },
        { upsert: true, new: true }
      )
      console.log('✅ [Backend] User found/created')

      const response = {
        eip712Message,
        nonceHash: result.data.nonceHash,
        status: result.data.status,
      }
      console.log('✅ [Backend] AuthService.initiateLogin() completed successfully')
      return response
    } catch (error: any) {
      console.error('❌ [Backend] AuthService.initiateLogin() error:', error)
      console.error('  Error message:', error.message)
      throw new AppError(400, `Login initiation failed: ${error.message}`)
    }
  }

  /**
   * Step 2: Verify signed EIP-712 message and complete login
   * Returns our JWT token (ETHGas token stored server-side only)
   * Note: 'nonceHash' parameter comes from the login response
   */
  async verifyLogin(data: VerifyLoginInput): Promise<{ token: string; user: { id: string; address: string } }> {
    console.log('🟣 [Backend] AuthService.verifyLogin() called')
    console.log('  Input data:', {
      address: data.address,
      nonceHash: data.nonceHash,
      signature: data.signature.slice(0, 20) + '...',
    })

    try {
      console.log('🟣 [Backend] Calling ETHGas verifyLogin API...')
      // Verify with ETHGas API
      // ETHGas expects: addr, nonceHash, signature
      const ethgasResult = await ethgasClient.verifyLogin(
        data.address,
        data.signature,
        data.nonceHash
      )
      console.log('✅ [Backend] ETHGas verifyLogin response received:', {
        hasToken: !!ethgasResult.token,
        hasUser: !!ethgasResult.user,
      })

      console.log('🟣 [Backend] Finding/creating user in database...')
      // Find or create user
      const user = await User.findOneAndUpdate(
        { address: data.address },
        {
          address: data.address,
          ethgasToken: ethgasResult.token,
          ethgasTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
        { upsert: true, new: true }
      )
      console.log('✅ [Backend] User found/created:', {
        userId: user._id.toString(),
        address: user.address,
      })

      console.log('🟣 [Backend] Generating JWT token...')
      // Generate our own JWT token for frontend
      const ourToken = jwt.sign(
        { userId: user._id.toString(), address: user.address },
        env.JWT_SECRET,
        { expiresIn: '7d' }
      )
      console.log('✅ [Backend] JWT token generated')

      const result = {
        token: ourToken,
        user: {
          id: user._id.toString(),
          address: user.address,
        },
      }
      console.log('✅ [Backend] AuthService.verifyLogin() completed successfully')
      return result
    } catch (error: any) {
      console.error('❌ [Backend] AuthService.verifyLogin() error:', error)
      console.error('  Error name:', error.name)
      console.error('  Error message:', error.message)
      console.error('  Error stack:', error.stack)
      throw new AppError(401, `Login verification failed: ${error.message}`)
    }
  }

  /**
   * Get current user info
   * Fetches fresh data from ETHGas if needed
   */
  async getCurrentUser(userId: string): Promise<{ id: string; address: string; ethgasInfo?: any }> {
    const user = await User.findById(userId).select('+ethgasToken')
    
    if (!user) {
      throw new AppError(404, 'User not found')
    }

    // Optionally fetch fresh info from ETHGas
    let ethgasInfo = null
    if (user.ethgasToken) {
      try {
        ethgasClient.setAuthToken(user.ethgasToken)
        ethgasInfo = await ethgasClient.getUserInfo()
        ethgasClient.clearAuthToken()
      } catch (error) {
        // Token might be expired, but don't fail the request
        console.warn('Failed to fetch ETHGas user info:', error)
      }
    }

    return {
      id: user._id.toString(),
      address: user.address,
      ethgasInfo,
    }
  }

  /**
   * Get user's ETHGas token (for internal use only)
   * Never expose this to frontend
   */
  async getETHGasToken(userId: string): Promise<string | null> {
    const user = await User.findById(userId).select('+ethgasToken')
    
    if (!user || !user.ethgasToken) {
      return null
    }

    // Check if token is expired
    if (user.ethgasTokenExpiresAt && user.ethgasTokenExpiresAt < new Date()) {
      return null
    }

    return user.ethgasToken
  }
}

export default new AuthService()
