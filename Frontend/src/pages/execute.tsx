import { Link } from 'react-router-dom'
import WalletConnect from '../components/WalletConnect'

function ExecutePage() {
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
            <Link to="/trade" className="text-sm text-[#C9CCD3] hover:text-[#F5F6FA] transition-colors cursor-pointer">
              Trade
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
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#F5F6FA] mb-4">
            Execute Transactions
          </h1>
          <p className="text-lg text-[#C9CCD3]">
            Send gasless transactions with predictable execution
          </p>
        </div>

        <div className="bg-[#131316] rounded-lg border border-[#1E1E22] shadow-card p-8">
          <h2 className="text-2xl font-bold text-[#F5F6FA] mb-6">
            Transaction Form
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#C9CCD3] mb-2">
                To Address
              </label>
              <input
                type="text"
                placeholder="0x..."
                className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#1E1E22] rounded-lg text-[#F5F6FA] placeholder-[#6B6F78] focus:outline-none focus:border-[#E10600] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#C9CCD3] mb-2">
                Amount (ETH)
              </label>
              <input
                type="number"
                placeholder="0.0"
                step="0.001"
                className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#1E1E22] rounded-lg text-[#F5F6FA] placeholder-[#6B6F78] focus:outline-none focus:border-[#E10600] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#C9CCD3] mb-2">
                Data (Optional)
              </label>
              <textarea
                placeholder="0x..."
                rows={4}
                className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#1E1E22] rounded-lg text-[#F5F6FA] placeholder-[#6B6F78] focus:outline-none focus:border-[#E10600] transition-colors resize-none"
              />
            </div>
            <button className="w-full px-6 py-4 bg-[#E10600] hover:bg-[#9B0500] text-[#F5F6FA] font-semibold rounded-lg transition-all shadow-button-3d hover:shadow-red-glow cursor-pointer">
              Submit Transaction
            </button>
          </div>
        </div>

        <div className="mt-8 bg-[#131316] rounded-lg border border-[#1E1E22] shadow-card p-8">
          <h2 className="text-2xl font-bold text-[#F5F6FA] mb-6">
            Execution Timeline
          </h2>
          <div className="space-y-4">
            {['Submitted', 'Reserved', 'Preconfirmed', 'Included'].map((stage, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  idx === 0 ? 'bg-[#E10600] text-[#F5F6FA]' : 'bg-[#1E1E22] text-[#6B6F78]'
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <p className={`font-semibold ${idx === 0 ? 'text-[#E10600]' : 'text-[#C9CCD3]'}`}>
                    {stage}
                  </p>
                  <p className="text-sm text-[#6B6F78]">
                    {idx === 0 ? 'Transaction submitted successfully' : 'Pending...'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExecutePage
