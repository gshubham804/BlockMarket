import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import PortfolioTable from '../components/PortfolioTable'
import { useAuth } from '../hooks/useAuth'
import api from '../lib/api'
import toast from 'react-hot-toast'

export default function PortfolioPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'wholeblock' | 'inclusion-preconf'>('all')

  useEffect(() => {
    if (user) {
      loadOrders()
    }
  }, [user, filter])

  const loadOrders = async () => {
    if (!user) return

    setLoading(true)
    try {
      const marketType = filter === 'all' ? undefined : filter
      const { orders: userOrders } = await api.getMyOrders(marketType)
      setOrders(userOrders || [])
    } catch (error: any) {
      toast.error(error.message || 'Failed to load orders')
      // Use mock data on error
      setOrders(getMockOrders())
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (orderId: string) => {
    try {
      await api.cancelOrder(orderId)
      toast.success('Order cancelled')
      loadOrders()
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel order')
    }
  }

  if (!user) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#131316] rounded-lg border border-[#1E1E22] shadow-card p-8 text-center">
            <h2 className="text-2xl font-bold text-[#F5F6FA] mb-4">Authentication Required</h2>
            <p className="text-[#C9CCD3] mb-6">
              Please connect your wallet to view your portfolio
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
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-[#F5F6FA] mb-2">My Portfolio</h1>
          <p className="text-[#C9CCD3]">View and manage your blockspace orders</p>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              filter === 'all'
                ? 'bg-[#E10600] text-[#F5F6FA]'
                : 'bg-[#131316] text-[#C9CCD3] border border-[#1E1E22] hover:border-[#E10600]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('wholeblock')}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              filter === 'wholeblock'
                ? 'bg-[#E10600] text-[#F5F6FA]'
                : 'bg-[#131316] text-[#C9CCD3] border border-[#1E1E22] hover:border-[#E10600]'
            }`}
          >
            Whole Block
          </button>
          <button
            onClick={() => setFilter('inclusion-preconf')}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              filter === 'inclusion-preconf'
                ? 'bg-[#E10600] text-[#F5F6FA]'
                : 'bg-[#131316] text-[#C9CCD3] border border-[#1E1E22] hover:border-[#E10600]'
            }`}
          >
            Inclusion Preconf
          </button>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-[#C9CCD3]">Loading orders...</div>
          </div>
        ) : (
          <PortfolioTable orders={orders} onCancel={handleCancel} />
        )}
      </div>
    </Layout>
  )
}

// Mock data for development
function getMockOrders(): any[] {
  return [
    {
      _id: '1',
      marketType: 'wholeblock',
      side: 'buy',
      blockRange: { start: 18500000, end: 18500010 },
      price: '0.05',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      _id: '2',
      marketType: 'inclusion-preconf',
      side: 'sell',
      blockRange: { start: 18500010, end: 18500020 },
      price: '0.08',
      status: 'filled',
      createdAt: new Date().toISOString(),
    },
  ]
}
