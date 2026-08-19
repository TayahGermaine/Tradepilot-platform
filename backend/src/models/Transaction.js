import mongoose from 'mongoose'

const { Schema } = mongoose

const transactionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    action: { type: String, enum: ['Deposit', 'Withdrawal', 'Swap', 'Trade'], required: true },
    asset: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'on_hold'], default: 'pending' },
    meta: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
)

export default mongoose.model('Transaction', transactionSchema)
