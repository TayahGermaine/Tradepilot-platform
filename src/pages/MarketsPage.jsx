import AppNav from '../components/AppNav.jsx'
import { useLiveMarkets, formatPrice } from '../hooks/useLiveMarkets.js'
import Sparkline from '../components/Sparkline.jsx'

export default function MarketsPage() {
  const { data, loading, lastUpdated, refresh } = useLiveMarkets()

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,108,246,0.18),_transparent_32%),linear-gradient(135deg,_#05060a_0%,_#0a0b10_100%)] text-slate-200">
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
              <span className="pill border border-up/20 bg-up/10 text-up">
                <span className="h-1.5 w-1.5 rounded-full bg-up pulse-dot" />
                {loading ? 'CONNECTING' : 'LIVE'}
              </span>
              <span className="pill border border-accent/20 bg-accent/10 text-accent">AI MARKET SNAP</span>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-2xl border border-base-border bg-base-950/85 p-4 sm:p-5">
            <div className="flex items-center justify-between border-b border-base-border pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Market board</p>
                <h2 className="mt-1 text-lg font-semibold text-white">Live prices</h2>
                {lastUpdated && (
                  <p className="text-xs text-slate-600 mt-0.5">Updated {lastUpdated.toLocaleTimeString()}</p>
                )}
              </div>
              <button
                onClick={refresh}
                className="rounded-lg border border-base-600 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/5 transition-colors"
              >
                Refresh
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="pb-3 font-medium">Asset</th>
                    <th className="pb-3 font-medium">Price</th>
                    <th className="pb-3 font-medium">24h Change</th>
                    <th className="pb-3 font-medium hidden sm:table-cell">Volume</th>
                    <th className="pb-3 font-medium hidden md:table-cell">7d Trend</th>
                    <th className="pb-3 font-medium">Sentiment</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => {
                    const tone = row.change >= 0 ? 'up' : 'down'
                    return (
                      <tr key={row.id} className="border-t border-base-border text-slate-300 hover:bg-white/[0.02] transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            {row.image && (
                              <img src={row.image} alt={row.symbol} className="h-6 w-6 rounded-full" />
                            )}
                            <span className="font-semibold text-white">{row.pair}</span>
                          </div>
                        </td>
                        <td className="py-3 font-mono text-slate-200">{formatPrice(row.price)}</td>
                        <td className={`py-3 font-semibold ${tone === 'up' ? 'text-up' : 'text-down'}`}>
                          {row.change >= 0 ? '+' : ''}{row.change.toFixed(2)}%
                        </td>
                        <td className="py-3 hidden sm:table-cell font-mono text-slate-400">{row.volumeStr}</td>
                        <td className="py-3 hidden md:table-cell">
                          <Sparkline data={row.sparkline} tone={tone} />
                        </td>
                        <td className="py-3">
                          <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                            tone === 'up'
                              ? 'border-up/20 bg-up/10 text-up'
                              : 'border-down/20 bg-down/10 text-down'
                          }`}>
                            {tone === 'up' ? 'Bullish' : 'Cooling'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-base-border bg-base-950/85 p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Top performer</p>
              {(() => {
                const top = [...data].sort((a, b) => b.change - a.change)[0]
                return top ? (
                  <>
                    <h2 className="mt-2 text-xl font-semibold text-white">{top.pair}</h2>
                    <div className="mt-3 flex items-center gap-3">
                      <Sparkline data={top.sparkline} tone="up" width={180} height={48} />
                      <div>
                        <p className="font-mono text-2xl font-bold text-white">{formatPrice(top.price)}</p>
                        <p className="text-sm font-semibold text-up">+{top.change.toFixed(2)}%</p>
                      </div>
                    </div>
                  </>
                ) : null
              })()}
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
