import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import { useAuth, getRoleDashboard } from '../hooks/useAuth.jsx'

const SIGNUP_ROLES = [
  { id: 'client', label: 'Client', description: 'Trade, manage portfolio and wallet' },
  { id: 'broker', label: 'Broker', description: 'Manage client book and approve requests' },
]

export default function CreateAccount() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [role, setRole] = useState('client')
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      const result = await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role,
      })

      if (result.token && result.user) {
        navigate(getRoleDashboard(result.user.role))
      } else {
        navigate('/login')
      }
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-950 text-slate-200">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-base-border bg-[radial-gradient(circle_at_top_left,_rgba(59,108,246,0.16),_transparent_30%),linear-gradient(135deg,_#0a0b10_0%,_#05060a_100%)] p-6 shadow-[0_0_0_1px_rgba(59,108,246,0.08),0_30px_80px_rgba(5,6,10,0.45)] sm:p-8 lg:p-10">
          <div className="flex items-center justify-between">
            <Logo />
            <button onClick={() => navigate('/login')} className="text-sm font-medium text-slate-400 hover:text-white">
              Already have an account?
            </button>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="label-eyebrow text-accent">Create account</p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Start trading with a professional crypto terminal.
              </h1>
              <p className="mt-4 max-w-xl text-sm text-slate-400 sm:text-base">
                Build your institutional-grade workspace with live markets, AI-guided insights, and secure access to execution tools.
              </p>

              <div className="mt-6 rounded-2xl border border-base-border bg-base-900/70 p-4">
                <p className="text-sm font-semibold text-white">What you get</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-400">
                  <li>• Live watchlists and real-time market updates</li>
                  <li>• AI-powered signal and risk analysis</li>
                  <li>• Secure sign-in with broker-ready workflows</li>
                </ul>
              </div>

              <div className="mt-4 rounded-2xl border border-warn/20 bg-warn/5 p-4">
                <p className="text-sm font-semibold text-warn">Admin accounts</p>
                <p className="mt-1 text-sm text-slate-400">
                  Admin access is restricted and cannot be created through signup. Contact your platform operator for admin credentials.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="card p-6 sm:p-7">
              <div className="space-y-4">
                <div>
                  <label className="label-eyebrow">Account type</label>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    {SIGNUP_ROLES.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => { setRole(r.id); setError(null) }}
                        className={`rounded-lg border px-3 py-3 text-left transition-colors ${
                          role === r.id
                            ? 'border-accent bg-accent/10'
                            : 'border-base-border hover:border-slate-500'
                        }`}
                      >
                        <span className={`block text-sm font-bold ${role === r.id ? 'text-accent' : 'text-slate-300'}`}>
                          {r.label}
                        </span>
                        <span className="mt-0.5 block text-[11px] leading-tight text-slate-500">
                          {r.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label-eyebrow">Full name</label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="input-field mt-1.5"
                    placeholder="Jordan Lee"
                    required
                  />
                </div>

                <div>
                  <label className="label-eyebrow">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="input-field mt-1.5"
                    placeholder="you@company.com"
                    required
                  />
                </div>

                <div>
                  <label className="label-eyebrow">Password</label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    className="input-field mt-1.5"
                    placeholder="At least 8 characters"
                    required
                    minLength="8"
                  />
                </div>

                <div>
                  <label className="label-eyebrow">Confirm password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="input-field mt-1.5"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-lg border border-down/20 bg-down/10 px-4 py-3 text-sm text-down">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary mt-6 w-full py-3 disabled:opacity-60">
                {loading ? 'CREATING ACCOUNT…' : `CREATE ${role.toUpperCase()} ACCOUNT`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
