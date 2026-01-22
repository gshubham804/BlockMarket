interface PortfolioTableProps {
  orders: any[]
  onCancel: (orderId: string) => void
}

export default function PortfolioTable({ orders, onCancel }: PortfolioTableProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-[#131316] rounded-lg border border-[#1E1E22] shadow-card p-12 text-center">
        <div className="text-[#C9CCD3]">No orders found</div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'pending':
        return 'bg-[#E10600]/20 text-[#E10600]'
      case 'filled':
        return 'bg-[#C9CCD3]/20 text-[#C9CCD3]'
      case 'cancelled':
      case 'expired':
        return 'bg-[#6B6F78]/20 text-[#6B6F78]'
      default:
        return 'bg-[#6B6F78]/20 text-[#6B6F78]'
    }
  }

  const getSideColor = (side: string | undefined) => {
    if (!side) return 'text-[#6B6F78]'
    return side === 'buy' ? 'text-[#E10600]' : 'text-[#C9CCD3]'
  }

  return (
    <div className="bg-[#131316] rounded-lg border border-[#1E1E22] shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1E1E22]">
              <th className="text-left py-4 px-6 text-sm font-semibold text-[#C9CCD3]">Market</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-[#C9CCD3]">Side</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-[#C9CCD3]">Instrument ID</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-[#C9CCD3]">Price</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-[#C9CCD3]">Status</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-[#C9CCD3]">Date</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-[#C9CCD3]">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id || order.id}
                className="border-b border-[#1E1E22] hover:bg-[#0B0B0D] transition-colors"
              >
                <td className="py-4 px-6 text-[#F5F6FA] text-sm">
                  {order.marketType === 'wholeblock' ? 'Whole Block' : 'Inclusion Preconf'}
                </td>
                <td className="py-4 px-6">
                  <span className={`font-medium ${getSideColor(order.side)}`}>
                    {order.side ? order.side.toUpperCase() : '—'}
                  </span>
                </td>
                <td className="py-4 px-6 text-[#F5F6FA] font-mono text-sm">
                  {order.instrumentId || '—'}
                </td>
                <td className="py-4 px-6 text-[#F5F6FA] font-medium">
                  {order.price ? `${order.price} ETH` : '—'}
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-[#C9CCD3] text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-6 text-right">
                  {order.status === 'active' || order.status === 'pending' ? (
                    <button
                      onClick={() => onCancel(order._id || order.id)}
                      className="px-4 py-2 bg-[#131316] hover:bg-[#1E1E22] text-[#F5F6FA] text-sm font-medium rounded border border-[#1E1E22] transition-all shadow-card cursor-pointer"
                    >
                      Cancel
                    </button>
                  ) : (
                    <span className="text-[#6B6F78] text-sm">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
