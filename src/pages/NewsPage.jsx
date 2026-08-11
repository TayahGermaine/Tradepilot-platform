import AppNav from '../components/AppNav.jsx'

const headlines = [
  {
    title: 'BTC holds above $68K as ETF flows remain constructive',
    detail: 'Institutional demand is supporting price action despite elevated volatility in the broader risk-on tape.',
    time: '8 min ago',
  },
  {
    title: 'ETH sees renewed demand ahead of staking and L2 narratives',
    detail: 'Developers continue to rotate capital into ecosystem-linked assets as activity remains resilient.',
    time: '24 min ago',
  },
  {
    title: 'Macro relief lifts risk appetite for high-beta crypto',
    detail: 'Lower treasury volatility is helping momentum names regain traction across the stack.',
    time: '1 hr ago',
  },
]

const insightCards = [
  { label: 'Volatility', value: 'Moderate', detail: 'Range expansion remains healthy and liquidity is holding.' },
  { label: 'Momentum', value: 'Positive', detail: 'Trend-followers are seeing fresh confirmation across majors.' },
  { label: 'Risk', value: 'Managed', detail: 'Funding is balanced and no major liquidation cluster is visible.' },
]

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,108,246,0.18),_transparent_32%),linear-gradient(135deg,_#05060a_0%,_#0a0b10_100%)] text-slate-200">
      <AppNav />

      <main className="mx-auto flex max-w-[1700px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="rounded-2xl border border-base-border bg-base-950/80 p-5 shadow-[0_0_0_1px_rgba(59,108,246,0.08),0_25px_70px_rgba(5,6,10,0.45)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="label-eyebrow text-accent">News desk</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Market news, explained for active traders
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
                Follow the latest headlines and see how they translate into likely market behavior for your portfolio and execution plan.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="pill border border-up/20 bg-up/10 text-up">UPDATED LIVE</span>
              <span className="pill border border-accent/20 bg-accent/10 text-accent">AI SUMMARY</span>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          <div className="rounded-2xl border border-base-border bg-base-950/85 p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Top headlines</p>
            <div className="mt-4 space-y-3">
              {headlines.map((item) => (
                <div key={item.title} className="rounded-xl border border-base-border bg-base-900/70 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <span className="text-xs text-slate-500">{item.time}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-base-border bg-base-950/85 p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Quick read</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Current market narrative</h2>
              <div className="mt-4 rounded-xl border border-accent/20 bg-accent/10 p-4">
                <p className="text-sm font-semibold text-white">Risk appetite is improving</p>
                <p className="mt-2 text-sm text-slate-300">
                  Sentiment remains constructive, but traders should stay focused on confirmation signals before adding aggressive exposure.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-base-border bg-base-950/85 p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Market pulse</p>
              <div className="mt-4 grid gap-3">
                {insightCards.map((card) => (
                  <div key={card.label} className="rounded-xl border border-base-border bg-base-900/70 p-3">
                    <p className="text-sm font-semibold text-white">{card.label}</p>
                    <p className="mt-1 text-sm text-accent">{card.value}</p>
                    <p className="mt-1 text-sm text-slate-400">{card.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
