import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from 'react-hot-toast'
import { store, persistor } from './store/store'
import MarketPage from './pages/market'
import BuyPage from './pages/buy'
import PortfolioPage from './pages/portfolio'
import LoginPage from './pages/login'

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/market" replace />} />
            <Route path="/market" element={<MarketPage />} />
            <Route path="/buy" element={<BuyPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#131316',
                color: '#F5F6FA',
                border: '1px solid #1E1E22',
                borderRadius: '8px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
              },
              success: {
                iconTheme: {
                  primary: '#E10600',
                  secondary: '#F5F6FA',
                },
              },
              error: {
                iconTheme: {
                  primary: '#E10600',
                  secondary: '#F5F6FA',
                },
              },
            }}
          />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  )
}

export default App
