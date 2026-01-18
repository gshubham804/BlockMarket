/**
 * Authentication utilities
 * Handles wallet-based login flow with EIP-712 signing
 */

import api from './api'
import { connectWallet, signTypedData } from './wallet'

export interface AuthUser {
  id: string
  address: string
}

export interface PendingLogin {
  address: string
  eip712Message: {
    types: {
      EIP712Domain: Array<{ name: string; type: string }>
      data: Array<{ name: string; type: string }>
    }
    message: {
      hash: string
      message: string
      domain: string
    }
    domain: {
      name: string
      version: string
      chainId: number
      verifyingContract: string
    }
    primaryType: string
  }
  nonceHash: string
  status: string
}

export class AuthService {
  private user: AuthUser | null = null

  /**
   * Step 1: Initiate login - Connect wallet and get EIP-712 message
   */
  async initiateLogin(): Promise<PendingLogin> {
    console.log('🟢 [Frontend] AuthService.initiateLogin() called')
    try {
      console.log('🟢 [Frontend] Step 1: Connecting wallet...')
      // Step 1: Connect wallet
      const address = await connectWallet()
      console.log('✅ [Frontend] Wallet connected:', address)

      console.log('🟢 [Frontend] Step 2: Calling login API...')
      // Step 2: Get EIP-712 message from backend
      const { eip712Message, nonceHash, status } = await api.login(address)
      console.log('✅ [Frontend] Login API response received:', {
        nonceHash,
        status,
        hasEip712Message: !!eip712Message,
        primaryType: eip712Message?.primaryType,
      })

      const result = {
        address,
        eip712Message,
        nonceHash,
        status,
      }
      console.log('✅ [Frontend] AuthService.initiateLogin() completed')
      return result
    } catch (error: any) {
      console.error('❌ [Frontend] AuthService.initiateLogin() error:', error)
      console.error('  Error message:', error.message)
      throw new Error(`Login initiation failed: ${error.message}`)
    }
  }

  /**
   * Step 2: Verify login - Sign EIP-712 message and verify with backend
   */
  async verifyLogin(pendingLogin: PendingLogin): Promise<AuthUser> {
    console.log('🟢 [Frontend] AuthService.verifyLogin() called')
    console.log('  Pending Login:', {
      address: pendingLogin.address,
      nonceHash: pendingLogin.nonceHash,
      status: pendingLogin.status,
      eip712Message: {
        primaryType: pendingLogin.eip712Message.primaryType,
        domain: pendingLogin.eip712Message.domain,
        message: pendingLogin.eip712Message.message,
        types: Object.keys(pendingLogin.eip712Message.types),
      },
    })

    try {
      const { address, eip712Message, nonceHash } = pendingLogin

      console.log('🟢 [Frontend] Step 1: Signing EIP-712 message...')
      // Step 1: Sign EIP-712 typed data (not a simple string message)
      const signature = await signTypedData(eip712Message, address)
      console.log('✅ [Frontend] Signature received:', signature.slice(0, 20) + '...')

      console.log('🟢 [Frontend] Step 2: Calling verify API...')
      console.log('  Request data:', {
        address,
        nonceHash,
        signature: signature.slice(0, 20) + '...',
      })
      // Step 2: Verify and get token
      const { token, user } = await api.verifyLogin(address, signature, nonceHash)
      console.log('✅ [Frontend] Verify API response received:', {
        hasToken: !!token,
        user: user ? { id: user.id, address: user.address } : null,
      })

      // Store token
      localStorage.setItem('auth_token', token)
      this.user = user
      console.log('✅ [Frontend] Token stored, user logged in')

      return user
    } catch (error: any) {
      console.error('❌ [Frontend] AuthService.verifyLogin() error:', error)
      console.error('  Error message:', error.message)
      console.error('  Error stack:', error.stack)
      throw new Error(`Login verification failed: ${error.message}`)
    }
  }

  /**
   * Complete login flow (for backward compatibility)
   */
  async login(): Promise<AuthUser> {
    const pendingLogin = await this.initiateLogin()
    return this.verifyLogin(pendingLogin)
  }

  /**
   * Get current user from token
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      return null
    }

    try {
      const { user } = await api.getMe()
      this.user = user
      return user
    } catch (error) {
      // Token invalid, clear it
      this.logout()
      return null
    }
  }

  /**
   * Logout
   */
  logout(): void {
    localStorage.removeItem('auth_token')
    this.user = null
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token')
  }

  /**
   * Get current user (from memory)
   */
  getUser(): AuthUser | null {
    return this.user
  }
}

export default new AuthService()
