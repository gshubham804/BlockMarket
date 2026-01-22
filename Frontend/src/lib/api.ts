/**
 * API Client for BlockMarket Backend
 * 
 * All API calls go through our backend - never directly to ETHGas
 */

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://blockmarket.onrender.com'

class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = API_BASE_URL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('auth_token')

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    console.log('🟢 [Frontend] API.request() called')
    console.log('  Endpoint:', endpoint)
    console.log('  Method:', options.method || 'GET')
    console.log('  Headers:', { ...headers, Authorization: token ? 'Bearer ***' : undefined })

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      })

      console.log('  Response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ [Frontend] API request failed')
        console.error('  Status:', response.status)
        console.error('  Error response:', errorText)

        let error
        try {
          error = JSON.parse(errorText)
        } catch {
          error = { error: errorText || 'Request failed' }
        }
        throw new Error(error.error || error.message || `HTTP ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ [Frontend] API request successful')
      return data
    } catch (error: any) {
      console.error('❌ [Frontend] API.request() error:', error)
      throw error
    }
  }

  // ==================== Auth APIs ====================

  async login(address: string) {
    console.log('🟢 [Frontend] API.login() called')
    console.log('  URL:', `${this.baseURL}/auth/login`)
    console.log('  Request body:', { address })

    try {
      const response = await this.request<{
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
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ address }),
      })
      console.log('✅ [Frontend] API.login() response:', {
        nonceHash: response.nonceHash,
        status: response.status,
        hasEip712Message: !!response.eip712Message,
      })
      return response
    } catch (error: any) {
      console.error('❌ [Frontend] API.login() error:', error)
      throw error
    }
  }

  async verifyLogin(address: string, signature: string, nonceHash: string) {
    console.log('🟢 [Frontend] API.verifyLogin() called')
    console.log('  URL:', `${this.baseURL}/auth/verify`)
    console.log('  Request body:', {
      address,
      nonceHash,
      signature: signature.slice(0, 20) + '...',
    })

    try {
      const response = await this.request<{ token: string; user: { id: string; address: string } }>(
        '/auth/verify',
        {
          method: 'POST',
          body: JSON.stringify({ address, signature, nonceHash }),
        }
      )
      console.log('✅ [Frontend] API.verifyLogin() response:', {
        hasToken: !!response.token,
        user: response.user,
      })
      return response
    } catch (error: any) {
      console.error('❌ [Frontend] API.verifyLogin() error:', error)
      console.error('  Error message:', error.message)
      throw error
    }
  }

  async getMe() {
    return this.request<{ user: { id: string; address: string; ethgasInfo?: any } }>('/auth/me')
  }

  // ==================== Market APIs ====================

  async getWholeBlockMarket() {
    return this.request<{ market: any }>('/market/wholeblock')
  }

  async getPreconfMarket() {
    return this.request<{ market: any }>('/market/preconf')
  }

  async getTrades(type: 'wholeblock' | 'preconf') {
    return this.request<{ trades: any }>(`/market/trades?type=${type}`)
  }

  // ==================== Orders APIs ====================

  async placeOrder(orderData: {
    marketType: 'wholeblock' | 'inclusion-preconf'
    side: 'buy' | 'sell'
    blockRange: { start: number; end: number }
    price: string
    quantity?: string
  }) {
    return this.request<{ order: any }>('/orders/place', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }

  async getMyOrders(marketType?: 'wholeblock' | 'inclusion-preconf') {
    const query = marketType ? `?marketType=${marketType}` : ''
    return this.request<{ orders: any[] }>(`/orders/my${query}`)
  }

  async cancelOrder(orderId: string) {
    return this.request<{ order: any }>('/orders/cancel', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    })
  }
}

export default new ApiClient()
