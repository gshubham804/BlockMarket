import { Link } from 'react-router-dom'
import { WholeBlockMarket, PreconfMarket } from '../types'

interface MarketTableProps {
  data: (WholeBlockMarket | PreconfMarket)[]
  marketType: 'wholeblock' | 'preconf'
}

export default function MarketTable({ data, marketType }: MarketTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#131316] rounded-lg border border-[#1E1E22] shadow-card p-12 text-center">
        <div className="text-[#C9CCD3]">No markets available</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {data.map((market) => (
          <div key={market.marketId} className="bg-[#131316] rounded-lg border border-[#1E1E22] p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-[#F5F6FA] font-mono font-medium">Slot {market.slot}</div>
                <div className="text-xs text-[#6B6F78] mt-0.5">{market.name}</div>
                {market.ofac && (
                  <span className="inline-block mt-1 text-[10px] uppercase bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded">OFAC</span>
                )}
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${market.status === 1
                ? 'bg-[#E10600]/20 text-[#E10600]'
                : 'bg-[#6B6F78]/20 text-[#6B6F78]'
                }`}>
                {market.status === 1 ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#C9CCD3]">Price</span>
                <div className="text-right">
                  <div className="text-[#F5F6FA] font-medium">
                    {marketType === 'wholeblock'
                      ? (market as WholeBlockMarket).price || '0.00'
                      : (market as PreconfMarket).midPrice || '0.00'} ETH
                  </div>
                  <div className="text-xs text-[#6B6F78]">Mid: {market.midPrice}</div>
                </div>
              </div>

              {marketType === 'preconf' && (
                <div className="flex justify-between">
                  <span className="text-[#C9CCD3]">Preconf</span>
                  <div className="text-right text-[#F5F6FA]">
                    <div>{(market as PreconfMarket).availablePreconf?.toLocaleString() || '0'} / {(market as PreconfMarket).totalPreconf?.toLocaleString() || '0'}</div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-[#1E1E22] mt-2">
                <span className="text-[#6B6F78] text-xs">Maturity</span>
                <span className="text-[#C9CCD3] text-xs font-mono">{new Date(market.maturityTime).toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6F78] text-xs">Block Time</span>
                <span className="text-[#C9CCD3] text-xs font-mono">{new Date(market.blockTime).toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="mt-4">
              <Link
                to="/buy"
                state={{ marketType, market }}
                className="block w-full text-center px-4 py-3 bg-[#E10600] hover:bg-[#9B0500] text-[#F5F6FA] text-sm font-medium rounded transition-all shadow-button-3d hover:shadow-red-glow cursor-pointer"
              >
                Buy
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-[#131316] rounded-lg border border-[#1E1E22] shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E1E22]">
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#C9CCD3]">Slot / Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#C9CCD3]">Price (ETH)</th>
                {marketType === 'preconf' && (
                  <th className="text-left py-4 px-6 text-sm font-semibold text-[#C9CCD3]">Preconf</th>
                )}
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#C9CCD3]">Timestamps</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#C9CCD3]">Status</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-[#C9CCD3]">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((market) => (
                <tr
                  key={market.marketId}
                  className="border-b border-[#1E1E22] hover:bg-[#0B0B0D] transition-colors"
                >
                  <td className="py-4 px-6 text-[#F5F6FA]">
                    <div className="font-mono text-sm">{market.slot}</div>
                    <div className="text-xs text-[#6B6F78] mt-1">{market.name}</div>
                    {market.ofac && (
                      <span className="inline-block mt-1 text-[10px] uppercase bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded">OFAC</span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-[#F5F6FA] font-medium">
                    {marketType === 'wholeblock'
                      ? (market as WholeBlockMarket).price || '0.00000000000'
                      : (market as PreconfMarket).midPrice || '0.00000000000'} ETH
                    <div className="text-xs text-[#6B6F78] font-normal mt-0.5">
                      Mid: {market.midPrice}
                    </div>
                  </td>

                  {marketType === 'preconf' && (
                    <td className="py-4 px-6 text-[#C9CCD3] text-sm">
                      <div>Avail: {(market as PreconfMarket).availablePreconf?.toLocaleString() || '0'}</div>
                      <div className="text-xs text-[#6B6F78]">Total: {(market as PreconfMarket).totalPreconf?.toLocaleString() || '0'}</div>
                    </td>
                  )}

                  <td className="py-4 px-6 text-[#C9CCD3] text-xs">
                    <div>Mat: {new Date(market.maturityTime).toLocaleTimeString()}</div>
                    <div>Blk: {new Date(market.blockTime).toLocaleTimeString()}</div>
                  </td>

                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${market.status === 1
                      ? 'bg-[#E10600]/20 text-[#E10600]'
                      : 'bg-[#6B6F78]/20 text-[#6B6F78]'
                      }`}>
                      {market.status === 1 ? 'Active' : 'Inactive'}
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
    </div>
  )
}
