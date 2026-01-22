import { useRef, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { formatAddress } from '../lib/wallet'

interface WalletConnectModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function WalletConnectModal({ isOpen, onClose }: WalletConnectModalProps) {
    const { user, pendingLogin, login, verify, loading, verifying, error } = useAuth()
    const modalRef = useRef<HTMLDivElement>(null)

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    // If user is already fully authenticated, don't show modal
    if (user) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div
                ref={modalRef}
                className="bg-[#131316] border border-[#1E1E22] rounded-2xl w-full max-w-md p-6 shadow-2xl transform transition-all"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[#F5F6FA]">
                        {pendingLogin ? 'Verify Wallet' : 'Connect Wallet'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[#6B6F78] hover:text-[#F5F6FA] transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Step Indicators */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className={`flex-1 h-1 rounded-full ${pendingLogin ? 'bg-[#E10600]' : 'bg-[#E10600]'}`}></div>
                        <div className={`flex-1 h-1 rounded-full ${pendingLogin ? 'bg-[#E10600]' : 'bg-[#1E1E22]'}`}></div>
                    </div>

                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-[#1E1E22] rounded-full flex items-center justify-center mx-auto mb-4">
                            {loading || verifying ? (
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E10600]"></div>
                            ) : (
                                <svg className="w-8 h-8 text-[#E10600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            )}
                        </div>

                        <p className="text-[#C9CCD3]">
                            {pendingLogin
                                ? `Please sign the message to verify your ownership of ${formatAddress(pendingLogin.address)}`
                                : "Connect your Ethereum wallet to start trading on BlockMarket"
                            }
                        </p>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                                {error}
                            </div>
                        )}
                    </div>

                    {pendingLogin ? (
                        <button
                            onClick={() => verify()}
                            disabled={verifying}
                            className="w-full py-3 px-4 bg-[#E10600] hover:bg-[#9B0500] disabled:opacity-50 disabled:cursor-not-allowed text-[#F5F6FA] font-medium rounded-lg transition-all shadow-button-3d hover:shadow-red-glow flex items-center justify-center gap-2"
                        >
                            {verifying ? 'Verifying Signature...' : 'Verify & Sign In'}
                        </button>
                    ) : (
                        <button
                            onClick={() => login()}
                            disabled={loading}
                            className="w-full py-3 px-4 bg-[#E10600] hover:bg-[#9B0500] disabled:opacity-50 disabled:cursor-not-allowed text-[#F5F6FA] font-medium rounded-lg transition-all shadow-button-3d hover:shadow-red-glow flex items-center justify-center gap-2"
                        >
                            {loading ? 'Connecting...' : 'Connect MetaMask'}
                        </button>
                    )}

                    <p className="text-center text-xs text-[#6B6F78]">
                        By connecting, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    )
}
