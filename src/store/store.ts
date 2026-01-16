import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage/session'
import walletReducer from './walletSlice'

const walletPersistConfig = {
  key: 'wallet',
  storage,
  whitelist: ['address', 'isConnected'], // Only persist address and isConnected, not provider
}

const persistedWalletReducer = persistReducer(walletPersistConfig, walletReducer)

export const store = configureStore({
  reducer: {
    wallet: persistedWalletReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ['wallet.provider'],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
