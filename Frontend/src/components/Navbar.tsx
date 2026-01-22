import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { formatAddress } from '../lib/wallet'

export default function Navbar() {
  const { user, pendingLogin, login, verify, logout, loading, verifying } = useAuth()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

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

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/market"
            className={`text-sm font-medium transition-colors ${isActive('/market')
              ? 'text-[#E10600]'
              : 'text-[#C9CCD3] hover:text-[#F5F6FA]'
              }`}
          >
            Market
          </Link>
          <Link
            to="/buy"
            className={`text-sm font-medium transition-colors ${isActive('/buy')
              ? 'text-[#E10600]'
              : 'text-[#C9CCD3] hover:text-[#F5F6FA]'
              }`}
          >
            Buy
          </Link>
          {user && (
            <Link
              to="/portfolio"
              className={`text-sm font-medium transition-colors ${isActive('/portfolio')
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
                className="px-6 py-2 bg-[#E10600] hover:bg-[#9B0500] text-[#F5F6FA] text-sm font-medium rounded transition-all shadow-button-3d hover:shadow-red-glow cursor-pointer"
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#C9CCD3] hover:text-[#F5F6FA] focus:outline-none"
          onClick={toggleMobileMenu}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#1E1E22] bg-[#0B0B0D]">
          <div className="flex flex-col p-4 space-y-4">
            <Link
              to="/market"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-sm font-medium transition-colors ${isActive('/market')
                ? 'text-[#E10600]'
                : 'text-[#C9CCD3] hover:text-[#F5F6FA]'
                }`}
            >
              Market
            </Link>
            <Link
              to="/buy"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-sm font-medium transition-colors ${isActive('/buy')
                ? 'text-[#E10600]'
                : 'text-[#C9CCD3] hover:text-[#F5F6FA]'
                }`}
            >
              Buy
            </Link>
            {user && (
              <Link
                to="/portfolio"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors ${isActive('/portfolio')
                  ? 'text-[#E10600]'
                  : 'text-[#C9CCD3] hover:text-[#F5F6FA]'
                  }`}
              >
                Portfolio
              </Link>
            )}

            <div className="h-px w-full bg-[#1E1E22]"></div>

            {user ? (
              <div className="flex flex-col gap-3">
                <span className="text-sm text-[#C9CCD3] px-3 py-2 bg-[#131316] rounded border border-[#1E1E22] text-center">
                  {formatAddress(user.address)}
                </span>
                <button
                  onClick={() => {
                    logout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full px-6 py-3 bg-[#E10600] hover:bg-[#9B0500] text-[#F5F6FA] text-sm font-medium rounded transition-all shadow-button-3d hover:shadow-red-glow cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : pendingLogin ? (
              <div className="flex flex-col gap-3">
                <span className="text-sm text-[#C9CCD3] px-3 py-2 bg-[#131316] rounded border border-[#1E1E22] text-center">
                  {formatAddress(pendingLogin.address)}
                </span>
                <button
                  onClick={() => {
                    verify()
                    setIsMobileMenuOpen(false)
                  }}
                  disabled={verifying}
                  className="w-full px-6 py-3 bg-[#E10600] hover:bg-[#9B0500] disabled:opacity-50 disabled:cursor-not-allowed text-[#F5F6FA] font-medium rounded transition-all shadow-button-3d hover:shadow-red-glow cursor-pointer"
                >
                  {verifying ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  login()
                  setIsMobileMenuOpen(false)
                }}
                disabled={loading}
                className="w-full px-6 py-3 bg-[#E10600] hover:bg-[#9B0500] disabled:opacity-50 disabled:cursor-not-allowed text-[#F5F6FA] font-medium rounded transition-all shadow-button-3d hover:shadow-red-glow cursor-pointer"
              >
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
