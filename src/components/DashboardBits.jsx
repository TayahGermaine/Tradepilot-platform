export function StatCard({ label, value, delta, tone = 'neutral' }) {
  const toneClass = {
    up: 'text-up',
    down: 'text-down',
    neutral: 'text-slate-500',
  }[tone]

  return (
    <div className="stat-card">
      <p className="label-eyebrow">{label}</p>
      <p className="mt-2 font-mono text-2xl sm:text-3xl font-bold text-white">{value}</p>
      <p className={`mt-1 text-xs font-medium ${toneClass}`}>{delta}</p>
    </div>
  )
}

const statusStyles = {
  Healthy: 'bg-up/10 text-up border border-up/20',
  Watch: 'bg-warn/10 text-warn border border-warn/20',
  'Margin call': 'bg-down/10 text-down border border-down/20',
  Verified: 'bg-up/10 text-up border border-up/20',
  Pending: 'bg-warn/10 text-warn border border-warn/20',
  Rejected: 'bg-down/10 text-down border border-down/20',
  Low: 'bg-up/10 text-up border border-up/20',
  Medium: 'bg-warn/10 text-warn border border-warn/20',
  High: 'bg-down/10 text-down border border-down/20',
  Client: 'bg-white/5 text-slate-300 border border-base-border',
  Broker: 'bg-accent/10 text-accent border border-accent/20',
}

export function StatusPill({ children }) {
  const cls = statusStyles[children] || 'bg-white/5 text-slate-300 border border-base-border'
  return <span className={`pill ${cls}`}>{children}</span>
}

export function MarginBar({ pct }) {
  const color = pct >= 80 ? 'bg-down' : pct >= 55 ? 'bg-warn' : 'bg-up'
  return (
    <div className="flex items-center gap-2 min-w-[110px]">
      <div className="h-1.5 w-20 rounded-full bg-base-600 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-xs text-slate-400">{pct}%</span>
    </div>
  )
}

export function HealthBar({ pct, tone }) {
  const color = tone === 'warn' ? 'bg-warn' : 'bg-up'
  return (
    <div className="h-1.5 w-full rounded-full bg-base-600 overflow-hidden mt-2">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}
