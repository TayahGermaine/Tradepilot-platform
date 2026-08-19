import mongoose from 'mongoose'

const { Schema } = mongoose

// One wallet per user. `balances` maps asset symbol -> amount held.
// `cashAvailable` / `collateralLocked` back the wallet summary stats card.
const walletSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    balances: {
      type: Map,
      of: Number,
      default: () => new Map([['USDT', 0], ['BTC', 0], ['ETH', 0], ['SOL', 0]]),
    },
    cashAvailable: { type: Number, default: 0 },
    collateralLocked: { type: Number, default: 0 },
    openTransfers: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('Wallet', walletSchema)
