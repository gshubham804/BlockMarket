import { Link } from 'react-router-dom'
import WalletConnect from '../components/WalletConnect'

function HistoryPage() {
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
            <Link to="/portfolio" className="text-sm text-[#C9CCD3] hover:text-[#F5F6FA] transition-colors cursor-pointer">
              Portfolio
            </Link>
            <WalletConnect />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#F5F6FA] mb-4">
            Transaction History
          </h1>
          <p className="text-lg text-[#C9CCD3]">
            View all your transaction history and execution status
          </p>
        </div>

        <div className="bg-[#131316] rounded-lg border border-[#1E1E22] shadow-card p-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1E1E22]">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#C9CCD3]">Transaction Hash</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#C9CCD3]">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#C9CCD3]">Block</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#C9CCD3]">Date</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { hash: '0x1234...5678', status: 'Included', block: '18,500,045', date: '2024-01-14 10:30' },
                  { hash: '0xabcd...efgh', status: 'Preconfirmed', block: '18,500,046', date: '2024-01-14 10:25' },
                  { hash: '0x9876...5432', status: 'Reserved', block: '-', date: '2024-01-14 10:20' },
                ].map((item, idx) => (
                  <tr key={idx} className="border-b border-[#1E1E22] hover:bg-[#0B0B0D] transition-colors">
                    <td className="py-4 px-4 text-[#F5F6FA] font-mono text-sm">{item.hash}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status === 'Included' 
                          ? 'bg-[#E10600]/20 text-[#E10600]' 
                          : item.status === 'Preconfirmed'
                          ? 'bg-[#C9CCD3]/20 text-[#C9CCD3]'
                          : 'bg-[#6B6F78]/20 text-[#6B6F78]'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[#C9CCD3]">{item.block}</td>
                    <td className="py-4 px-4 text-[#C9CCD3]">{item.date}</td>
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

export default HistoryPage
