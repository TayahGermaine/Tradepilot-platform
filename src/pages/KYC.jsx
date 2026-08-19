import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppNav from '../components/AppNav.jsx'
import { useNotifications } from '../hooks/useNotifications.jsx'
import { ShieldIcon, EyeIcon, EyeOffIcon } from '../components/Icons.jsx'
import { clientApi } from '../services/clientApi.js'

const steps = [
  { id: 0, label: 'Personal info' },
  { id: 1, label: 'Document upload' },
  { id: 2, label: 'Selfie verification' },
  { id: 3, label: 'Complete' },
]

export default function KYC() {
  const navigate = useNavigate()
  const { push } = useNotifications()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    fullName: '',
    dob: '',
    nationality: '',
    address: '',
    idType: 'passport',
    idNumber: '',
  })
  const [docUploaded, setDocUploaded] = useState(false)
  const [selfieUploaded, setSelfieUploaded] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function next() {
    if (step < 3) setStep(step + 1)
  }
  function back() {
    if (step > 0) setStep(step - 1)
  }

  async function finish() {
    setError(null)
    setSubmitting(true)
    try {
      await clientApi.submitKyc({
        ...form,
        docUploaded,
        selfieUploaded,
      })
      setSubmitted(true)
      push('KYC submitted', 'Your identity verification is under review.', 'up')
      setTimeout(() => navigate('/terminal'), 2200)
    } catch (err) {
      setError(err.message || 'Failed to submit verification')
    } finally {
      setSubmitting(false)
    }
  }

  const canProceed =
    step === 0
      ? form.fullName && form.dob && form.nationality && form.address
      : step === 1
      ? docUploaded && form.idNumber
      : step === 2
      ? selfieUploaded
      : true

  return (
    <div className="min-h-screen bg-base-950">
      <AppNav />

      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
            <ShieldIcon className="h-5 w-5 text-accent" />
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Identity verification (KYC)</h1>
            <p className="mt-1 text-sm text-slate-400">
              Complete verification to unlock withdrawals, higher limits, and full trading access.
            </p>
          </div>
        </div>

        {/* Stepper */}
        <div className="mt-8 flex items-center gap-1 sm:gap-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-1 flex-1">
              <div className="flex-1">
                <div
                  className={`h-1.5 rounded-full transition-colors ${
                    i <= step ? 'bg-accent' : 'bg-base-600'
                  }`}
                />
                <p
                  className={`mt-2 text-xs font-medium hidden sm:block ${
                    i <= step ? 'text-accent' : 'text-slate-600'
                  }`}
                >
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 card p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-up/10 border border-up/20">
                <ShieldIcon className="h-8 w-8 text-up" />
              </div>
              <h2 className="mt-5 text-2xl font-extrabold text-white">Verification submitted</h2>
              <p className="mt-3 text-sm text-slate-400 max-w-sm mx-auto">
                Your documents are under review. You'll be redirected to the terminal shortly.
              </p>
            </div>
          ) : step === 0 ? (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-white">Personal information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-eyebrow">Full legal name</label>
                  <input name="fullName" value={form.fullName} onChange={handleChange} className="input-field mt-1.5" placeholder="Jordan Lee" />
                </div>
                <div>
                  <label className="label-eyebrow">Date of birth</label>
                  <input name="dob" type="date" value={form.dob} onChange={handleChange} className="input-field mt-1.5" />
                </div>
                <div>
                  <label className="label-eyebrow">Nationality</label>
                  <input name="nationality" value={form.nationality} onChange={handleChange} className="input-field mt-1.5" placeholder="United States" />
                </div>
                <div>
                  <label className="label-eyebrow">Residential address</label>
                  <input name="address" value={form.address} onChange={handleChange} className="input-field mt-1.5" placeholder="123 Main St, New York, NY" />
                </div>
              </div>
            </div>
          ) : step === 1 ? (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-white">Government-issued ID</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-eyebrow">ID type</label>
                  <select name="idType" value={form.idType} onChange={handleChange} className="input-field mt-1.5">
                    <option value="passport">Passport</option>
                    <option value="driver_license">Driver's license</option>
                    <option value="national_id">National ID</option>
                  </select>
                </div>
                <div>
                  <label className="label-eyebrow">ID number</label>
                  <input name="idNumber" value={form.idNumber} onChange={handleChange} className="input-field mt-1.5" placeholder="P1234567" />
                </div>
              </div>

              <div>
                <label className="label-eyebrow">Upload document (front &amp; back)</label>
                <button
                  type="button"
                  onClick={() => setDocUploaded(true)}
                  className={`mt-1.5 w-full rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                    docUploaded ? 'border-up/40 bg-up/5' : 'border-base-600 hover:border-accent/40'
                  }`}
                >
                  {docUploaded ? (
                    <p className="text-sm font-semibold text-up">document_front.jpg uploaded</p>
                  ) : (
                    <p className="text-sm text-slate-500">Click to upload a clear photo of your document</p>
                  )}
                </button>
              </div>
            </div>
          ) : step === 2 ? (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-white">Selfie verification</h2>
              <p className="text-sm text-slate-400">
                Take a selfie with good lighting, face centered, and no sunglasses or hats.
              </p>
              <button
                type="button"
                onClick={() => setSelfieUploaded(true)}
                className={`w-full rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
                  selfieUploaded ? 'border-up/40 bg-up/5' : 'border-base-600 hover:border-accent/40'
                }`}
              >
                {selfieUploaded ? (
                  <p className="text-sm font-semibold text-up">selfie_verified.jpg uploaded</p>
                ) : (
                  <p className="text-sm text-slate-500">Click to capture or upload a selfie</p>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Review &amp; submit</h2>
              <div className="rounded-xl border border-base-border bg-base-900 p-4 space-y-2 text-sm">
                <Row label="Name" value={form.fullName} />
                <Row label="DOB" value={form.dob} />
                <Row label="Nationality" value={form.nationality} />
                <Row label="Address" value={form.address} />
                <Row label="ID type" value={form.idType.replace('_', ' ')} />
                <Row label="ID number" value={form.idNumber} />
                <Row label="Document" value={docUploaded ? 'Uploaded' : 'Not uploaded'} />
                <Row label="Selfie" value={selfieUploaded ? 'Uploaded' : 'Not uploaded'} />
              </div>
              <p className="text-xs text-slate-500">
                By submitting, you confirm the information is accurate. Verification typically completes within 24 hours.
              </p>
            </div>
          )}

          {!submitted && (
            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                onClick={back}
                disabled={step === 0}
                className="btn-outline disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Back
              </button>
              {step < 3 ? (
                <button onClick={next} disabled={!canProceed} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
                  Continue
                </button>
              ) : (
                <button onClick={finish} disabled={submitting} className="btn-primary disabled:opacity-60">
                  {submitting ? 'Submitting…' : 'Submit verification'}
                </button>
              )}
            </div>
          )}
          {error && !submitted && (
            <p className="mt-4 text-sm text-down">{error}</p>
          )}
        </div>
      </main>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-200 capitalize">{value || '—'}</span>
    </div>
  )
}
