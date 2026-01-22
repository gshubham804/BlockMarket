import mongoose, { Schema, Document } from 'mongoose'
import { z } from 'zod'

export const PlaceOrderSchema = z.object({
  marketType: z.enum(['wholeblock', 'inclusion-preconf']),
  side: z.enum(['buy', 'sell']),
  instrumentId: z.string(),
  price: z.string(),
  quantity: z.string(),
})

export type PlaceOrderInput = z.infer<typeof PlaceOrderSchema>

export type OrderStatus = 'pending' | 'active' | 'filled' | 'cancelled' | 'expired'
export type MarketType = 'wholeblock' | 'inclusion-preconf'
export type OrderSide = 'buy' | 'sell'

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId
  ethgasOrderId?: string // ETHGas order ID
  marketType: MarketType
  side: OrderSide
  instrumentId: string
  clientOrderId: string
  price: string
  quantity: string
  status: OrderStatus
  filledQuantity?: string
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    ethgasOrderId: {
      type: String,
      default: null,
      index: true,
    },
    marketType: {
      type: String,
      enum: ['wholeblock', 'inclusion-preconf'],
      required: true,
    },
    side: {
      type: String,
      enum: ['buy', 'sell'],
      required: true,
    },
    instrumentId: {
      type: String,
      required: true,
      index: true,
    },
    clientOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'filled', 'cancelled', 'expired'],
      default: 'pending',
    },
    filledQuantity: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

// Index for efficient queries
OrderSchema.index({ userId: 1, createdAt: -1 })
OrderSchema.index({ status: 1, marketType: 1 })

export const Order = mongoose.model<IOrder>('Order', OrderSchema)
