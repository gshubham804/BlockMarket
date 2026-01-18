import { Link } from 'react-router-dom'

interface MarketTableProps {
  data: any
  marketType: 'wholeblock' | 'preconf'
}

export default function MarketTable({ data, marketType }: MarketTableProps) {
  // Extract markets from response
  const markets = data?.markets || data?.data?.markets || []

  if (markets.length === 0) {
    return (
      <div className="bg-[#131316] rounded-lg border border-[#1E1E22] shadow-card p-12 text-center">
        <div className="text-[#C9CCD3]">No markets available</div>
      </div>
    )
  }

  return (
    <div className="bg-[#131316] rounded-lg border border-[#1E1E22] shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1E1E22]">
              <th className="text-left py-4 px-6 text-sm font-semibold text-[#C9CCD3]">Block Range</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-[#C9CCD3]">Price (ETH)</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-[#C9CCD3]">Collateral</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-[#C9CCD3]">Status</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-[#C9CCD3]">Action</th>
            </tr>
          </thead>
          <tbody>
            {markets.map((market: any) => (
              <tr
                key={market.id}
                className="border-b border-[#1E1E22] hover:bg-[#0B0B0D] transition-colors"
              >
                <td className="py-4 px-6 text-[#F5F6FA] font-mono text-sm">
                  {market.blockRange?.start || market.start} - {market.blockRange?.end || market.end}
                </td>
                <td className="py-4 px-6 text-[#F5F6FA] font-medium">
                  {market.price || '0.00'} ETH
                </td>
                <td className="py-4 px-6 text-[#C9CCD3]">
                  {market.collateral || 'N/A'}
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    market.status === 'available'
                      ? 'bg-[#E10600]/20 text-[#E10600]'
                      : 'bg-[#6B6F78]/20 text-[#6B6F78]'
                  }`}>
                    {market.status || 'available'}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <Link
                    to="/buy"
                    state={{ marketType, market }}
                    className="inline-block px-4 py-2 bg-[#E10600] hover:bg-[#9B0500] text-[#F5F6FA] text-sm font-medium rounded transition-all shadow-button-3d hover:shadow-red-glow cursor-pointer"
                  >
                    Buy
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
