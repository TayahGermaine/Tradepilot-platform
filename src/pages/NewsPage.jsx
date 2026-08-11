import AppNav from '../components/AppNav.jsx'

const headlineCards = [
  {
    title: 'Bitcoin holds above key support as ETF inflows stay firm',
    summary: 'Spot demand remains constructive while traders monitor whether the breakout can extend into the weekly close.',
    tag: 'Macro',
  },
  {
    title: 'Ethereum staking flows accelerate ahead of protocol upgrades',
    summary: 'Layer-1 activity remains elevated as capital rotates into higher-conviction yield opportunities.',
    tag: 'Ethereum',
  },
  {
    title: 'Solana volume rises as traders price in another volatility leg',
    summary: 'Market breadth is improving, but risk remains elevated in fast-moving alt coins after the latest spike.',
    tag: 'Altcoin',
  },
]

const marketBriefs = [
  { label: 'Fed risk', value: 'Neutral', detail: 'Rates remain stable, reducing macro pressure on crypto.' },
  { label: 'ETF flows', value: 'Positive', detail: 'Institutional demand remains firm across spot products.' },
  { label: 'Funding', value: 'Balanced', detail: 'Leverage is not overheating despite the recent push upward.' },
]

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-base-950 text-slate-200">
      <AppNav />

      <main className="mx-auto max-w-[1700px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label-eyebrow text-accent">News desk</p>
            <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">Market news and narrative tracking</h1>
          </div>
          <span className="pill border border-accent/20 bg-accent/10 text-accent">LIVE UPDATE</span>
        </div>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {headlineCards.map((item) => (
              <article key={item.title} className="card p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="pill border border-base-600 bg-base-900 text-slate-300">{item.tag}</span>
                  <span className="text-xs text-slate-500">2m ago</span>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-white">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.summary}</p>
                <button className="mt-4 text-sm font-semibold text-accent hover:text-accent-hover">Read analysis</button>
              </article>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="card p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Market brief</p>
              <div className="mt-4 space-y-4">
                {marketBriefs.map((item) => (
                  <div key={item.label} className="rounded-xl border border-base-border bg-base-900/70 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">{item.label}</span>
                      <span className="text-sm font-semibold text-white">{item.value}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">AI summary</p>
              <div className="mt-4 rounded-xl border border-accent/20 bg-accent/10 p-4">
                <p className="text-sm font-semibold text-white">Risk remains controlled</p>
                <p className="mt-2 text-sm text-slate-300">
                  Broad market leadership is still constructive, with momentum holding above trend support and liquidity staying healthy.
                </p>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}
