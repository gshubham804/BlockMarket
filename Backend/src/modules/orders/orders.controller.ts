import { Request, Response, NextFunction } from 'express'
import ordersService from './orders.service'
import { PlaceOrderSchema } from '../../models/Order.model'

export class OrdersController {
  /**
   * POST /orders/place
   * Place a new order (authenticated)
   */
  async place(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).userId
      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' })
        return
      }

      const data = PlaceOrderSchema.parse(req.body)
      const order = await ordersService.placeOrder(userId, data)
      res.status(201).json({ order })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /orders/my?marketType=wholeblock|preconf
   * Get user's orders (authenticated)
   */
  async my(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).userId
      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' })
        return
      }

      const marketType = req.query.marketType as 'wholeblock' | 'inclusion-preconf' | undefined
      const orders = await ordersService.getUserOrders(userId, marketType)
      res.json({ orders })
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /orders/cancel
   * Cancel an order (authenticated)
   */
  async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).userId
      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' })
        return
      }

      const { orderId } = req.body
      if (!orderId) {
        res.status(400).json({ error: 'orderId is required' })
        return
      }

      const order = await ordersService.cancelOrder(userId, orderId)
      res.json({ order })
    } catch (error) {
      next(error)
    }
  }
}

export default new OrdersController()
