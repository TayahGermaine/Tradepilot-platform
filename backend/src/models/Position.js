import mongoose from 'mongoose'

const { Schema } = mongoose

const positionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    symbol: { type: String, required: true },
    size: { type: Number, required: true },
    sizeUnit: { type: String, required: true }, // e.g. "BTC"
    entry: { type: Number, required: true },
    mark: { type: Number, required: true },
    status: { type: String, enum: ['Long', 'Short', 'Hedged', 'Scalp'], default: 'Long' },
  },
  { timestamps: true }
)

positionSchema.virtual('pnl').get(function pnl() {
  return (this.mark - this.entry) * this.size
})

positionSchema.set('toJSON', { virtuals: true })

export default mongoose.model('Position', positionSchema)
