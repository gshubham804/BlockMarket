import { Order, IOrder, OrderStatus } from '../../models/Order.model'
import ethgasClient from '../../utils/ethgas.client'
import { PlaceOrderInput } from '../../models/Order.model'
import { AppError } from '../../middlewares/error.middleware'
import authService from '../auth/auth.service'
import mongoose from 'mongoose'

/**
 * Orders Service
 * 
 * Manages order placement and tracking
 * Syncs with ETHGas API but stores normalized data in MongoDB
 */
export class OrdersService {
  /**
   * Place a new order
   * Creates order in ETHGas and stores normalized version in MongoDB
   */
  async placeOrder(userId: string, data: PlaceOrderInput): Promise<IOrder> {
    // Get user's ETHGas token
    const ethgasToken = await authService.getETHGasToken(userId)
    if (!ethgasToken) {
      throw new AppError(401, 'ETHGas authentication required. Please login again.')
    }

    // Prepare order data for ETHGas API
    const ethgasOrderData = {
      blockRange: data.blockRange,
      price: data.price,
      side: data.side,
      quantity: data.quantity,
    }

    let ethgasOrderId: string | null = null
    let ethgasOrder: any = null

    try {
      // Set auth token for ETHGas API
      ethgasClient.setAuthToken(ethgasToken)

      // Place order in ETHGas
      if (data.marketType === 'wholeblock') {
        ethgasOrder = await ethgasClient.placeWholeBlockOrder(ethgasOrderData)
      } else {
        ethgasOrder = await ethgasClient.placeInclusionPreconfOrder(ethgasOrderData)
      }

      ethgasOrderId = ethgasOrder.id || ethgasOrder.orderId || null

      ethgasClient.clearAuthToken()
    } catch (error: any) {
      ethgasClient.clearAuthToken()
      throw new AppError(400, `Failed to place order in ETHGas: ${error.message}`)
    }

    // Store normalized order in MongoDB
    const order = await Order.create({
      userId: new mongoose.Types.ObjectId(userId),
      ethgasOrderId,
      marketType: data.marketType,
      side: data.side,
      blockRange: data.blockRange,
      price: data.price,
      quantity: data.quantity,
      status: 'pending',
    })

    return order
  }

