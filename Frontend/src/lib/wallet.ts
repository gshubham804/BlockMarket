/**
 * Wallet utilities for MetaMask integration
 * Used ONLY for authentication signatures
 */

import { BrowserProvider } from 'ethers'

export interface WalletProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
  isMetaMask?: boolean
}

declare global {
  interface Window {
    ethereum?: WalletProvider
  }
}

export const connectWallet = async (): Promise<string> => {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed')
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    }) as string[]

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found')
    }

    return accounts[0]
  } catch (error: any) {
    throw new Error(`Failed to connect wallet: ${error.message}`)
  }
}

/**
 * Sign a simple message using personal_sign (legacy, not used for ETHGas)
 */
export const signMessage = async (message: string, address: string): Promise<string> => {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed')
  }

  try {
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, address],
    }) as string

    return signature
  } catch (error: any) {
    throw new Error(`Failed to sign message: ${error.message}`)
  }
}

/**
 * Sign EIP-712 typed data message (used for ETHGas authentication)
 * Uses MetaMask's native eth_signTypedData_v4 method for better compatibility
 */
export const signTypedData = async (
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
  },
  address: string
): Promise<string> => {
  console.log('🟡 [Frontend] signTypedData() called')
  console.log('  Address:', address)
  console.log('  EIP-712 Message:', {
    primaryType: eip712Message.primaryType,
    domain: eip712Message.domain,
    message: eip712Message.message,
    typesKeys: Object.keys(eip712Message.types),
  })

  if (!window.ethereum) {
    console.error('❌ [Frontend] MetaMask not installed')
    throw new Error('MetaMask not installed')
  }

  try {
    // Use MetaMask's native eth_signTypedData_v4 method
    // This handles EIP-712 correctly and avoids ethers.js v6 type ambiguity issues
    console.log('🟡 [Frontend] Using MetaMask eth_signTypedData_v4...')
    
    // Prepare the EIP-712 structure for MetaMask
    // MetaMask expects chainId as a number (not hex string)
    const typedData = {
      types: eip712Message.types,
      primaryType: eip712Message.primaryType,
      domain: {
        name: eip712Message.domain.name,
        version: eip712Message.domain.version,
        chainId: eip712Message.domain.chainId, // Keep as number
        verifyingContract: eip712Message.domain.verifyingContract,
      },
      message: eip712Message.message,
    }
    
    console.log('  TypedData structure:', JSON.stringify(typedData, null, 2))
    
    // MetaMask expects: [address, JSON.stringify(typedData)]
    const signature = await window.ethereum.request({
      method: 'eth_signTypedData_v4',
      params: [address, JSON.stringify(typedData)],
    }) as string

    console.log('✅ [Frontend] Signature generated:', signature.slice(0, 20) + '...')
    return signature
  } catch (error: any) {
    console.error('❌ [Frontend] signTypedData() error:', error)
    console.error('  Error message:', error.message)
    console.error('  Error code:', error.code)
    console.error('  Error stack:', error.stack)
    throw new Error(`Failed to sign typed data: ${error.message}`)
  }
}

export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
