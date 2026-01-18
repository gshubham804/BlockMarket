import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import MarketTable from '../components/MarketTable'
import api from '../lib/api'

type MarketType = 'wholeblock' | 'preconf'

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState<MarketType>('wholeblock')
  const [marketData, setMarketData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMarketData()
  }, [activeTab])

  const loadMarketData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = activeTab === 'wholeblock'
        ? await api.getWholeBlockMarket()
        : await api.getPreconfMarket()
      setMarketData(data.market)
    } catch (err: any) {
      setError(err.message || 'Failed to load market data')
      // Use mock data on error for development
      setMarketData(getMockMarketData(activeTab))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-[#F5F6FA] mb-2">Blockspace Market</h1>
          <p className="text-[#C9CCD3]">View and trade Ethereum blockspace commitments</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[#1E1E22]">
          <button
            onClick={() => setActiveTab('wholeblock')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'wholeblock'
                ? 'border-[#E10600] text-[#E10600]'
                : 'border-transparent text-[#C9CCD3] hover:text-[#F5F6FA]'
            }`}
          >
            Whole Block
          </button>
          <button
            onClick={() => setActiveTab('preconf')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'preconf'
                ? 'border-[#E10600] text-[#E10600]'
                : 'border-transparent text-[#C9CCD3] hover:text-[#F5F6FA]'
            }`}
          >
            Inclusion Preconf
          </button>
        </div>

        {/* Market Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-[#C9CCD3]">Loading market data...</div>
          </div>
        ) : error ? (
          <div className="bg-[#131316] border border-[#1E1E22] rounded-lg p-6 shadow-card">
            <div className="text-[#E10600] mb-2">Error loading market</div>
            <div className="text-sm text-[#C9CCD3]">{error}</div>
            <div className="text-sm text-[#6B6F78] mt-2">Showing mock data for development</div>
          </div>
        ) : (
          <MarketTable data={marketData} marketType={activeTab} />
        )}
      </div>
    </Layout>
  )
}

// Mock data for development
function getMockMarketData(type: MarketType): any {
  return {
    marketType: type,
    normalized: true,
    timestamp: new Date().toISOString(),
    markets: [
      {
        id: '1',
        blockRange: { start: 18500000, end: 18500010 },
        price: '0.05',
        collateral: '0.1',
        status: 'available',
      },
      {
        id: '2',
        blockRange: { start: 18500010, end: 18500020 },
        price: '0.08',
        collateral: '0.15',
        status: 'available',
      },
      {
        id: '3',
        blockRange: { start: 18500020, end: 18500030 },
        price: '0.06',
        collateral: '0.12',
        status: 'available',
      },
    ],
  }
}
