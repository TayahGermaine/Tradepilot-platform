import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo.jsx'

export default function CreateAccount() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    navigate('/login')
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
            </div>

            <form onSubmit={handleSubmit} className="card p-6 sm:p-7">
              <div className="space-y-4">
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
                    placeholder="••••••••"
                    required
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

              <button type="submit" className="btn-primary mt-6 w-full py-3">
                CREATE ACCOUNT
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
