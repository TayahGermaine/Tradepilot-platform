import { Link } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import { ArrowRight, iconMap } from '../components/Icons.jsx'
import { heroStats, landingFeatures } from '../data/mockData.js'

export default function Landing() {
  return (
    <div className="min-h-screen bg-base-950 bg-radial-fade text-slate-200">
      <header className="mx-auto flex max-w-[1700px] items-center justify-between px-4 sm:px-6 lg:px-8 py-6">
        <Logo />
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-outline hidden sm:inline-flex">
            LOG IN
          </Link>
          <Link to="/createaccount" className="btn-primary">
            CREATE ACCOUNT
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20">
        <div className="max-w-3xl">
          <span className="pill bg-violet-soft text-violet-300 border border-violet-500/25">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 pulse-dot" />
            AI MODEL V4 · STREAMING
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
            Smarter crypto decisions,
            <br />
            in one terminal.
          </h1>

          <p className="mt-6 max-w-xl text-base sm:text-lg text-slate-400">
            Real-time monitoring, technical analysis, sentiment and news intelligence — read by an AI
            that tells you what it means for your book.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/terminal" className="btn-primary px-6 py-3 text-sm">
              ENTER TERMINAL
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/markets" className="btn-outline px-6 py-3 text-sm">
              VIEW LIVE MARKETS
            </Link>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl">
          {landingFeatures.map((f) => {
            const Icon = iconMap[f.icon]
            return (
              <div key={f.title} className="card p-6 hover:border-accent/40 transition-colors">
                <Icon className="h-5 w-5 text-accent" />
                <h3 className="mt-4 font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-16 flex flex-wrap gap-x-12 gap-y-4">
          {heroStats.map((s) => (
            <div key={s.label}>
              <p className="font-mono text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
