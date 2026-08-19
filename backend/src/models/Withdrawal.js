import mongoose from 'mongoose'

const { Schema } = mongoose

const withdrawalSchema = new Schema(
  {
    ref: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true },
    asset: { type: String, required: true },
    rail: { type: String, default: '' }, // e.g. "Binance · BTC" or "Bank · SEPA"
    address: { type: String, default: '' },
    risk: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    status: { type: String, enum: ['pending', 'approved', 'hold', 'rejected'], default: 'pending', index: true },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

export default mongoose.model('Withdrawal', withdrawalSchema)
