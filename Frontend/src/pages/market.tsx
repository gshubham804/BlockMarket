import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import MarketTable from '../components/MarketTable'
import api from '../lib/api'
import { WholeBlockMarket, PreconfMarket } from '../types'

type MarketType = 'wholeblock' | 'inclusion-preconf'

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState<MarketType>('wholeblock')
  const [marketData, setMarketData] = useState<(WholeBlockMarket | PreconfMarket)[]>([])
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

      if (data && data.market && data.market.data && data.market.data.markets) {
        setMarketData(data.market.data.markets)
      } else {
        console.error('Unexpected API response structure:', data)
        throw new Error('Invalid API response')
      }

    } catch (err: any) {
      console.error('Error loading market data:', err)
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
            onClick={() => {
              setMarketData([])
              setLoading(true)
              setActiveTab('wholeblock')
            }}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'wholeblock'
              ? 'border-[#E10600] text-[#E10600]'
              : 'border-transparent text-[#C9CCD3] hover:text-[#F5F6FA]'
              }`}
          >
            Whole Block
          </button>
          <button
            onClick={() => {
              setMarketData([])
              setLoading(true)
              setActiveTab('inclusion-preconf')
            }}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'inclusion-preconf'
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
          <div className="space-y-4">
            <div className="bg-[#131316] border border-[#1E1E22] rounded-lg p-6 shadow-card">
              <div className="text-[#E10600] mb-2">Error loading market</div>
              <div className="text-sm text-[#C9CCD3]">{error}</div>
              <div className="text-sm text-[#6B6F78] mt-2">Showing mock data for development</div>
            </div>
            <MarketTable data={marketData} marketType={activeTab} />
          </div>
        ) : (
          <MarketTable data={marketData} marketType={activeTab} />
        )}
      </div>
    </Layout>
  )
}

// Mock data for development
function getMockMarketData(type: MarketType): (WholeBlockMarket | PreconfMarket)[] {
  const now = Date.now()
  if (type === 'wholeblock') {
    const mockWholeBlock: WholeBlockMarket[] = [
      {
        marketId: 2000013499318,
        slot: 13499318,
        instrumentId: "ETH-WB-13499318",
        name: "ETH Whole Block Slot #13499318",
        priceStep: "0.00000000001",
        minPrice: "0.00000000001",
        maxPrice: "0.00001",
        availablePreconf: 58850000,
        direction: false,
        price: "0.00000000019",
        midPrice: "0.00000000025",
        status: 1,
        maturityTime: now + 5000,
        blockTime: now + 9000,
        finalityTime: now + 100000,
        updateDate: now - 1000,
        ofac: false
      },
      {
        marketId: 2000013499322,
        slot: 13499322,
        instrumentId: "ETH-WB-13499322",
        name: "ETH Whole Block Slot #13499322",
        priceStep: "0.00000000001",
        minPrice: "0.00000000001",
        maxPrice: "0.00001",
        availablePreconf: 58850000,
        direction: false,
        price: "0.00000000022",
        midPrice: "0.00000000029",
        status: 1,
        maturityTime: now + 15000,
        blockTime: now + 19000,
        finalityTime: now + 110000,
        updateDate: now - 1000,
        ofac: true
      }
    ]
    return mockWholeBlock
  } else {
    const mockPreconf: PreconfMarket[] = [
      {
        marketId: 1000013499318,
        slot: 13499318,
        instrumentId: "ETH-PC-13499318",
        name: "Eth Preconf Inclusion Slot #13499318",
        quantityStep: "1",
        minQuantity: "1",
        maxQuantity: "58850000",
        priceStep: "0.00000000001",
        minPrice: "0.00000000001",
        maxPrice: "0.00001",
        totalPreconf: 58850000,
        availablePreconf: 58850000,
        midPrice: "0.00000000019",
        status: 1,
        maturityTime: now + 5000,
        trxSubmitTime: now + 7000,
        blockTime: now + 9000,
        finalityTime: now + 100000,
        totalGas: 0,
        validatorType: 0,
        updateDate: now - 2000,
        ofac: false
      },
      {
        marketId: 1000013499322,
        slot: 13499322,
        instrumentId: "ETH-PC-13499322",
        name: "Eth Preconf Inclusion Slot #13499322",
        quantityStep: "1",
        minQuantity: "1",
        maxQuantity: "58850000",
        priceStep: "0.00000000001",
        minPrice: "0.00000000001",
        maxPrice: "0.00001",
        totalPreconf: 58850000,
        availablePreconf: 58850000,
        midPrice: "0.00000000022",
        status: 1,
        maturityTime: now + 15000,
        trxSubmitTime: now + 17000,
        blockTime: now + 19000,
        finalityTime: now + 110000,
        totalGas: 0,
        validatorType: 1,
        updateDate: now - 2000,
        ofac: true
      }
    ]
    return mockPreconf
  }
}
