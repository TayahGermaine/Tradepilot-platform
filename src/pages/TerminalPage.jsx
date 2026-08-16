import { useState } from 'react'
import AppNav from '../components/AppNav.jsx'
import { useLiveMarkets, formatPrice } from '../hooks/useLiveMarkets.js'
import Sparkline from '../components/Sparkline.jsx'
import OrderModal from '../components/OrderModal.jsx'
import { useNotifications } from '../hooks/useNotifications.jsx'

const signals = [
  { label: 'Momentum', value: 'Bullish breakout', detail: 'BTC reclaimed the 20-session VWAP after a 4h close above resistance.' },
  { label: 'Flow', value: 'Spot demand rising', detail: 'Open interest is climbing while funding remains neutral.' },
  { label: 'AI edge', value: 'High-conviction setup', detail: 'Model score 91/100 with elevated volatility and a positive skew.' },
]

const initialOrders = [
  { id: 1, type: 'Limit', pair: 'BTC/USDT', side: 'Buy', size: '0.45', status: 'Queued' },
  { id: 2, type: 'Stop', pair: 'ETH/USDT', side: 'Sell', size: '1.20', status: 'Live' },
  { id: 3, type: 'OCO', pair: 'SOL/USDT', side: 'Buy', size: '18.0', status: 'Ready' },
]

export default function TerminalPage() {
  const { data, loading } = useLiveMarkets()
  const [orderOpen, setOrderOpen] = useState(false)
  const [selectedMarket, setSelectedMarket] = useState(null)
  const [orders, setOrders] = useState(initialOrders)
  const { push } = useNotifications()

  function openOrderModal(market) {
    setSelectedMarket(market)
    setOrderOpen(true)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,108,246,0.16),_transparent_28%),linear-gradient(135deg,_#05060a_0%,_#0a0b10_100%)] text-slate-200">
      <AppNav />

      <main className="mx-auto flex max-w-[1700px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="rounded-2xl border border-base-border bg-base-950/80 p-4 shadow-[0_0_0_1px_rgba(59,108,246,0.08),0_30px_80px_rgba(5,6,10,0.45)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="label-eyebrow text-accent">QuantumX terminal</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Bloomberg-grade crypto execution workspace
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
                A professional trading cockpit blending multi-chart analysis, institutional order routing, and an AI assistant that surfaces live signals and execution ideas.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="pill border border-up/20 bg-up/10 text-up">
                <span className="h-1.5 w-1.5 rounded-full bg-up pulse-dot" />
                {loading ? 'CONNECTING' : 'LIVE MARKET'}
              </span>
              <span className="pill border border-accent/20 bg-accent/10 text-accent">AI ASSISTANT</span>
              <span className="pill border border-violet-500/20 bg-violet-soft text-violet-300">RISK ON</span>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-base-border bg-base-950/85 p-4 sm:p-5">
              <div className="flex items-center justify-between border-b border-base-border pb-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Watchlist</p>
                  <h2 className="mt-1 text-lg font-semibold text-white">Live crypto prices</h2>
                </div>
                <button onClick={() => openOrderModal(data[0])} className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-hover transition-colors">
                  + ADD SYMBOL
                </button>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {data.map((item) => {
                  const tone = item.change >= 0 ? 'up' : 'down'
                  return (
                    <button
                      key={item.id}
                      onClick={() => openOrderModal(item)}
                      className="text-left rounded-xl border border-base-border bg-base-900/80 p-4 hover:border-accent/40 hover:bg-base-900 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {item.image && <img src={item.image} alt={item.symbol} className="h-5 w-5 rounded-full" />}
                          <span className="font-mono text-sm font-semibold text-white">{item.pair}</span>
                        </div>
                        <span className={`text-sm font-semibold ${tone === 'up' ? 'text-up' : 'text-down'}`}>
                          {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-xl font-semibold text-white">{formatPrice(item.price)}</p>
                        <Sparkline data={item.sparkline} tone={tone} width={80} height={28} />
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-base-border bg-base-950/85 p-4 sm:p-5">
              <div className="flex items-center justify-between border-b border-base-border pb-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Execution board</p>
                  <h2 className="mt-1 text-lg font-semibold text-white">Order routing</h2>
                </div>
                <button onClick={() => openOrderModal(data[0])} className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-hover transition-colors">
                  PLACE ORDER
                </button>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                      <th className="pb-3 font-medium">Type</th>
                      <th className="pb-3 font-medium">Pair</th>
                      <th className="pb-3 font-medium">Side</th>
                      <th className="pb-3 font-medium">Size</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-t border-base-border text-slate-300">
                        <td className="py-3 font-semibold text-white">{order.type}</td>
                        <td className="py-3">{order.pair}</td>
                        <td className={`py-3 ${order.side === 'Buy' ? 'text-up' : 'text-down'}`}>{order.side}</td>
                        <td className="py-3">{order.size}</td>
                        <td className="py-3">
                          <span className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-base-border bg-base-950/85 p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">AI assistant</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Signal intelligence</h2>

              <div className="mt-4 space-y-3">
                {signals.map((signal) => (
                  <div key={signal.label} className="rounded-xl border border-base-border bg-base-900/70 p-3">
                    <p className="text-sm font-semibold text-white">{signal.label}</p>
                    <p className="mt-1 text-sm text-accent">{signal.value}</p>
                    <p className="mt-1 text-sm text-slate-400">{signal.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-base-border bg-base-950/85 p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Smart panel</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Suggested next move</h2>
              <div className="mt-4 rounded-xl border border-accent/20 bg-accent/10 p-4">
                <p className="text-sm font-semibold text-white">BTC breakout confirmation</p>
                <p className="mt-2 text-sm text-slate-300">
                  Scale into the trend only after a retest of the 15m VWAP and keep the stop under the prior swing low.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <OrderModal
        open={orderOpen}
        onClose={() => setOrderOpen(false)}
        market={selectedMarket}
      />
    </div>
  )
}
