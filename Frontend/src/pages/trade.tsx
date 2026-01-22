import { Link } from 'react-router-dom'
import WalletConnect from '../components/WalletConnect'

function TradePage() {
  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#F5F6FA]">
      {/* Navigation */}
      <nav className="border-b border-[#1E1E22] bg-[#0B0B0D]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-0">
            <img 
              src="/BlockMarketLogo.png" 
              alt="BlockMarket" 
              className="h-12 w-12"
            />
            <span className="text-xl font-bold text-[#F5F6FA]">BlockMarket</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/execute" className="text-sm text-[#C9CCD3] hover:text-[#F5F6FA] transition-colors cursor-pointer">
              Execute
            </Link>
            <Link to="/portfolio" className="text-sm text-[#C9CCD3] hover:text-[#F5F6FA] transition-colors cursor-pointer">
              Portfolio
            </Link>
            <Link to="/history" className="text-sm text-[#C9CCD3] hover:text-[#F5F6FA] transition-colors cursor-pointer">
              History
            </Link>
            <WalletConnect />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#F5F6FA] mb-4">
            Blockspace Marketplace
          </h1>
          <p className="text-lg text-[#C9CCD3]">
            Buy, sell, and manage blockspace commitments
          </p>
        </div>

        <div className="bg-[#131316] rounded-lg border border-[#1E1E22] shadow-card p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#F5F6FA]">
              Available Commitments
            </h2>
            <button className="px-4 py-2 bg-[#E10600] hover:bg-[#9B0500] text-[#F5F6FA] font-medium rounded transition-all shadow-button-3d hover:shadow-red-glow cursor-pointer">
              Create Commitment
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1E1E22]">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#C9CCD3]">Block Range</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#C9CCD3]">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#C9CCD3]">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#C9CCD3]">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { range: '18,500,000 - 18,500,010', price: '0.05 ETH', status: 'Available' },
                  { range: '18,500,010 - 18,500,020', price: '0.08 ETH', status: 'Available' },
                  { range: '18,500,020 - 18,500,030', price: '0.06 ETH', status: 'Reserved' },
                ].map((item, idx) => (
                  <tr key={idx} className="border-b border-[#1E1E22] hover:bg-[#0B0B0D] transition-colors">
                    <td className="py-4 px-4 text-[#F5F6FA]">{item.range}</td>
                    <td className="py-4 px-4 text-[#C9CCD3]">{item.price}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status === 'Available' 
                          ? 'bg-[#E10600]/20 text-[#E10600]' 
                          : 'bg-[#6B6F78]/20 text-[#6B6F78]'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="px-4 py-2 bg-[#E10600] hover:bg-[#9B0500] text-[#F5F6FA] text-sm font-medium rounded transition-all shadow-button-3d hover:shadow-red-glow cursor-pointer">
                        Buy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TradePage
