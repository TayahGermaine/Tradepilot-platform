import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import { EyeIcon, EyeOffIcon } from '../components/Icons.jsx'
import { useAuth, getRoleDashboard } from '../hooks/useAuth.jsx'

const ROLES = [
  { id: 'client', label: 'Client', description: 'Trade, manage portfolio and wallet' },
  { id: 'broker', label: 'Broker', description: 'Manage client book and approve requests' },
  { id: 'admin', label: 'Admin', description: 'Platform oversight (restricted access)' },
]

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [role, setRole] = useState('client')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [keepSignedIn, setKeepSignedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const user = await login(email, password, role)
      navigate(getRoleDashboard(user.role))
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  function quickLogin(selectedRole) {
    setRole(selectedRole)
    setError(null)
    setLoading(true)
    const creds = selectedRole === 'admin'
      ? { email: 'admin@tradepilot.io', password: 'AdminSecure2026!' }
      : { email, password }
    login(creds.email, creds.password, selectedRole)
      .then((user) => navigate(getRoleDashboard(user.role)))
      .catch((err) => setError(err.message || 'Login failed'))
      .finally(() => setLoading(false))
  }

  return (
    <div className="min-h-screen bg-base-950 lg:grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden border-r border-base-border bg-radial-fade px-12 py-10">
        <Logo />

        <div>
          <p className="label-eyebrow text-accent">Institutional crypto execution</p>
          <h1 className="mt-4 text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
            Every order routed,
            <br />
            every position audited,
            <br />
            every login verified.
          </h1>

          <div className="mt-10 flex items-center gap-10 border-t border-base-border pt-6 max-w-md">
            <div>
              <p className="font-mono text-2xl font-bold text-white">38.4B</p>
              <p className="text-xs text-slate-500 mt-1">24h volume</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-bold text-white">99.99%</p>
              <p className="text-xs text-slate-500 mt-1">Matching uptime</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-bold text-white">140+</p>
              <p className="text-xs text-slate-500 mt-1">Markets</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600">
          Protected by hardware-backed 2FA, withdrawal allow-lists and broker-level review.
        </p>
      </div>

      <div className="flex flex-col justify-center px-4 sm:px-10 lg:px-16 py-10 min-h-screen">
        <div className="lg:hidden mb-10">
          <Logo />
        </div>

        <div className="w-full max-w-sm mx-auto lg:mx-0">
          <p className="label-eyebrow text-accent">Sign in</p>
          <h2 className="mt-3 text-3xl font-extrabold text-white">Log in to TradePilot</h2>
          <p className="mt-2 text-sm text-slate-400">
            Select your role and enter your credentials. Two-factor verification is requested on the next step.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => { setRole(r.id); setError(null) }}
                className={`rounded-lg border px-2 py-3 text-center transition-colors ${
                  role === r.id
                    ? 'border-accent bg-accent/10 text-white'
                    : 'border-base-border text-slate-400 hover:border-slate-500'
                }`}
              >
                <span className="block text-sm font-bold">{r.label}</span>
                <span className="mt-0.5 block text-[10px] leading-tight text-slate-500">{r.description}</span>
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-down/20 bg-down/10 px-4 py-3 text-sm text-down">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 card p-6 space-y-5">
            <div>
              <label htmlFor="email" className="label-eyebrow">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field mt-1.5"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="label-eyebrow">Password</label>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                  className="h-4 w-4 rounded border-base-600 bg-base-900 text-accent focus:ring-accent"
                />
                Keep me signed in
              </label>
              <button type="button" className="font-medium text-accent hover:text-accent-hover">
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
              {loading ? 'SIGNING IN…' : `CONTINUE AS ${role.toUpperCase()}`}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => quickLogin('broker')} disabled={loading} className="btn-outline text-xs disabled:opacity-50">
                BROKER QUICK LOGIN
              </button>
              <button type="button" onClick={() => quickLogin('admin')} disabled={loading} className="btn-outline text-xs disabled:opacity-50">
                ADMIN QUICK LOGIN
              </button>
            </div>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            New here?{' '}
            <button type="button" onClick={() => navigate('/createaccount')} className="font-medium text-warn hover:brightness-110">
              Create an account
            </button>
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Need to verify your identity?{' '}
            <button type="button" onClick={() => navigate('/kyc')} className="font-medium text-accent hover:text-accent-hover">
              Complete KYC
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
