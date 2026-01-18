import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { formatAddress } from '../lib/wallet'

export default function Navbar() {
  const { user, pendingLogin, login, verify, logout, loading, verifying } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="border-b border-[#1E1E22] bg-[#0B0B0D] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/assets/BlockMarketLogo.png" 
            alt="BlockMarket" 
            className="h-10 w-10"
          />
          <span className="text-xl font-bold text-[#F5F6FA]">BlockMarket</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/market"
            className={`text-sm font-medium transition-colors ${
              isActive('/market')
                ? 'text-[#E10600]'
                : 'text-[#C9CCD3] hover:text-[#F5F6FA]'
            }`}
          >
            Market
          </Link>
          <Link
            to="/buy"
            className={`text-sm font-medium transition-colors ${
              isActive('/buy')
                ? 'text-[#E10600]'
                : 'text-[#C9CCD3] hover:text-[#F5F6FA]'
            }`}
          >
            Buy
          </Link>
          {user && (
            <Link
              to="/portfolio"
              className={`text-sm font-medium transition-colors ${
                isActive('/portfolio')
                  ? 'text-[#E10600]'
                  : 'text-[#C9CCD3] hover:text-[#F5F6FA]'
              }`}
            >
              Portfolio
            </Link>
          )}

          <div className="h-6 w-px bg-[#1E1E22]"></div>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#C9CCD3] px-3 py-1.5 bg-[#131316] rounded border border-[#1E1E22]">
                {formatAddress(user.address)}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-[#131316] hover:bg-[#1E1E22] text-[#F5F6FA] text-sm font-medium rounded border border-[#1E1E22] transition-all shadow-card cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : pendingLogin ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#C9CCD3] px-3 py-1.5 bg-[#131316] rounded border border-[#1E1E22]">
                {formatAddress(pendingLogin.address)}
              </span>
              <button
                onClick={verify}
                disabled={verifying}
                className="px-6 py-2 bg-[#E10600] hover:bg-[#9B0500] disabled:opacity-50 disabled:cursor-not-allowed text-[#F5F6FA] font-medium rounded transition-all shadow-button-3d hover:shadow-red-glow cursor-pointer"
              >
                {verifying ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              disabled={loading}
              className="px-6 py-2 bg-[#E10600] hover:bg-[#9B0500] disabled:opacity-50 disabled:cursor-not-allowed text-[#F5F6FA] font-medium rounded transition-all shadow-button-3d hover:shadow-red-glow cursor-pointer"
            >
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
