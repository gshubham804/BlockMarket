import { useEffect } from 'react'
import { BrowserProvider } from 'ethers'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setWallet, clearWallet, connectWallet } from '../store/walletSlice'

export function useWallet() {
  const dispatch = useAppDispatch()
  const { address, isConnected, provider } = useAppSelector((state) => state.wallet)

  // Restore provider when address is rehydrated from sessionStorage
  useEffect(() => {
    if (address && !provider && window.ethereum) {
      const restoredProvider = new BrowserProvider(window.ethereum)
      dispatch(setWallet({ address, provider: restoredProvider }))
    }
  }, [address, provider, dispatch])

  useEffect(() => {
    // Listen for account changes
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: unknown) => {
        const accountsArray = accounts as string[]
        if (accountsArray.length > 0) {
          const provider = new BrowserProvider(window.ethereum!)
          dispatch(setWallet({ address: accountsArray[0], provider }))
        } else {
          dispatch(clearWallet())
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
  }, [dispatch])

  const handleConnectWallet = () => {
    dispatch(connectWallet())
  }

  const handleDisconnectWallet = () => {
    dispatch(clearWallet())
  }

  return {
    address,
    isConnected,
    provider,
    connectWallet: handleConnectWallet,
    disconnectWallet: handleDisconnectWallet,
  }
}
