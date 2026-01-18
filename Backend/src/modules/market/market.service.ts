import { MarketSnapshot } from '../../models/Market.model'
import ethgasClient from '../../utils/ethgas.client'

/**
 * Market Service
 * 
 * Fetches market data from ETHGas API and caches in MongoDB
 * ETHGas is always the source of truth
 */
export class MarketService {
  private readonly CACHE_TTL_MINUTES = 5 // Cache for 5 minutes

  /**
   * Get whole block market data
   * Checks cache first, then fetches from ETHGas if needed
   */
  async getWholeBlockMarkets(): Promise<any> {
    // Check cache
    const cached = await MarketSnapshot.findOne({ marketType: 'wholeblock' })
    
    if (cached && cached.expiresAt > new Date()) {
      return cached.data
    }

    // Fetch from ETHGas API (public, no auth needed)
    const data = await ethgasClient.getWholeBlockMarkets()

    // Normalize and cache
    await MarketSnapshot.findOneAndUpdate(
      { marketType: 'wholeblock' },
      {
        marketType: 'wholeblock',
        data: this.normalizeMarketData(data, 'wholeblock'),
        fetchedAt: new Date(),
        expiresAt: new Date(Date.now() + this.CACHE_TTL_MINUTES * 60 * 1000),
      },
      { upsert: true }
    )

    return this.normalizeMarketData(data, 'wholeblock')
  }

  /**
   * Get inclusion preconf market data
   */
  async getInclusionPreconfMarkets(): Promise<any> {
    // Check cache
    const cached = await MarketSnapshot.findOne({ marketType: 'inclusion-preconf' })
    
    if (cached && cached.expiresAt > new Date()) {
      return cached.data
    }

    // Fetch from ETHGas API (public, no auth needed)
    const data = await ethgasClient.getInclusionPreconfMarkets()

    // Normalize and cache
    await MarketSnapshot.findOneAndUpdate(
      { marketType: 'inclusion-preconf' },
      {
        marketType: 'inclusion-preconf',
        data: this.normalizeMarketData(data, 'inclusion-preconf'),
        fetchedAt: new Date(),
        expiresAt: new Date(Date.now() + this.CACHE_TTL_MINUTES * 60 * 1000),
      },
      { upsert: true }
    )

    return this.normalizeMarketData(data, 'inclusion-preconf')
  }

  /**
   * Get whole block trades
   */
  async getWholeBlockTrades(): Promise<any> {
    // Trades are more dynamic, fetch fresh from ETHGas
    const data = await ethgasClient.getWholeBlockTrades()
    return this.normalizeTradesData(data, 'wholeblock')
  }

  /**
   * Get inclusion preconf trades
   */
  async getInclusionPreconfTrades(): Promise<any> {
    // Trades are more dynamic, fetch fresh from ETHGas
    const data = await ethgasClient.getInclusionPreconfTrades()
    return this.normalizeTradesData(data, 'inclusion-preconf')
  }

  /**
   * Normalize market data from ETHGas format to our frontend format
   */
  private normalizeMarketData(data: any, marketType: string): any {
    // TODO: Normalize based on actual ETHGas response structure
    // This is a placeholder - adjust based on real API response
    return {
      marketType,
      ...data,
      normalized: true,
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Normalize trades data from ETHGas format
   */
  private normalizeTradesData(data: any, marketType: string): any {
    // TODO: Normalize based on actual ETHGas response structure
    return {
      marketType,
      trades: data.trades || data,
      normalized: true,
      timestamp: new Date().toISOString(),
    }
  }
}

export default new MarketService()
