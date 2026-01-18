import axios, { AxiosInstance } from 'axios'
import env from '../config/env'
import { ETHGasLoginResponse, ETHGasVerifyLoginResponse } from '../types/ethgas'

/**
 * ETHGas API Client
 * 
 * Base URL: https://hoodi.app.ethgas.com
 * Chain: Hoodi (Chain ID: 560048)
 * Environment: Testnet Only
 */
class ETHGasClient {
  private client: AxiosInstance
  private baseURL = 'https://hoodi.app.ethgas.com'

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    })
  }

  /**
   * Set authentication token for authenticated requests
   */
  setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    delete this.client.defaults.headers.common['Authorization']
  }

  // ==================== AUTH APIs ====================

  /**
   * POST /api/v1/user/login
   * Wallet-based login - returns EIP-712 message for signing
   * Note: Address must be passed as query parameter 'addr', not in body
   */
  async login(address: string): Promise<ETHGasLoginResponse> {
    const url = `/api/v1/user/login?addr=${encodeURIComponent(address)}`
    console.log('🔵 ETHGas API Request:')
    console.log('  Method: POST')
    console.log('  URL:', `${this.baseURL}${url}`)
    console.log('  Query Params:', { addr: address })
    
    try {
      const response = await this.client.post<ETHGasLoginResponse>(url)
      console.log('✅ ETHGas API Response:')
      console.log('  Status:', response.status)
      console.log('  Data:', JSON.stringify(response.data, null, 2))
      return response.data
    } catch (error: any) {
      console.error('❌ ETHGas API Error:')
      console.error('  Status:', error.response?.status)
      console.error('  Error:', error.response?.data || error.message)
      throw new Error(`ETHGas login failed: ${error.response?.data?.message || error.message}`)
    }
  }

  /**
   * POST /api/v1/user/login/verify
   * Verify signed EIP-712 message and get JWT token
   * Note: ETHGas API expects 'addr', 'nonceHash', 'signature' as query params or form data
   */
  async verifyLogin(address: string, signature: string, nonceHash: string): Promise<{ token: string; user: any }> {
    // ETHGas API expects these as query parameters or form data
    // Using query params to match the Python example
    const url = `/api/v1/user/login/verify?addr=${encodeURIComponent(address)}&nonceHash=${encodeURIComponent(nonceHash)}&signature=${encodeURIComponent(signature)}`
    console.log('🔵 ETHGas API Request:')
    console.log('  Method: POST')
    console.log('  URL:', `${this.baseURL}${url}`)
    console.log('  Query Params:', { 
      addr: address, 
      nonceHash, 
      signature: `${signature.slice(0, 20)}...` 
    })
    
    try {
      const response = await this.client.post<ETHGasVerifyLoginResponse>(url)
      console.log('✅ ETHGas API Response:')
      console.log('  Status:', response.status)
      console.log('  Data:', JSON.stringify({ 
        ...response.data, 
        data: response.data?.data ? {
          ...response.data.data,
          accessToken: response.data.data.accessToken?.token ? '***REDACTED***' : response.data.data.accessToken
        } : response.data?.data
      }, null, 2))
      
      // Extract token from response structure
      // ETHGas returns: { success: true, data: { accessToken: { token: "..." }, user: {...} } }
      if (response.data?.success && response.data?.data?.accessToken?.token) {
        return {
          token: response.data.data.accessToken.token,
          user: response.data.data.user,
        }
      }
      
      throw new Error('Invalid response structure from ETHGas API')
    } catch (error: any) {
      console.error('❌ ETHGas API Error:')
      console.error('  Status:', error.response?.status)
      console.error('  Error:', error.response?.data || error.message)
      throw new Error(`ETHGas login verification failed: ${error.response?.data?.message || error.message}`)
    }
  }

  /**
   * GET /api/v1/user/info
   * Get user info (requires auth token)
   */
  async getUserInfo(): Promise<any> {
    console.log('🔵 ETHGas API Request:')
    console.log('  Method: GET')
    console.log('  URL:', `${this.baseURL}/api/v1/user/info`)
    console.log('  Headers:', { Authorization: 'Bearer ***REDACTED***' })
    
    try {
      const response = await this.client.get('/api/v1/user/info')
      console.log('✅ ETHGas API Response:')
      console.log('  Status:', response.status)
      console.log('  Data:', JSON.stringify(response.data, null, 2))
      return response.data
    } catch (error: any) {
      console.error('❌ ETHGas API Error:')
      console.error('  Status:', error.response?.status)
      console.error('  Error:', error.response?.data || error.message)
      throw new Error(`ETHGas get user info failed: ${error.response?.data?.message || error.message}`)
    }
  }

  // ==================== PUBLIC MARKET APIs ====================

  /**
   * GET /api/v1/p/wholeblock/markets
   * Get whole block market data (public, no auth)
   */
  async getWholeBlockMarkets(): Promise<any> {
    console.log('🔵 ETHGas API Request:')
    console.log('  Method: GET')
    console.log('  URL:', `${this.baseURL}/api/v1/p/wholeblock/markets`)
    
    try {
      const response = await this.client.get('/api/v1/p/wholeblock/markets')
      console.log('✅ ETHGas API Response:')
      console.log('  Status:', response.status)
      console.log('  Data keys:', Object.keys(response.data || {}))
      console.log('  Data preview:', JSON.stringify(response.data, null, 2).slice(0, 500) + '...')
      return response.data
    } catch (error: any) {
      console.error('❌ ETHGas API Error:')
      console.error('  Status:', error.response?.status)
      console.error('  Error:', error.response?.data || error.message)
      throw new Error(`ETHGas get whole block markets failed: ${error.response?.data?.message || error.message}`)
    }
  }

  /**
   * GET /api/v1/p/inclusion-preconf/markets
   * Get inclusion preconf market data (public, no auth)
   */
  async getInclusionPreconfMarkets(): Promise<any> {
    console.log('🔵 ETHGas API Request:')
    console.log('  Method: GET')
    console.log('  URL:', `${this.baseURL}/api/v1/p/inclusion-preconf/markets`)
    
    try {
      const response = await this.client.get('/api/v1/p/inclusion-preconf/markets')
      console.log('✅ ETHGas API Response:')
      console.log('  Status:', response.status)
      console.log('  Data keys:', Object.keys(response.data || {}))
      console.log('  Data preview:', JSON.stringify(response.data, null, 2).slice(0, 500) + '...')
      return response.data
    } catch (error: any) {
      console.error('❌ ETHGas API Error:')
      console.error('  Status:', error.response?.status)
      console.error('  Error:', error.response?.data || error.message)
      throw new Error(`ETHGas get inclusion preconf markets failed: ${error.response?.data?.message || error.message}`)
    }
  }

  /**
   * GET /api/v1/p/wholeblock/trades
   * Get whole block trades (public, no auth)
   */
  async getWholeBlockTrades(): Promise<any> {
    console.log('🔵 ETHGas API Request:')
    console.log('  Method: GET')
    console.log('  URL:', `${this.baseURL}/api/v1/p/wholeblock/trades`)
    
    try {
      const response = await this.client.get('/api/v1/p/wholeblock/trades')
      console.log('✅ ETHGas API Response:')
      console.log('  Status:', response.status)
      console.log('  Data keys:', Object.keys(response.data || {}))
      console.log('  Data preview:', JSON.stringify(response.data, null, 2).slice(0, 500) + '...')
      return response.data
    } catch (error: any) {
      console.error('❌ ETHGas API Error:')
      console.error('  Status:', error.response?.status)
      console.error('  Error:', error.response?.data || error.message)
      throw new Error(`ETHGas get whole block trades failed: ${error.response?.data?.message || error.message}`)
    }
  }

  /**
   * GET /api/v1/p/inclusion-preconf/trades
   * Get inclusion preconf trades (public, no auth)
   */
  async getInclusionPreconfTrades(): Promise<any> {
    console.log('🔵 ETHGas API Request:')
    console.log('  Method: GET')
    console.log('  URL:', `${this.baseURL}/api/v1/p/inclusion-preconf/trades`)
    
    try {
      const response = await this.client.get('/api/v1/p/inclusion-preconf/trades')
      console.log('✅ ETHGas API Response:')
      console.log('  Status:', response.status)
      console.log('  Data keys:', Object.keys(response.data || {}))
      console.log('  Data preview:', JSON.stringify(response.data, null, 2).slice(0, 500) + '...')
      return response.data
    } catch (error: any) {
      console.error('❌ ETHGas API Error:')
      console.error('  Status:', error.response?.status)
      console.error('  Error:', error.response?.data || error.message)
      throw new Error(`ETHGas get inclusion preconf trades failed: ${error.response?.data?.message || error.message}`)
    }
  }

  // ==================== TRADING APIs (AUTH REQUIRED) ====================

  /**
   * POST /api/v1/wholeblock/order
   * Place whole block order (requires auth token)
   */
  async placeWholeBlockOrder(orderData: any): Promise<any> {
    console.log('🔵 ETHGas API Request:')
    console.log('  Method: POST')
    console.log('  URL:', `${this.baseURL}/api/v1/wholeblock/order`)
    console.log('  Body:', JSON.stringify(orderData, null, 2))
    console.log('  Headers:', { Authorization: 'Bearer ***REDACTED***' })
    
    try {
      const response = await this.client.post('/api/v1/wholeblock/order', orderData)
      console.log('✅ ETHGas API Response:')
      console.log('  Status:', response.status)
      console.log('  Data:', JSON.stringify(response.data, null, 2))
      return response.data
    } catch (error: any) {
      console.error('❌ ETHGas API Error:')
      console.error('  Status:', error.response?.status)
      console.error('  Error:', error.response?.data || error.message)
      throw new Error(`ETHGas place whole block order failed: ${error.response?.data?.message || error.message}`)
    }
  }

  /**
   * POST /api/v1/inclusion-preconf/order
   * Place inclusion preconf order (requires auth token)
   */
  async placeInclusionPreconfOrder(orderData: any): Promise<any> {
    console.log('🔵 ETHGas API Request:')
    console.log('  Method: POST')
    console.log('  URL:', `${this.baseURL}/api/v1/inclusion-preconf/order`)
    console.log('  Body:', JSON.stringify(orderData, null, 2))
    console.log('  Headers:', { Authorization: 'Bearer ***REDACTED***' })
    
    try {
      const response = await this.client.post('/api/v1/inclusion-preconf/order', orderData)
      console.log('✅ ETHGas API Response:')
      console.log('  Status:', response.status)
      console.log('  Data:', JSON.stringify(response.data, null, 2))
      return response.data
    } catch (error: any) {
      console.error('❌ ETHGas API Error:')
      console.error('  Status:', error.response?.status)
      console.error('  Error:', error.response?.data || error.message)
      throw new Error(`ETHGas place inclusion preconf order failed: ${error.response?.data?.message || error.message}`)
    }
  }

  /**
   * GET /api/v1/user/wholeblock/orders
   * Get user's whole block orders (requires auth token)
   */
  async getUserWholeBlockOrders(): Promise<any> {
    console.log('🔵 ETHGas API Request:')
    console.log('  Method: GET')
    console.log('  URL:', `${this.baseURL}/api/v1/user/wholeblock/orders`)
    console.log('  Headers:', { Authorization: 'Bearer ***REDACTED***' })
    
    try {
      const response = await this.client.get('/api/v1/user/wholeblock/orders')
      console.log('✅ ETHGas API Response:')
      console.log('  Status:', response.status)
      console.log('  Data keys:', Object.keys(response.data || {}))
      console.log('  Data preview:', JSON.stringify(response.data, null, 2).slice(0, 500) + '...')
      return response.data
    } catch (error: any) {
      console.error('❌ ETHGas API Error:')
      console.error('  Status:', error.response?.status)
      console.error('  Error:', error.response?.data || error.message)
      throw new Error(`ETHGas get user whole block orders failed: ${error.response?.data?.message || error.message}`)
    }
  }

  /**
   * GET /api/v1/user/inclusion-preconf/orders
   * Get user's inclusion preconf orders (requires auth token)
   */
  async getUserInclusionPreconfOrders(): Promise<any> {
    console.log('🔵 ETHGas API Request:')
    console.log('  Method: GET')
    console.log('  URL:', `${this.baseURL}/api/v1/user/inclusion-preconf/orders`)
    console.log('  Headers:', { Authorization: 'Bearer ***REDACTED***' })
    
    try {
      const response = await this.client.get('/api/v1/user/inclusion-preconf/orders')
      console.log('✅ ETHGas API Response:')
      console.log('  Status:', response.status)
      console.log('  Data keys:', Object.keys(response.data || {}))
      console.log('  Data preview:', JSON.stringify(response.data, null, 2).slice(0, 500) + '...')
      return response.data
    } catch (error: any) {
      console.error('❌ ETHGas API Error:')
      console.error('  Status:', error.response?.status)
      console.error('  Error:', error.response?.data || error.message)
      throw new Error(`ETHGas get user inclusion preconf orders failed: ${error.response?.data?.message || error.message}`)
    }
  }

  /**
   * POST /api/v1/wholeblock/order/cancel
   * Cancel whole block order (requires auth token)
   */
  async cancelWholeBlockOrder(orderId: string): Promise<any> {
    const requestBody = { orderId }
    console.log('🔵 ETHGas API Request:')
    console.log('  Method: POST')
    console.log('  URL:', `${this.baseURL}/api/v1/wholeblock/order/cancel`)
    console.log('  Body:', JSON.stringify(requestBody, null, 2))
    console.log('  Headers:', { Authorization: 'Bearer ***REDACTED***' })
    
    try {
      const response = await this.client.post('/api/v1/wholeblock/order/cancel', requestBody)
      console.log('✅ ETHGas API Response:')
      console.log('  Status:', response.status)
      console.log('  Data:', JSON.stringify(response.data, null, 2))
      return response.data
    } catch (error: any) {
      console.error('❌ ETHGas API Error:')
      console.error('  Status:', error.response?.status)
      console.error('  Error:', error.response?.data || error.message)
      throw new Error(`ETHGas cancel whole block order failed: ${error.response?.data?.message || error.message}`)
    }
  }

  /**
   * POST /api/v1/inclusion-preconf/order/cancel
   * Cancel inclusion preconf order (requires auth token)
   */
  async cancelInclusionPreconfOrder(orderId: string): Promise<any> {
    const requestBody = { orderId }
    console.log('🔵 ETHGas API Request:')
    console.log('  Method: POST')
    console.log('  URL:', `${this.baseURL}/api/v1/inclusion-preconf/order/cancel`)
    console.log('  Body:', JSON.stringify(requestBody, null, 2))
    console.log('  Headers:', { Authorization: 'Bearer ***REDACTED***' })
    
    try {
      const response = await this.client.post('/api/v1/inclusion-preconf/order/cancel', requestBody)
      console.log('✅ ETHGas API Response:')
      console.log('  Status:', response.status)
      console.log('  Data:', JSON.stringify(response.data, null, 2))
      return response.data
    } catch (error: any) {
      console.error('❌ ETHGas API Error:')
      console.error('  Status:', error.response?.status)
      console.error('  Error:', error.response?.data || error.message)
      throw new Error(`ETHGas cancel inclusion preconf order failed: ${error.response?.data?.message || error.message}`)
    }
  }
}

export default new ETHGasClient()
