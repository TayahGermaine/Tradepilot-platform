import AppNav from '../components/AppNav.jsx'

const pricePoints = [28, 34, 31, 37, 35, 42, 48, 44, 52, 58, 54, 61]
const candles = [
  { x: 30, open: 28, close: 32, high: 34, low: 26 },
  { x: 90, open: 32, close: 29, high: 35, low: 27 },
  { x: 150, open: 29, close: 36, high: 38, low: 28 },
  { x: 210, open: 36, close: 42, high: 44, low: 35 },
  { x: 270, open: 42, close: 48, high: 50, low: 40 },
  { x: 330, open: 48, close: 54, high: 56, low: 47 },
]

export default function AnalysisPage() {
  const max = 62
  const min = 24

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,108,246,0.18),_transparent_32%),linear-gradient(135deg,_#05060a_0%,_#0a0b10_100%)] text-slate-200">
      <AppNav />

      <main className="mx-auto flex max-w-[1700px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="rounded-2xl border border-base-border bg-base-950/80 p-5 shadow-[0_0_0_1px_rgba(59,108,246,0.08),0_25px_70px_rgba(5,6,10,0.45)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="label-eyebrow text-accent">Market analysis</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Bullish breakout pattern on the 4H chart
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
                The analysis view now highlights a clear chart pattern with breakout confirmation and a trade setup tailored for momentum traders.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="pill border border-up/20 bg-up/10 text-up">BREAKOUT ACTIVE</span>
              <span className="pill border border-accent/20 bg-accent/10 text-accent">4H VIEW</span>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          <div className="rounded-2xl border border-base-border bg-base-950/85 p-4 sm:p-5">
            <div className="flex items-center justify-between border-b border-base-border pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Chart pattern</p>
                <h2 className="mt-1 text-lg font-semibold text-white">Ascending channel with breakout</h2>
              </div>
              <span className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                High conviction
              </span>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-base-border bg-base-900/70 p-3">
              <svg viewBox="0 0 360 220" className="h-[260px] w-full">
                <line x1="20" y1="190" x2="340" y2="190" stroke="#334155" strokeWidth="1" />
                <line x1="20" y1="40" x2="20" y2="190" stroke="#334155" strokeWidth="1" />
                {[0, 1, 2, 3, 4].map((step) => (
                  <line key={step} x1="20" y1={50 + step * 35} x2="340" y2={50 + step * 35} stroke="#1f2937" strokeWidth="1" />
                ))}

                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  points={pricePoints
                    .map((point, index) => `${30 + index * 28},${190 - ((point - min) / (max - min)) * 130}`)
                    .join(' ')}
                />

                <polyline
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  points="40,75 180,75 320,75"
                />

                {candles.map((candle) => {
                  const highY = 190 - ((candle.high - min) / (max - min)) * 130
                  const lowY = 190 - ((candle.low - min) / (max - min)) * 130
                  const openY = 190 - ((candle.open - min) / (max - min)) * 130
                  const closeY = 190 - ((candle.close - min) / (max - min)) * 130
                  const isBullish = candle.close >= candle.open

                  return (
                    <g key={candle.x}>
                      <line x1={candle.x} y1={highY} x2={candle.x} y2={lowY} stroke={isBullish ? '#22c55e' : '#ef4444'} strokeWidth="2" />
                      <rect
                        x={candle.x - 8}
                        y={Math.min(openY, closeY)}
                        width="16"
                        height={Math.max(6, Math.abs(closeY - openY))}
                        fill={isBullish ? '#22c55e' : '#ef4444'}
                        rx="3"
                      />
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-base-border bg-base-950/85 p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Pattern notes</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-base-border bg-base-900/70 p-3">
                  <p className="text-sm font-semibold text-white">Breakout confirmation</p>
                  <p className="mt-1 text-sm text-slate-400">Price has cleared the prior resistance and is holding above the channel trendline.</p>
                </div>
                <div className="rounded-xl border border-base-border bg-base-900/70 p-3">
                  <p className="text-sm font-semibold text-white">Trade plan</p>
                  <p className="mt-1 text-sm text-slate-400">Look for a pullback retest near the breakout zone before entering with a tight stop.</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-base-border bg-base-950/85 p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Signal summary</p>
              <div className="mt-4 rounded-xl border border-accent/20 bg-accent/10 p-4">
                <p className="text-sm font-semibold text-white">Bias: Bullish</p>
                <p className="mt-2 text-sm text-slate-300">Momentum is improving and the breakout suggests trend continuation if the market holds above the confirmation line.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
