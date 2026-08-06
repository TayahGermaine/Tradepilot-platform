import AppNav from '../components/AppNav.jsx'

const marketRows = [
  { pair: 'BTC/USDT', price: '$68,492', change: '+2.34%', volume: '$4.8B', sentiment: 'Momentum' },
  { pair: 'ETH/USDT', price: '$3,742', change: '+1.18%', volume: '$2.1B', sentiment: 'Bullish' },
  { pair: 'SOL/USDT', price: '$186.40', change: '-0.74%', volume: '$860M', sentiment: 'Cooling' },
  { pair: 'XRP/USDT', price: '$0.629', change: '+0.91%', volume: '$540M', sentiment: 'Breakout' },
  { pair: 'LINK/USDT', price: '$19.34', change: '-1.12%', volume: '$320M', sentiment: 'Watch' },
]

const newsCards = [
  { title: 'Spot ETF inflows accelerate', detail: 'Institutions continue to add exposure as BTC holds above key support.' },
  { title: 'Funding stays neutral', detail: 'Open interest climbs while rates remain balanced, supporting trend continuation.' },
  { title: 'Macro risk easing', detail: 'Lower volatility in rates is helping crypto stay constructive into the close.' },
]

export default function MarketsPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,108,246,0.18),_transparent_30%),linear-gradient(135deg,_#05060a_0%,_#0a0b10_100%)] text-slate-200">
      <AppNav />

      <main className="mx-auto flex max-w-[1700px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="rounded-2xl border border-base-border bg-base-950/80 p-5 shadow-[0_0_0_1px_rgba(59,108,246,0.08),0_25px_70px_rgba(5,6,10,0.45)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="label-eyebrow text-accent">Live markets</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Real-time crypto market intelligence
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
                Track the most active pairs, monitor momentum shifts, and see the latest market narrative in one professional workspace.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="pill border border-up/20 bg-up/10 text-up">24/7 STREAMING</span>
              <span className="pill border border-accent/20 bg-accent/10 text-accent">AI MARKET SNAP</span>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-2xl border border-base-border bg-base-950/85 p-4 sm:p-5">
            <div className="flex items-center justify-between border-b border-base-border pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Market board</p>
                <h2 className="mt-1 text-lg font-semibold text-white">Top movers</h2>
              </div>
              <button className="rounded-lg border border-base-600 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/5">
                Refresh
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="pb-3 font-medium">Pair</th>
                    <th className="pb-3 font-medium">Price</th>
                    <th className="pb-3 font-medium">Change</th>
                    <th className="pb-3 font-medium">Volume</th>
                    <th className="pb-3 font-medium">Sentiment</th>
                  </tr>
                </thead>
                <tbody>
                  {marketRows.map((row) => (
                    <tr key={row.pair} className="border-t border-base-border text-slate-300">
                      <td className="py-3 font-semibold text-white">{row.pair}</td>
                      <td className="py-3">{row.price}</td>
                      <td className={`py-3 font-semibold ${row.change.startsWith('+') ? 'text-up' : 'text-down'}`}>
                        {row.change}
                      </td>
                      <td className="py-3">{row.volume}</td>
                      <td className="py-3">
                        <span className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                          {row.sentiment}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-base-border bg-base-950/85 p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Market pulse</p>
              <h2 className="mt-2 text-xl font-semibold text-white">What is moving</h2>
              <div className="mt-4 space-y-3">
                {newsCards.map((item) => (
                  <div key={item.title} className="rounded-xl border border-base-border bg-base-900/70 p-3">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-base-border bg-base-950/85 p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">AI readout</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Risk snapshot</h2>
              <div className="mt-4 rounded-xl border border-accent/20 bg-accent/10 p-4">
                <p className="text-sm font-semibold text-white">Risk-on conditions remain intact</p>
                <p className="mt-2 text-sm text-slate-300">
                  Volatility is easing while liquidity stays healthy, giving trend-followers a cleaner setup for the next leg.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
