import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { BrowserProvider } from 'ethers'
import toast from 'react-hot-toast'

interface WalletState {
  address: string | null
  isConnected: boolean
  provider: BrowserProvider | null
}

const initialState: WalletState = {
  address: null,
  isConnected: false,
  provider: null,
}

// Async thunk for connecting wallet
export const connectWallet = createAsyncThunk(
  'wallet/connect',
  async (_, { rejectWithValue }) => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask or another Ethereum wallet', {
        duration: 5000,
      })
      return rejectWithValue('No wallet found')
    }

    try {
      const loadingToast = toast.loading('Connecting wallet...')
      const provider = new BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      
      toast.dismiss(loadingToast)
      toast.success(`Wallet connected: ${address.slice(0, 6)}...${address.slice(-4)}`)
      
      return { address, provider }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast.error('Failed to connect wallet. Please try again.')
      return rejectWithValue('Connection failed')
    }
  }
)

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet: (state, action: PayloadAction<{ address: string; provider: BrowserProvider }>) => {
      state.address = action.payload.address
      state.isConnected = true
      state.provider = action.payload.provider
    },
    clearWallet: (state) => {
      state.address = null
      state.isConnected = false
      state.provider = null
      toast.success('Wallet disconnected')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectWallet.fulfilled, (state, action) => {
        if (action.payload) {
          state.address = action.payload.address
          state.isConnected = true
          state.provider = action.payload.provider
        }
      })
      .addCase(connectWallet.rejected, (state) => {
        state.address = null
        state.isConnected = false
        state.provider = null
      })
  },
})

export const { setWallet, clearWallet } = walletSlice.actions

export default walletSlice.reducer

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
