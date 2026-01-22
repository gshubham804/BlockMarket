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

    let ethgasOrderId: string | null = null
    let ethgasOrder: any = null

    // Generate Client Order ID & Parse Data
    const clientOrderId = Math.random().toString(36).substring(2, 10)
    const instrumentId = data.instrumentId
    const sideBool = data.side === 'buy'

    try {
      // Set auth token for ETHGas API
      ethgasClient.setAuthToken(ethgasToken)

      // 1. Fetch User Accounts to get accountId
      const accountsResponse = await ethgasClient.getUserAccounts()
      // Handle various response structures (data.data.accounts, data.accounts, etc.)
      const accounts = accountsResponse?.data?.data?.user?.accounts ||
        accountsResponse?.data?.user?.accounts ||
        accountsResponse?.data?.accounts ||
        accountsResponse?.accounts ||
        []

      // Find trading account (Type 2) or fallback to first one
      const tradingAccount = accounts.find((acc: any) => acc.type === 2) || accounts[0]

      if (!tradingAccount) {
        throw new AppError(400, 'No ETHGas trading account found for this user')
      }

      const accountId = tradingAccount.accountId
      console.log('🟣 [Backend] Using Account ID for order:', accountId)


      // 5. Construct Payload
      // 5. Construct Payload & Place Order
      if (data.marketType === 'wholeblock') {
        const wbPayload = {
          instrumentId,
          accountId,
          side: sideBool, // Keep boolean for Whole Block as it's tested
          orderType: 1,
          quantity: "1",
          clientOrderId,
          passive: false
        }
        console.log('🔵 [Backend] Placing WB Order:', JSON.stringify(wbPayload, null, 2))
        ethgasOrder = await ethgasClient.placeWholeBlockOrder(wbPayload)

      } else {
        // Inclusion Preconf - strict types based on docs
        const pcPayload = {
          instrumentId,
          accountId,
          side: sideBool ? 1 : 0, // Integer 1 or 0
          orderType: 1,
          quantity: Number(data.quantity || 1), // Integer
          clientOrderId,
          passive: false
        }
        console.log('🔵 [Backend] Placing Preconf Order:', JSON.stringify(pcPayload, null, 2))
        ethgasOrder = await ethgasClient.placeInclusionPreconfOrder(pcPayload)
      }

      // Handle response wrapping
      const orderData = ethgasOrder?.data?.order || ethgasOrder?.order || ethgasOrder?.data || ethgasOrder
      ethgasOrderId = orderData?.orderId || null

      console.log('✅ [Backend] Order Placed. ID:', ethgasOrderId)

      ethgasClient.clearAuthToken()
    } catch (error: any) {
      ethgasClient.clearAuthToken()
      console.error('❌ [Backend] Order Placement Failed:', error.response?.data || error.message)
      throw new AppError(400, error.message)
    }

    // Store normalized order in MongoDB
    const order = await Order.create({
      userId: new mongoose.Types.ObjectId(userId),
      ethgasOrderId,
      marketType: data.marketType,
      side: data.side,
      instrumentId: data.instrumentId,
      clientOrderId,
      price: data.price,
      quantity: data.quantity,
      status: 'pending', // Initially pending until confirmed/synced
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

      // First, get user's accounts to find trading account (type 2)
      let tradingAccountId: number | undefined = undefined
      try {
        const accountsResponse = await ethgasClient.getUserAccounts()
        const accounts = accountsResponse?.data?.accounts || accountsResponse?.accounts || []
        // Find trading account (type 2) - this is used for orders
        const tradingAccount = accounts.find((acc: any) => acc.type === 2)
        if (tradingAccount) {
          tradingAccountId = tradingAccount.accountId
          console.log('🟣 [Backend] Found trading account:', tradingAccountId)
        } else if (accounts.length > 0) {
          // Fallback to first account if no trading account found
          tradingAccountId = accounts[0].accountId
          console.log('🟣 [Backend] Using first account as fallback:', tradingAccountId)
        }
      } catch (accountError: any) {
        console.warn('⚠️ [Backend] Failed to fetch accounts, proceeding without accountId:', accountError.message)
      }

      // Fetch orders from ETHGas
      let ethgasOrders: any[] = []
      if (!marketType || marketType === 'wholeblock') {
        try {
          const wholeBlockOrders = await ethgasClient.getUserWholeBlockOrders(tradingAccountId)
          // Handle response structure: { success: true, data: { orders: [...] } } or { orders: [...] }
          const orders = wholeBlockOrders?.data?.orders || wholeBlockOrders?.orders || wholeBlockOrders || []
          ethgasOrders = ethgasOrders.concat(Array.isArray(orders) ? orders : [])
          console.log('🟣 [Backend] Fetched whole block orders:', orders.length)
        } catch (error: any) {
          console.error('❌ [Backend] Failed to fetch whole block orders:', error.message)
        }
      }
      if (!marketType || marketType === 'inclusion-preconf') {
        try {
          const preconfOrders = await ethgasClient.getUserInclusionPreconfOrders(tradingAccountId)
          // Handle response structure: { success: true, data: { orders: [...] } } or { orders: [...] }
          const orders = preconfOrders?.data?.orders || preconfOrders?.orders || preconfOrders || []
          ethgasOrders = ethgasOrders.concat(Array.isArray(orders) ? orders : [])
          console.log('🟣 [Backend] Fetched inclusion preconf orders:', orders.length)
        } catch (error: any) {
          console.error('❌ [Backend] Failed to fetch inclusion preconf orders:', error.message)
        }
      }

      ethgasClient.clearAuthToken()

      // Sync with MongoDB
      for (const ethgasOrder of ethgasOrders) {
        try {
          console.log('🟣 [Backend] Syncing ETHGas order:', {
            id: ethgasOrder.id || ethgasOrder.orderId,
            instrumentId: ethgasOrder.instrumentId,
            status: ethgasOrder.status,
            side: ethgasOrder.side,
            hasStatus: ethgasOrder.status !== undefined && ethgasOrder.status !== null,
            orderKeys: Object.keys(ethgasOrder),
          })

          // Extract market type and slot from instrumentId if available
          // Format: "ETH-WB-{slot}" for whole block, "ETH-PC-{slot}" for inclusion preconf
          let marketType: 'wholeblock' | 'inclusion-preconf' = 'inclusion-preconf'
          let slot: number = 0

          if (ethgasOrder.instrumentId) {
            const instrumentId = ethgasOrder.instrumentId as string
            if (instrumentId.includes('ETH-WB-')) {
              marketType = 'wholeblock'
              const slotMatch = instrumentId.match(/ETH-WB-(\d+)/)
              if (slotMatch) slot = parseInt(slotMatch[1], 10)
            } else if (instrumentId.includes('ETH-PC-')) {
              marketType = 'inclusion-preconf'
              const slotMatch = instrumentId.match(/ETH-PC-(\d+)/)
              if (slotMatch) slot = parseInt(slotMatch[1], 10)
            }
          }

          // Use marketType from order if available, otherwise use extracted value
          const finalMarketType = ethgasOrder.marketType ||
            (ethgasOrder.type === 'wholeblock' ? 'wholeblock' :
              ethgasOrder.type === 'inclusion-preconf' ? 'inclusion-preconf' :
                marketType)

          // Build update object
          // For upsert to work, we need all required fields, so we'll use defaults if missing
          const updateData: any = {
            userId: new mongoose.Types.ObjectId(userId),
            ethgasOrderId: ethgasOrder.id || ethgasOrder.orderId,
            marketType: finalMarketType,
            side: this.mapETHGasSide(ethgasOrder.side), // Map boolean to string
            // blockRange removed
            instrumentId: ethgasOrder.instrumentId || (finalMarketType === 'wholeblock' ? `ETH-WB-${slot}` : `ETH-PC-${slot}`), // Ensure instrumentId exists
            price: ethgasOrder.price || '0', // Default if missing
            status: this.mapETHGasStatus(ethgasOrder.status), // Map integer to string
          }

          // Optional fields
          if (ethgasOrder.quantity !== undefined && ethgasOrder.quantity !== null) {
            updateData.quantity = String(ethgasOrder.quantity)
          }
          // ETHGas uses 'fulfilled' field for filled quantity
          if (ethgasOrder.fulfilled !== undefined && ethgasOrder.fulfilled !== null) {
            updateData.filledQuantity = String(ethgasOrder.fulfilled)
          } else if (ethgasOrder.filledQuantity !== undefined && ethgasOrder.filledQuantity !== null) {
            updateData.filledQuantity = String(ethgasOrder.filledQuantity)
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

            if (ethgasOrder.side !== undefined && ethgasOrder.side !== null) {
              updateFields.side = this.mapETHGasSide(ethgasOrder.side)
            }
            if (ethgasOrder.instrumentId) {
              updateFields.instrumentId = ethgasOrder.instrumentId
            }
            if (ethgasOrder.price) updateFields.price = String(ethgasOrder.price)
            if (finalMarketType) {
              updateFields.marketType = finalMarketType
            }
            if (ethgasOrder.quantity !== undefined && ethgasOrder.quantity !== null) {
              updateFields.quantity = String(ethgasOrder.quantity)
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
    console.log('🟠 [Backend] Cancel Order Request:', { orderId, userId })
    console.log('🟠 [Backend] Found Order:', order)

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

      // 1. Fetch User Accounts to get accountId (Required for cancel)
      const accountsResponse = await ethgasClient.getUserAccounts()
      const accounts = accountsResponse?.data?.data?.user?.accounts ||
        accountsResponse?.data?.user?.accounts ||
        accountsResponse?.data?.accounts ||
        accountsResponse?.accounts ||
        []
      const tradingAccount = accounts.find((acc: any) => acc.type === 2) || accounts[0]
      if (!tradingAccount) {
        throw new AppError(400, 'No ETHGas trading account found for this user')
      }
      const accountId = tradingAccount.accountId

      const cancelPayload = {
        accountId,
        instrumentId: order.instrumentId,
        clientOrderId: order.clientOrderId,
        orderId: order.ethgasOrderId
      }

      console.log('🔵 [Backend] Cancelling Order:', JSON.stringify(cancelPayload, null, 2))

      // Cancel in ETHGas
      if (order.marketType === 'wholeblock') {
        await ethgasClient.cancelWholeBlockOrder(cancelPayload)
      } else {
        await ethgasClient.cancelInclusionPreconfOrder(cancelPayload)
      }

      ethgasClient.clearAuthToken()
    } catch (error: any) {
      ethgasClient.clearAuthToken()
      throw new AppError(400, `Failed to cancel order in ETHGas: ${error.response?.data?.message || error.message}`)
    }

    // Update in MongoDB
    order.status = 'cancelled'
    await order.save()

    return order
  }

  /**
   * Map ETHGas order status (integer) to our status enum (string)
   * ETHGas Status Codes:
   * 0 = STATUS_PENDING (Pending - Not yet sent to market)
   * 1 = STATUS_ONBOOK (On Book - Live order in market)
   * 10 = STATUS_DONE (Done - Fully executed)
   * 11 = STATUS_MANUALLY_CANCELLED (Manually cancelled)
   * 12 = STATUS_AUTO_CANCELLED (Auto cancelled)
   * 13 = STATUS_PARTIALLY_FILLED (Partially Filled)
   * 14 = STATUS_EXPIRED (Market expired)
   * 99 = STATUS_ERROR (Error)
   */
  private mapETHGasStatus(ethgasStatus: number | string | undefined | null): OrderStatus {
    // Handle undefined/null status
    if (ethgasStatus === undefined || ethgasStatus === null) {
      console.warn('⚠️ [Backend] ETHGas order status is missing, defaulting to "pending"')
      return 'pending'
    }

    // Convert to number if it's a string
    const statusCode = typeof ethgasStatus === 'string' ? parseInt(ethgasStatus, 10) : ethgasStatus

    // Map ETHGas integer status codes to our string statuses
    const statusMap: Record<number, OrderStatus> = {
      0: 'pending',      // STATUS_PENDING
      1: 'active',       // STATUS_ONBOOK (active/live order)
      10: 'filled',      // STATUS_DONE (fully executed)
      11: 'cancelled',   // STATUS_MANUALLY_CANCELLED
      12: 'cancelled',   // STATUS_AUTO_CANCELLED
      13: 'active',      // STATUS_PARTIALLY_FILLED (still active)
      14: 'expired',     // STATUS_EXPIRED
      99: 'pending',     // STATUS_ERROR (treat as pending for now)
    }

    if (isNaN(statusCode)) {
      console.warn(`⚠️ [Backend] Invalid ETHGas status value: ${ethgasStatus}, defaulting to "pending"`)
      return 'pending'
    }

    return statusMap[statusCode] || 'pending'
  }

  /**
   * Map ETHGas side (boolean) to our side enum (string)
   * ETHGas: true = Buy, false = Sell
   */
  private mapETHGasSide(ethgasSide: boolean | string | undefined | null): 'buy' | 'sell' {
    if (ethgasSide === undefined || ethgasSide === null) {
      console.warn('⚠️ [Backend] ETHGas order side is missing, defaulting to "buy"')
      return 'buy'
    }

    // Handle boolean
    if (typeof ethgasSide === 'boolean') {
      return ethgasSide ? 'buy' : 'sell'
    }

    // Handle string (for backward compatibility)
    if (typeof ethgasSide === 'string') {
      const normalized = ethgasSide.toLowerCase()
      if (normalized === 'true' || normalized === 'buy' || normalized === '1') {
        return 'buy'
      }
      if (normalized === 'false' || normalized === 'sell' || normalized === '0') {
        return 'sell'
      }
    }

    console.warn(`⚠️ [Backend] Invalid ETHGas side value: ${ethgasSide}, defaulting to "buy"`)
    return 'buy'
  }
}

export default new OrdersService()
