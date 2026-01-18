import mongoose, { Schema, Document } from 'mongoose'
import { z } from 'zod'

export const LoginSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
})

export const VerifyLoginSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  signature: z.string(),
  nonceHash: z.string(), // ETHGas API uses 'nonceHash' instead of 'challenge'
})

export type LoginInput = z.infer<typeof LoginSchema>
export type VerifyLoginInput = z.infer<typeof VerifyLoginSchema>

export interface IUser extends Document {
  address: string
  ethgasToken?: string // ETHGas JWT (stored server-side only, never exposed to frontend)
  ethgasTokenExpiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    address: {
      type: String,
      required: true,
      unique: true,
      match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'],
      index: true,
    },
    ethgasToken: {
      type: String,
      default: null,
      select: false, // Never return in queries by default
    },
    ethgasTokenExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

export const User = mongoose.model<IUser>('User', UserSchema)
