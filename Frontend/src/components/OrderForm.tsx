import { useState, useEffect } from 'react'
import api from '../lib/api'
import toast from 'react-hot-toast'

interface OrderFormProps {
  marketType: 'wholeblock' | 'inclusion-preconf'
  onMarketTypeChange: (type: 'wholeblock' | 'inclusion-preconf') => void
  prefilledMarket?: any
  onOrderPlaced: () => void
}

export default function OrderForm({
  marketType,
  onMarketTypeChange,
  prefilledMarket,
  onOrderPlaced,
}: OrderFormProps) {
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [blockStart, setBlockStart] = useState<string>('')
  const [blockEnd, setBlockEnd] = useState<string>('')
  const [price, setPrice] = useState<string>('')
  const [quantity, setQuantity] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (prefilledMarket) {
      setBlockStart(String(prefilledMarket.blockRange?.start || prefilledMarket.start || ''))
      setBlockEnd(String(prefilledMarket.blockRange?.end || prefilledMarket.end || ''))
      setPrice(prefilledMarket.price || '')
    }
  }, [prefilledMarket])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.placeOrder({
        marketType,
        side,
        blockRange: {
          start: parseInt(blockStart),
          end: parseInt(blockEnd),
        },
        price,
        quantity: quantity || undefined,
      })

      onOrderPlaced()
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Market Type Selection */}
      <div>
        <label className="block text-sm font-medium text-[#C9CCD3] mb-2">
          Market Type
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onMarketTypeChange('wholeblock')}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              marketType === 'wholeblock'
                ? 'bg-[#E10600] text-[#F5F6FA]'
                : 'bg-[#0B0B0D] text-[#C9CCD3] border border-[#1E1E22] hover:border-[#E10600]'
            }`}
          >
            Whole Block
          </button>
          <button
            type="button"
            onClick={() => onMarketTypeChange('inclusion-preconf')}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              marketType === 'inclusion-preconf'
                ? 'bg-[#E10600] text-[#F5F6FA]'
                : 'bg-[#0B0B0D] text-[#C9CCD3] border border-[#1E1E22] hover:border-[#E10600]'
            }`}
          >
            Inclusion Preconf
          </button>
        </div>
      </div>

      {/* Side Selection */}
      <div>
        <label className="block text-sm font-medium text-[#C9CCD3] mb-2">
          Side
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSide('buy')}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              side === 'buy'
                ? 'bg-[#E10600] text-[#F5F6FA]'
                : 'bg-[#0B0B0D] text-[#C9CCD3] border border-[#1E1E22] hover:border-[#E10600]'
            }`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => setSide('sell')}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              side === 'sell'
                ? 'bg-[#E10600] text-[#F5F6FA]'
                : 'bg-[#0B0B0D] text-[#C9CCD3] border border-[#1E1E22] hover:border-[#E10600]'
            }`}
          >
            Sell
          </button>
        </div>
      </div>

      {/* Block Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#C9CCD3] mb-2">
            Block Start
          </label>
          <input
            type="number"
            value={blockStart}
            onChange={(e) => setBlockStart(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#1E1E22] rounded-lg text-[#F5F6FA] placeholder-[#6B6F78] focus:outline-none focus:border-[#E10600] transition-colors"
            placeholder="18500000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#C9CCD3] mb-2">
            Block End
          </label>
          <input
            type="number"
            value={blockEnd}
            onChange={(e) => setBlockEnd(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#1E1E22] rounded-lg text-[#F5F6FA] placeholder-[#6B6F78] focus:outline-none focus:border-[#E10600] transition-colors"
            placeholder="18500010"
          />
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-[#C9CCD3] mb-2">
          Price (ETH)
        </label>
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#1E1E22] rounded-lg text-[#F5F6FA] placeholder-[#6B6F78] focus:outline-none focus:border-[#E10600] transition-colors"
          placeholder="0.05"
        />
      </div>

      {/* Quantity (Optional) */}
      <div>
        <label className="block text-sm font-medium text-[#C9CCD3] mb-2">
          Quantity (Optional)
        </label>
        <input
          type="text"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#1E1E22] rounded-lg text-[#F5F6FA] placeholder-[#6B6F78] focus:outline-none focus:border-[#E10600] transition-colors"
          placeholder="1"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-4 bg-[#E10600] hover:bg-[#9B0500] disabled:opacity-50 disabled:cursor-not-allowed text-[#F5F6FA] font-semibold rounded-lg transition-all shadow-button-3d hover:shadow-red-glow cursor-pointer"
      >
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>
    </form>
  )
}
