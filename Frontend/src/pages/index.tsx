import { Link } from 'react-router-dom'
import WalletConnect from '../components/WalletConnect'
import logo from '../assets/BlockMarketLogo.png'

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#F5F6FA]">
      {/* Navigation */}
      <nav className="border-b border-[#1E1E22] bg-[#0B0B0D]">
        <div className="max-w-7xl mx-auto py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-0">
            <img
              src={logo}
              alt="BlockMarket"
              className="h-12 w-12"
            />
            <span className="text-xl font-bold text-[#F5F6FA]">BlockMarket</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#C9CCD3] px-3 py-1.5 bg-[#131316] rounded border border-[#1E1E22]">
              Testnet Only
            </span>
            <WalletConnect />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <img
                src={logo}
                alt="BlockMarket Logo"
                className="h-auto w-60"
              />
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-[#F5F6FA] mb-6 leading-tight">
              Blockmarket as a
              <span className="text-[#E10600]"> Product</span>
            </h1>
            <p className="text-xl lg:text-2xl text-[#C9CCD3] mb-8 leading-relaxed">
              Gasless transactions meet blockspace marketplace.
              <br />
              Reserve Ethereum blockspace in advance, execute transactions without gas complexity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/execute">
                <button className="px-8 py-4 bg-[#E10600] hover:bg-[#9B0500] text-[#F5F6FA] font-semibold text-lg rounded-lg transition-all shadow-button-3d hover:shadow-red-glow cursor-pointer">
                  Start Executing
                </button>
              </Link>
              <Link to="/trade">
                <button className="px-8 py-4 bg-[#131316] hover:bg-[#1E1E22] text-[#F5F6FA] font-semibold text-lg rounded-lg border border-[#1E1E22] transition-all shadow-card cursor-pointer">
                  Explore Marketplace
                </button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-[#6B6F78]">
              ⚠️ Testnet Only • For Learning & Experimentation
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-[#131316]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-[#F5F6FA] mb-4 text-center">
              The Problem
            </h2>
            <p className="text-lg text-[#C9CCD3] mb-8 text-center">
              Ethereum transactions today rely on a real-time gas auction
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Uncertain Fees", desc: "Users must guess gas fees with no guarantee" },
                { title: "Unpredictable", desc: "Congestion causes sudden fee spikes" },
                { title: "Complex UX", desc: "Too technical for non-technical users" }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-[#0B0B0D] rounded-lg border border-[#1E1E22] shadow-card"
                >
                  <h3 className="text-xl font-semibold text-[#F5F6FA] mb-2">{item.title}</h3>
                  <p className="text-[#C9CCD3]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-[#0B0B0D]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-[#F5F6FA] mb-4">
              The Solution
            </h2>
            <p className="text-xl text-[#C9CCD3]">
              BlockMarket treats Ethereum <span className="text-[#E10600] font-semibold">blockspace as a reservable resource</span>, not a last-second auction.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="p-8 bg-[#131316] rounded-lg border border-[#1E1E22] shadow-card">
              <div className="w-12 h-12 bg-[#E10600]/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-[#F5F6FA] mb-3">
                Gasless Transaction UX
              </h3>
              <p className="text-[#C9CCD3] mb-4">
                Send transactions without manually managing gas. BlockMarket coordinates blockspace reservation and transaction submission.
              </p>
              <div className="flex items-center gap-2 text-sm text-[#6B6F78]">
                <span>Submitted</span>
                <span>→</span>
                <span>Reserved</span>
                <span>→</span>
                <span>Preconfirmed</span>
                <span>→</span>
                <span className="text-[#E10600]">Included</span>
              </div>
            </div>

            <div className="p-8 bg-[#131316] rounded-lg border border-[#1E1E22] shadow-card">
              <div className="w-12 h-12 bg-[#E10600]/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-[#F5F6FA] mb-3">
                Blockspace Marketplace
              </h3>
              <p className="text-[#C9CCD3] mb-4">
                View, buy, sell, and manage blockspace commitments. Track commitment lifecycle and use them for guaranteed execution.
              </p>
              <ul className="text-sm text-[#C9CCD3] space-y-1">
                <li>• View available commitments</li>
                <li>• Buy for specific execution windows</li>
                <li>• Track active / used / expired</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* App Modes Section */}
      <section className="py-20 bg-[#131316]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#F5F6FA] mb-4">
              Two Modes, One Platform
            </h2>
            <p className="text-lg text-[#C9CCD3]">
              Choose your experience based on your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Execute Mode */}
            <div className="p-8 bg-[#0B0B0D] rounded-lg border-2 border-[#E10600]/30 shadow-deep-3d relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E10600]/10 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="inline-block px-3 py-1 bg-[#E10600]/20 text-[#E10600] text-sm font-semibold rounded mb-4">
                  Default Mode
                </div>
                <h3 className="text-3xl font-bold text-[#F5F6FA] mb-4">
                  Execute
                </h3>
                <p className="text-[#C9CCD3] mb-6">
                  Simple gasless transaction flow. Perfect for everyday users who want to send transactions without complexity.
                </p>
                <ul className="space-y-2 text-[#C9CCD3] mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-[#E10600]">✓</span>
                    Gasless transaction flow
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#E10600]">✓</span>
                    Simple, intuitive UI
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#E10600]">✓</span>
                    No trading complexity
                  </li>
                </ul>
                <Link to="/execute">
                  <button className="w-full px-6 py-3 bg-[#E10600] hover:bg-[#9B0500] text-[#F5F6FA] font-semibold rounded-lg transition-all shadow-button-3d hover:shadow-red-glow cursor-pointer">
                    Start Executing
                  </button>
                </Link>
              </div>
            </div>

            {/* Trade Mode */}
            <div className="p-8 bg-[#0B0B0D] rounded-lg border border-[#1E1E22] shadow-card">
              <div className="inline-block px-3 py-1 bg-[#6B6F78]/30 text-[#C9CCD3] text-sm font-semibold rounded mb-4">
                Advanced Mode
              </div>
              <h3 className="text-3xl font-bold text-[#F5F6FA] mb-4">
                Trade
              </h3>
              <p className="text-[#C9CCD3] mb-6">
                Full blockspace marketplace experience. For advanced users who want to buy, sell, and manage blockspace commitments.
              </p>
              <ul className="space-y-2 text-[#C9CCD3] mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-[#C9CCD3]">•</span>
                  Blockspace market view
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#C9CCD3]">•</span>
                  Buy and manage commitments
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#C9CCD3]">•</span>
                  Portfolio and usage history
                </li>
              </ul>
              <Link to="/trade">
                <button className="w-full px-6 py-3 bg-[#131316] hover:bg-[#1E1E22] text-[#F5F6FA] font-semibold rounded-lg border border-[#1E1E22] transition-all shadow-card cursor-pointer">
                  Explore Marketplace
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-[#0B0B0D]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#F5F6FA] mb-4">
              Key Features
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: "🔒", title: "Transparency", desc: "Transaction history and execution status tracking" },
              { icon: "📈", title: "Predictable", desc: "Clear execution timeline from submission to inclusion" },
              { icon: "⚙️", title: "Separation", desc: "Clear separation between reservation and execution" }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 bg-[#131316] rounded-lg border border-[#1E1E22] shadow-card text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-[#F5F6FA] mb-2">{feature.title}</h3>
                <p className="text-[#C9CCD3]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#131316] border-t border-[#1E1E22]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-[#F5F6FA] mb-6">
            Ready to Experience Gasless Transactions?
          </h2>
          <p className="text-xl text-[#C9CCD3] mb-8">
            Join BlockMarket on Ethereum testnet. Explore blockspace as a product.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/execute">
              <button className="px-8 py-4 bg-[#E10600] hover:bg-[#9B0500] text-[#F5F6FA] font-semibold text-lg rounded-lg transition-all shadow-button-3d hover:shadow-red-glow cursor-pointer">
                Get Started
              </button>
            </Link>
            <button className="px-8 py-4 bg-[#0B0B0D] hover:bg-[#1E1E22] text-[#F5F6FA] font-semibold text-lg rounded-lg border border-[#1E1E22] transition-all shadow-card cursor-pointer">
              Read Documentation
            </button>
          </div>
          <p className="mt-8 text-sm text-[#6B6F78]">
            ⚠️ This project runs entirely on Ethereum testnet and is built for learning, experimentation, and system-design exploration.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#0B0B0D] border-t border-[#1E1E22]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-0">
              <img
                src="/BlockMarketLogo.png"
                alt="BlockMarket"
                className="h-12 w-12"
              />
              <span className="text-[#F5F6FA] text-lg font-semibold">BlockMarket</span>
            </Link>
            <p className="text-sm text-[#6B6F78]">
              MIT License • Testnet Only • For Educational Purposes
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
