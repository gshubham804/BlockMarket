import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import OrderForm from '../components/OrderForm'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export default function BuyPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [marketType, setMarketType] = useState<'wholeblock' | 'inclusion-preconf'>('wholeblock')
  const [prefilledMarket, setPrefilledMarket] = useState<any>(null)

  useEffect(() => {
    // Check if coming from market page with prefilled data
    if (location.state?.marketType) {
      setMarketType(location.state.marketType)
    }
    if (location.state?.market) {
      setPrefilledMarket(location.state.market)
    }
  }, [location])

  const handleOrderPlaced = () => {
    toast.success('Order placed successfully!')
    navigate('/portfolio')
  }

  if (!user) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#131316] rounded-lg border border-[#1E1E22] shadow-card p-8 text-center">
            <h2 className="text-2xl font-bold text-[#F5F6FA] mb-4">Authentication Required</h2>
            <p className="text-[#C9CCD3] mb-6">
              Please connect your wallet to place orders
            </p>
            <button
              onClick={() => navigate('/market')}
              className="px-6 py-3 bg-[#E10600] hover:bg-[#9B0500] text-[#F5F6FA] font-medium rounded transition-all shadow-button-3d hover:shadow-red-glow cursor-pointer"
            >
              Go to Market
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-[#F5F6FA] mb-2">Place Order</h1>
          <p className="text-[#C9CCD3]">Buy or sell blockspace commitments</p>
        </div>

        <div className="bg-[#131316] rounded-lg border border-[#1E1E22] shadow-card p-8">
          <OrderForm
            marketType={marketType}
            onMarketTypeChange={setMarketType}
            prefilledMarket={prefilledMarket}
            onOrderPlaced={handleOrderPlaced}
          />
        </div>
      </div>
    </Layout>
  )
}
