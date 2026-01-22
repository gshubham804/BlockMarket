import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../hooks/useAuth'
import { formatAddress } from '../lib/wallet'
import toast from 'react-hot-toast'
import logo from '../assets/BlockMarketLogo.png'

export default function LoginPage() {
  const { user, pendingLogin, login, verify, loading, verifying, error } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && !loading && !verifying) {
      toast.success('Wallet connected successfully!')
      navigate('/market')
    }
  }, [user, loading, verifying, navigate])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleLogin = async () => {
    await login()
  }

  const handleVerify = async () => {
    await verify()
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <div className="bg-[#131316] rounded-lg border border-[#1E1E22] shadow-card p-8 text-center space-y-6">
          <div className="flex justify-center">
            <img
              src={logo}
              alt="BlockMarket"
              className="h-16 w-16"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#F5F6FA] mb-2">Welcome to BlockMarket</h1>
            <p className="text-[#C9CCD3]">
              Connect your wallet to start trading blockspace
            </p>
          </div>

          {!pendingLogin ? (
            <>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full px-6 py-4 bg-[#E10600] hover:bg-[#9B0500] disabled:opacity-50 disabled:cursor-not-allowed text-[#F5F6FA] font-semibold rounded-lg transition-all shadow-button-3d hover:shadow-red-glow cursor-pointer"
              >
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </button>
              <p className="text-xs text-[#6B6F78]">
                You'll be asked to sign a message to verify ownership
              </p>
            </>
          ) : (
            <>
              <div className="bg-[#1E1E22] rounded-lg p-4 space-y-3">
                <div className="text-left">
                  <p className="text-sm text-[#C9CCD3] mb-1">Wallet Address</p>
                  <p className="text-[#F5F6FA] font-mono text-sm">
                    {formatAddress(pendingLogin.address)}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-[#C9CCD3] mb-1">Status</p>
                  <p className="text-[#F5F6FA] text-sm capitalize">{pendingLogin.status}</p>
                </div>
              </div>
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="w-full px-6 py-4 bg-[#E10600] hover:bg-[#9B0500] disabled:opacity-50 disabled:cursor-not-allowed text-[#F5F6FA] font-semibold rounded-lg transition-all shadow-button-3d hover:shadow-red-glow cursor-pointer"
              >
                {verifying ? 'Verifying...' : 'Verify & Sign Message'}
              </button>
              <p className="text-xs text-[#6B6F78]">
                Click verify to sign the message in MetaMask
              </p>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}
