import mongoose from 'mongoose'

const { Schema } = mongoose

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    pair: { type: String, required: true },
    side: { type: String, enum: ['buy', 'sell'], required: true },
    type: { type: String, enum: ['limit', 'market', 'stop'], default: 'limit' },
    size: { type: Number, required: true },
    price: { type: Number, default: null }, // null for market orders
    status: { type: String, enum: ['open', 'filled', 'cancelled'], default: 'open', index: true },
    filledAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
  },
  { timestamps: true }
)

export default mongoose.model('Order', orderSchema)
