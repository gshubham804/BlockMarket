import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import authService, { AuthUser, PendingLogin } from '../lib/auth'

interface AuthState {
  user: AuthUser | null
  pendingLogin: PendingLogin | null
  loading: boolean
  verifying: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  pendingLogin: null,
  loading: false,
  verifying: false,
  error: null,
}

/**
 * Async thunk for initiating login (connect wallet + get EIP-712 message)
 */
export const initiateLogin = createAsyncThunk(
  'auth/initiateLogin',
  async (_, { rejectWithValue }) => {
    try {
      const pendingLogin = await authService.initiateLogin()
      return pendingLogin
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login initiation failed')
    }
  }
)

/**
 * Async thunk for verifying login (sign + verify)
 */
export const verifyLogin = createAsyncThunk(
  'auth/verifyLogin',
  async (_, { getState, rejectWithValue }) => {
    console.log('🟢 [Frontend] Redux verifyLogin thunk called')
    try {
      const state = getState() as { auth: AuthState }
      const pendingLogin = state.auth.pendingLogin
      
      console.log('🟢 [Frontend] Checking pendingLogin:', {
        exists: !!pendingLogin,
        address: pendingLogin?.address,
        nonceHash: pendingLogin?.nonceHash,
      })
      
      if (!pendingLogin) {
        console.error('❌ [Frontend] No pending login found')
        throw new Error('No pending login found. Please initiate login first.')
      }

      console.log('🟢 [Frontend] Calling authService.verifyLogin()...')
      const user = await authService.verifyLogin(pendingLogin)
      console.log('✅ [Frontend] Redux verifyLogin thunk completed:', {
        userId: user.id,
        address: user.address,
      })
      return user
    } catch (error: any) {
      console.error('❌ [Frontend] Redux verifyLogin thunk error:', error)
      console.error('  Error message:', error.message)
      return rejectWithValue(error.message || 'Login verification failed')
    }
  }
)

/**
 * Async thunk for complete login (for backward compatibility)
 */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.login()
      return user
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed')
    }
  }
)

/**
 * Async thunk for fetching current user
 */
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser()
      return user
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout()
      state.user = null
      state.pendingLogin = null
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
    clearPendingLogin: (state) => {
      state.pendingLogin = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Initiate login
      .addCase(initiateLogin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(initiateLogin.fulfilled, (state, action) => {
        state.loading = false
        state.pendingLogin = action.payload
        state.error = null
      })
      .addCase(initiateLogin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.pendingLogin = null
      })
      // Verify login
      .addCase(verifyLogin.pending, (state) => {
        state.verifying = true
        state.error = null
      })
      .addCase(verifyLogin.fulfilled, (state, action) => {
        state.verifying = false
        state.user = action.payload
        state.pendingLogin = null
        state.error = null
      })
      .addCase(verifyLogin.rejected, (state, action) => {
        state.verifying = false
        state.error = action.payload as string
      })
      // Complete login (backward compatibility)
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.pendingLogin = null
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.pendingLogin = null
      })
      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false
        state.user = null
      })
  },
})

export const { logout, clearError, clearPendingLogin } = authSlice.actions
export default authSlice.reducer
