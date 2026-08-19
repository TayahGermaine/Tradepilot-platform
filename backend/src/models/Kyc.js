import mongoose from 'mongoose'

const { Schema } = mongoose

const kycSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    fullName: { type: String, default: '' },
    dob: { type: String, default: '' },
    nationality: { type: String, default: '' },
    address: { type: String, default: '' },
    idType: { type: String, enum: ['passport', 'national_id', 'driver_license'], default: 'passport' },
    idNumber: { type: String, default: '' },
    docUploaded: { type: Boolean, default: false },
    selfieUploaded: { type: Boolean, default: false },
    status: { type: String, enum: ['not_started', 'pending', 'approved', 'rejected'], default: 'not_started', index: true },
    submittedAt: { type: Date, default: null },
    reviewedAt: { type: Date, default: null },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
)

export default mongoose.model('Kyc', kycSchema)
