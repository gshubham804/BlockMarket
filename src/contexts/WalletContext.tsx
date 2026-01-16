import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { BrowserProvider } from 'ethers'
import toast from 'react-hot-toast'

interface WalletContextType {
  address: string | null
  isConnected: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  provider: BrowserProvider | null
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [provider, setProvider] = useState<BrowserProvider | null>(null)

  useEffect(() => {
    // Check if wallet was previously connected
    const savedAddress = localStorage.getItem('walletAddress')
    if (savedAddress && window.ethereum) {
      setAddress(savedAddress)
      setProvider(new BrowserProvider(window.ethereum))
    }

    // Listen for account changes
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: unknown) => {
        const accountsArray = accounts as string[]
        if (accountsArray.length > 0) {
          setAddress(accountsArray[0])
          localStorage.setItem('walletAddress', accountsArray[0])
        } else {
          setAddress(null)
          localStorage.removeItem('walletAddress')
        }
      }

      const handleChainChanged = () => {
        // Reload page on chain change
        window.location.reload()
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
          window.ethereum.removeListener('chainChanged', handleChainChanged)
        }
      }
    }
  }, [])

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask or another Ethereum wallet', {
        duration: 5000,
      })
      return
    }

    try {
      const loadingToast = toast.loading('Connecting wallet...')
      const provider = new BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      
      setAddress(address)
      setProvider(provider)
      localStorage.setItem('walletAddress', address)
      
      toast.dismiss(loadingToast)
      toast.success(`Wallet connected: ${address.slice(0, 6)}...${address.slice(-4)}`)
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast.error('Failed to connect wallet. Please try again.')
    }
  }

  const disconnectWallet = () => {
    setAddress(null)
    setProvider(null)
    localStorage.removeItem('walletAddress')
    toast.success('Wallet disconnected')
  }

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        connectWallet,
        disconnectWallet,
        provider,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      send: (method: string, params?: unknown[]) => Promise<unknown>
      on: (event: string, callback: (args: unknown) => void) => void
      removeListener: (event: string, callback: (args: unknown) => void) => void
      isMetaMask?: boolean
    }
  }
}
