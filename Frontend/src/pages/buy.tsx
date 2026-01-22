import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import Layout from '../components/Layout'
import OrderForm from '../components/OrderForm'
import WalletConnectModal from '../components/WalletConnectModal'
import { useAuth } from '../hooks/useAuth'

export default function BuyPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { marketType: initialMarketType, market } = location.state || {}

  // State for market type, defaulting to passed state or 'wholeblock'
  const [marketType, setMarketType] = useState<'wholeblock' | 'inclusion-preconf'>(
    initialMarketType || 'wholeblock'
  )

  const { user } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOrderPlaced = () => {
    toast.success('Order placed successfully!')
    navigate('/portfolio')
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#F5F6FA] mb-6">Place Order</h1>

        {!user ? (
          <div className="bg-[#131316] rounded-xl border border-[#1E1E22] p-8 text-center shadow-card">
            <div className="w-16 h-16 bg-[#1E1E22] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#C9CCD3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#F5F6FA] mb-2">Authentication Required</h2>
            <p className="text-[#C9CCD3] mb-6">
              You need to connect your wallet and verify your identity to place orders on the market.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3 bg-[#E10600] hover:bg-[#9B0500] text-[#F5F6FA] font-medium rounded-lg transition-all shadow-button-3d hover:shadow-red-glow"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <OrderForm
            marketType={marketType}
            onMarketTypeChange={setMarketType}
            prefilledMarket={market}
            onOrderPlaced={handleOrderPlaced}
          />
        )}

        <WalletConnectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </Layout>
  )
}
