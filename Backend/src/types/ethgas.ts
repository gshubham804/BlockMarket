export interface ETHGasCommitment {
  id: string
  blockRange: {
    start: number
    end: number
  }
  price: string
  status: 'available' | 'reserved' | 'used' | 'expired'
  reservedBy?: string
  reservedAt?: Date
  expiresAt: Date
}

export interface ETHGasAPIResponse {
  commitments: ETHGasCommitment[]
  total: number
}

export interface CreateCommitmentRequest {
  blockRange: {
    start: number
    end: number
  }
  price: string
  expiresAt: Date
}

// Auth API Types
export interface ETHGasLoginResponse {
  success: boolean
  data: {
    status: string
    eip712Message: string // JSON string containing EIP-712 structure
    nonceHash: string
  }
}

export interface ETHGasEIP712Message {
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

export interface ETHGasVerifyLoginResponse {
  success: boolean
  data: {
    user: {
      userId: number
      address: string
      status: number
      userType: number
      userClass?: number
      accounts?: Array<{
        accountId: number
        userId: number
        type: number
        name: string
        status: number
        updateDate: number
      }>
    }
    accessToken: {
      token: string
      data?: {
        header: any
        payload: any
      }
    }
  }
}
