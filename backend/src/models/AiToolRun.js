import mongoose from 'mongoose'

const { Schema } = mongoose

const aiToolRunSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tool: { type: String, required: true },
    result: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('AiToolRun', aiToolRunSchema)