  /**
   * Get user's orders
   * Fetches from ETHGas and syncs with MongoDB
   */
  async getUserOrders(userId: string, marketType?: 'wholeblock' | 'inclusion-preconf'): Promise<IOrder[]> {
    // Get user's ETHGas token
    const ethgasToken = await authService.getETHGasToken(userId)
    if (!ethgasToken) {
      // If no ETHGas token, return only MongoDB orders
      const query: any = { userId: new mongoose.Types.ObjectId(userId) }
      if (marketType) query.marketType = marketType
      return Order.find(query).sort({ createdAt: -1 }).exec()
    }

    try {
      ethgasClient.setAuthToken(ethgasToken)

      // Fetch orders from ETHGas
      let ethgasOrders: any[] = []
      if (!marketType || marketType === 'wholeblock') {
        const wholeBlockOrders = await ethgasClient.getUserWholeBlockOrders()
        ethgasOrders = ethgasOrders.concat(wholeBlockOrders.orders || wholeBlockOrders || [])
      }
      if (!marketType || marketType === 'inclusion-preconf') {
        const preconfOrders = await ethgasClient.getUserInclusionPreconfOrders()
        ethgasOrders = ethgasOrders.concat(preconfOrders.orders || preconfOrders || [])
      }

      ethgasClient.clearAuthToken()

      // Sync with MongoDB
      for (const ethgasOrder of ethgasOrders) {
        try {
          console.log('🟣 [Backend] Syncing ETHGas order:', {
            id: ethgasOrder.id || ethgasOrder.orderId,
            status: ethgasOrder.status,
            hasStatus: ethgasOrder.status !== undefined && ethgasOrder.status !== null,
            orderKeys: Object.keys(ethgasOrder),
          })

          // Build update object
          // For upsert to work, we need all required fields, so we'll use defaults if missing
          const updateData: any = {
            userId: new mongoose.Types.ObjectId(userId),
            ethgasOrderId: ethgasOrder.id || ethgasOrder.orderId,
            marketType: ethgasOrder.marketType || (ethgasOrder.type === 'wholeblock' ? 'wholeblock' : 'inclusion-preconf'),
            side: ethgasOrder.side || 'buy', // Default to 'buy' if missing
            blockRange: ethgasOrder.blockRange || { start: 0, end: 0 }, // Default if missing
            price: ethgasOrder.price || '0', // Default if missing
            status: this.mapETHGasStatus(ethgasOrder.status),
          }

          // Optional fields
          if (ethgasOrder.quantity !== undefined && ethgasOrder.quantity !== null) {
            updateData.quantity = ethgasOrder.quantity
          }
          if (ethgasOrder.filledQuantity !== undefined && ethgasOrder.filledQuantity !== null) {
            updateData.filledQuantity = ethgasOrder.filledQuantity
          } else {
            updateData.filledQuantity = '0'
          }

          // Try to find existing order first
          const existingOrder = await Order.findOne({ ethgasOrderId: ethgasOrder.id || ethgasOrder.orderId })
          
          if (existingOrder) {
            // Update existing order - only update fields that exist in ETHGas response
            const updateFields: any = {
              status: updateData.status,
              filledQuantity: updateData.filledQuantity,
            }
            
            if (ethgasOrder.side) updateFields.side = ethgasOrder.side
            if (ethgasOrder.blockRange) updateFields.blockRange = ethgasOrder.blockRange
            if (ethgasOrder.price) updateFields.price = ethgasOrder.price
            if (ethgasOrder.marketType || ethgasOrder.type) {
              updateFields.marketType = updateData.marketType
            }
            
            await Order.findByIdAndUpdate(existingOrder._id, updateFields)
          } else {
            // Create new order - use defaults for required fields if missing
            await Order.create(updateData)
          }
        } catch (orderError: any) {
          console.error('❌ [Backend] Failed to sync individual order:', orderError)
          console.error('  Order data:', JSON.stringify(ethgasOrder, null, 2))
          // Continue with next order instead of failing entire sync
        }
      }
    } catch (error: any) {
      console.error('❌ [Backend] Failed to sync orders from ETHGas:', error)
      console.error('  Error message:', error.message)
      console.error('  Error stack:', error.stack)
      if (error.response) {
        console.error('  ETHGas API response:', error.response.data)
      }
      ethgasClient.clearAuthToken()
    }

    // Return from MongoDB
    const query: any = { userId: new mongoose.Types.ObjectId(userId) }
    if (marketType) query.marketType = marketType
    return Order.find(query).sort({ createdAt: -1 }).exec()
  }

  /**
   * Cancel an order
   */
  async cancelOrder(userId: string, orderId: string): Promise<IOrder> {
    const order = await Order.findById(orderId)

    if (!order) {
      throw new AppError(404, 'Order not found')
    }

    if (order.userId.toString() !== userId) {
      throw new AppError(403, 'Not authorized to cancel this order')
    }

    if (!order.ethgasOrderId) {
      throw new AppError(400, 'Order not synced with ETHGas')
    }

    // Get user's ETHGas token
    const ethgasToken = await authService.getETHGasToken(userId)
    if (!ethgasToken) {
      throw new AppError(401, 'ETHGas authentication required')
    }

    try {
      ethgasClient.setAuthToken(ethgasToken)

      // Cancel in ETHGas
      if (order.marketType === 'wholeblock') {
        await ethgasClient.cancelWholeBlockOrder(order.ethgasOrderId)
      } else {
        await ethgasClient.cancelInclusionPreconfOrder(order.ethgasOrderId)
      }

      ethgasClient.clearAuthToken()
    } catch (error: any) {
      ethgasClient.clearAuthToken()
      throw new AppError(400, `Failed to cancel order in ETHGas: ${error.message}`)
    }

    // Update in MongoDB
    order.status = 'cancelled'
    await order.save()

    return order
  }

  /**
   * Map ETHGas order status to our status enum
   */
  private mapETHGasStatus(ethgasStatus: string | undefined | null): OrderStatus {
    // Handle undefined/null status
    if (!ethgasStatus) {
      console.warn('⚠️ [Backend] ETHGas order status is missing, defaulting to "pending"')
      return 'pending'
    }

    const statusMap: Record<string, OrderStatus> = {
      pending: 'pending',
      active: 'active',
      filled: 'filled',
      cancelled: 'cancelled',
      expired: 'expired',
    }
    
    const normalizedStatus = typeof ethgasStatus === 'string' 
      ? ethgasStatus.toLowerCase() 
      : String(ethgasStatus).toLowerCase()
    
    return statusMap[normalizedStatus] || 'pending'
  }
}

export default new OrdersService()
