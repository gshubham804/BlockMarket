import { Request, Response, NextFunction } from 'express'
import marketService from './market.service'

export class MarketController {
  /**
   * GET /market/wholeblock
   * Get whole block market data (public)
   */
  async getWholeBlock(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await marketService.getWholeBlockMarkets()
      res.json({ market: data })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /market/preconf
   * Get inclusion preconf market data (public)
   */
  async getPreconf(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await marketService.getInclusionPreconfMarkets()
      res.json({ market: data })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /market/trades?type=wholeblock|preconf
   * Get trades data (public)
   */
  async getTrades(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const type = req.query.type as string

      if (type === 'wholeblock') {
        const data = await marketService.getWholeBlockTrades()
        res.json({ trades: data })
      } else if (type === 'preconf' || type === 'inclusion-preconf') {
        const data = await marketService.getInclusionPreconfTrades()
        res.json({ trades: data })
      } else {
        res.status(400).json({ error: 'Invalid type. Use "wholeblock" or "preconf"' })
      }
    } catch (error) {
      next(error)
    }
  }
}

export default new MarketController()
