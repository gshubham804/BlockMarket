import { useWallet } from '../hooks/useWallet'

function WalletConnect() {
  const { address, isConnected, connectWallet, disconnectWallet } = useWallet()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-[#C9CCD3] px-3 py-1.5 bg-[#131316] rounded border border-[#1E1E22]">
          {formatAddress(address)}
        </span>
        <button
          onClick={disconnectWallet}
          className="px-6 py-2 bg-[#131316] hover:bg-[#1E1E22] text-[#F5F6FA] font-medium rounded border border-[#1E1E22] transition-all shadow-card cursor-pointer"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={connectWallet}
      className="px-6 py-2 bg-[#E10600] hover:bg-[#9B0500] text-[#F5F6FA] font-medium rounded transition-all shadow-button-3d hover:shadow-red-glow cursor-pointer"
    >
      Connect Wallet
    </button>
  )
}

export default WalletConnect
