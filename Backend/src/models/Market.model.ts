import mongoose, { Schema, Document } from 'mongoose'

/**
 * Market snapshot cache
 * Stores normalized market data from ETHGas API
 * Used for faster frontend queries and offline capability
 */
export interface IMarketSnapshot extends Document {
  marketType: 'wholeblock' | 'inclusion-preconf'
  data: any // Normalized market data from ETHGas
  fetchedAt: Date
  expiresAt: Date
}

const MarketSnapshotSchema = new Schema<IMarketSnapshot>(
  {
    marketType: {
      type: String,
      enum: ['wholeblock', 'inclusion-preconf'],
      required: true,
      unique: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    fetchedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // TTL index
    },
  },
  {
    timestamps: true,
  }
)

export const MarketSnapshot = mongoose.model<IMarketSnapshot>('MarketSnapshot', MarketSnapshotSchema)
