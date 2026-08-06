import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import { EyeIcon, EyeOffIcon } from '../components/Icons.jsx'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [keepSignedIn, setKeepSignedIn] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    navigate('/broker')
  }

  return (
    <div className="min-h-screen bg-base-950 lg:grid lg:grid-cols-2">
      {/* Left panel */}
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

      {/* Right panel / form */}
      <div className="flex flex-col justify-center px-4 sm:px-10 lg:px-16 py-10 min-h-screen">
        <div className="lg:hidden mb-10">
          <Logo />
        </div>

        <div className="w-full max-w-sm mx-auto lg:mx-0">
          <p className="label-eyebrow text-accent">Client portal</p>
          <h2 className="mt-3 text-3xl font-extrabold text-white">Log in to QuantumX</h2>
          <p className="mt-2 text-sm text-slate-400">
            Use your account email and password. Two-factor verification is requested on the next step.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 card p-6 space-y-5">
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

            <button type="submit" className="btn-primary w-full py-3">
              CONTINUE
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => navigate('/broker')} className="btn-outline text-xs">
                BROKER LOGIN
              </button>
              <button type="button" onClick={() => navigate('/admin')} className="btn-outline text-xs">
                ADMIN LOGIN
              </button>
            </div>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            New here?{' '}
            <button onClick={() => navigate('/create-account')} className="font-medium text-warn hover:brightness-110">
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
