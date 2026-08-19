import mongoose from 'mongoose'

const { Schema } = mongoose

const brokerRequestSchema = new Schema(
  {
    ref: { type: String, required: true, unique: true, index: true }, // e.g. "RQ-2201"
    broker: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    detail: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending', index: true },
    decidedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

export default mongoose.model('BrokerRequest', brokerRequestSchema)
