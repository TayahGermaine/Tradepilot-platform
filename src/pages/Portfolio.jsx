import { useState } from 'react'
import AppNav from '../components/AppNav.jsx'
import { StatCard, StatusPill, MarginBar } from '../components/DashboardBits.jsx'
import { portfolioStats, portfolioTools, portfolioPositions } from '../data/mockData.js'

export default function Portfolio() {
  const [selectedTool, setSelectedTool] = useState(portfolioTools[0].name)

  return (
    <div className="min-h-screen bg-base-950">
      <AppNav />

      <main className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Portfolio</h1>
            <p className="mt-1 text-sm text-slate-400">
              Portfolio tools and live position management working like the broker portal.
            </p>
          </div>
          <div className="card px-4 py-2 text-sm text-slate-400 whitespace-nowrap">
            Updated <span className="font-semibold text-white">Just now</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {portfolioStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
          <aside className="card p-5 sm:p-6">
            <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">Portfolio tools</h2>
            <div className="mt-4 space-y-3">
              {portfolioTools.map((tool) => (
                <button
                  key={tool.name}
                  onClick={() => setSelectedTool(tool.name)}
                  className={`w-full text-left rounded-2xl border px-4 py-3 transition-colors ${
                    selectedTool === tool.name
                      ? 'border-accent bg-accent/10 text-white'
                      : 'border-base-border bg-base-900 text-slate-300 hover:border-accent/30 hover:bg-base-900/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{tool.name}</span>
                    <StatusPill>{tool.status}</StatusPill>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{tool.description}</p>
                </button>
              ))}
            </div>
          </aside>

          <section className="space-y-6">
            <div className="card p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">Selected tool</h2>
                  <p className="mt-3 text-lg font-semibold text-white">{selectedTool}</p>
                  <p className="mt-2 text-sm text-slate-400">
                    {portfolioTools.find((tool) => tool.name === selectedTool)?.description}
                  </p>
                </div>
                <button className="btn-outline w-full sm:w-auto">Run tool</button>
              </div>
            </div>

            <div className="card p-5 sm:p-6 overflow-x-auto">
              <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">Open positions</h2>
              <table className="mt-4 w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-500 uppercase tracking-wide">
                    <th className="pb-3 font-medium">Market</th>
                    <th className="pb-3 font-medium">Size</th>
                    <th className="pb-3 font-medium">Entry</th>
                    <th className="pb-3 font-medium">Mark</th>
                    <th className="pb-3 font-medium">PnL</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioPositions.map((position) => (
                    <tr key={position.symbol} className="border-t border-base-border table-row-hover">
                      <td className="py-3.5 font-semibold text-white">{position.symbol}</td>
                      <td className="py-3.5 text-slate-300">{position.size}</td>
                      <td className="py-3.5 text-slate-400">{position.entry}</td>
                      <td className="py-3.5 text-slate-400">{position.mark}</td>
                      <td className={`py-3.5 font-mono ${position.pnl.startsWith('+') ? 'text-up' : 'text-down'}`}>
                        {position.pnl}
                      </td>
                      <td className="py-3.5">
                        <StatusPill>{position.status}</StatusPill>
                      </td>
                      <td className="py-3.5 text-right">
                        <MarginBar pct={position.symbol === 'BTC/USDT' ? 80 : 45} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
