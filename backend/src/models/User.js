import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const { Schema } = mongoose

const userSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['client', 'broker', 'admin'], default: 'client', index: true },
    twoFA: { type: Boolean, default: false },
    avatar: { type: String, default: '' },

    // Client-only: which broker manages this account (used for broker "client book" views)
    brokerId: { type: Schema.Types.ObjectId, ref: 'User', default: null },

    // Broker-only display fields
    region: { type: String, default: '' },

    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  },
  { timestamps: true }
)

userSchema.methods.setPassword = async function setPassword(plain) {
  const salt = await bcrypt.genSalt(10)
  this.passwordHash = await bcrypt.hash(plain, salt)
}

userSchema.methods.comparePassword = function comparePassword(plain) {
  return bcrypt.compare(plain, this.passwordHash)
}

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    name: this.fullName,
    email: this.email,
    role: this.role,
    twoFA: this.twoFA,
    avatar: this.avatar,
    brokerId: this.brokerId ? this.brokerId.toString() : null,
    region: this.region,
    status: this.status,
  }
}

export default mongoose.model('User', userSchema)
