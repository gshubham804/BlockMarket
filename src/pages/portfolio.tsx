import { Link } from 'react-router-dom'
import WalletConnect from '../components/WalletConnect'

function PortfolioPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#F5F6FA]">
      {/* Navigation */}
      <nav className="border-b border-[#1E1E22] bg-[#0B0B0D]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-0">
            <img 
              src="/assets/BlockMarketLogo.png" 
              alt="BlockMarket" 
              className="h-12 w-12"
            />
            <span className="text-xl font-bold text-[#F5F6FA]">BlockMarket</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/execute" className="text-sm text-[#C9CCD3] hover:text-[#F5F6FA] transition-colors cursor-pointer">
              Execute
            </Link>
            <Link to="/trade" className="text-sm text-[#C9CCD3] hover:text-[#F5F6FA] transition-colors cursor-pointer">
              Trade
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
            My Portfolio
          </h1>
          <p className="text-lg text-[#C9CCD3]">
            Manage your blockspace commitments
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#131316] rounded-lg border border-[#1E1E22] shadow-card p-6">
            <p className="text-sm text-[#C9CCD3] mb-2">Active Commitments</p>
            <p className="text-3xl font-bold text-[#F5F6FA]">3</p>
          </div>
          <div className="bg-[#131316] rounded-lg border border-[#1E1E22] shadow-card p-6">
            <p className="text-sm text-[#C9CCD3] mb-2">Used Commitments</p>
            <p className="text-3xl font-bold text-[#F5F6FA]">12</p>
          </div>
          <div className="bg-[#131316] rounded-lg border border-[#1E1E22] shadow-card p-6">
            <p className="text-sm text-[#C9CCD3] mb-2">Expired Commitments</p>
            <p className="text-3xl font-bold text-[#F5F6FA]">5</p>
          </div>
        </div>

        <div className="bg-[#131316] rounded-lg border border-[#1E1E22] shadow-card p-8">
          <h2 className="text-2xl font-bold text-[#F5F6FA] mb-6">
            My Commitments
          </h2>
          <div className="space-y-4">
            {[
              { range: '18,500,000 - 18,500,010', status: 'Active', expires: '2024-01-20' },
              { range: '18,500,010 - 18,500,020', status: 'Active', expires: '2024-01-21' },
              { range: '18,500,020 - 18,500,030', status: 'Used', expires: '2024-01-19' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-[#0B0B0D] rounded-lg border border-[#1E1E22] flex items-center justify-between">
                <div>
                  <p className="text-[#F5F6FA] font-medium">{item.range}</p>
                  <p className="text-sm text-[#6B6F78]">Expires: {item.expires}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${
                    item.status === 'Active' 
                      ? 'bg-[#E10600]/20 text-[#E10600]' 
                      : 'bg-[#6B6F78]/20 text-[#6B6F78]'
                  }`}>
                    {item.status}
                  </span>
                  {item.status === 'Active' && (
                    <button className="px-4 py-2 bg-[#E10600] hover:bg-[#9B0500] text-[#F5F6FA] text-sm font-medium rounded transition-all shadow-button-3d hover:shadow-red-glow cursor-pointer">
                      Use
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioPage
