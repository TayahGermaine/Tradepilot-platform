import { useState } from 'react'
import AppNav from '../components/AppNav.jsx'
import { StatCard, StatusPill, MarginBar } from '../components/DashboardBits.jsx'
import { brokerDesk, brokerStats, clientBook, brokerRequests } from '../data/mockData.js'

export default function BrokerPortal() {
  const [requests, setRequests] = useState(
    brokerRequests.map((r) => ({ ...r, decision: null }))
  )

  function decide(id, decision) {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, decision } : r)))
  }

  return (
    <div className="min-h-screen bg-base-950">
      <AppNav />

      <main className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Broker Portal</h1>
            <p className="mt-1 text-sm text-slate-400">
              Your assigned client book, live margin health and the requests waiting on your decision.
            </p>
          </div>
          <div className="card px-4 py-2 text-sm text-slate-400 whitespace-nowrap">
            Desk <span className="font-semibold text-white">{brokerDesk.broker}</span> · {brokerDesk.region}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {brokerStats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">
          <div className="card p-5 sm:p-6 overflow-x-auto">
            <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">Client book</h2>
            <table className="mt-4 w-full min-w-[560px] text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 uppercase tracking-wide">
                  <th className="pb-3 font-medium">Client</th>
                  <th className="pb-3 font-medium">Equity</th>
                  <th className="pb-3 font-medium">Margin used</th>
                  <th className="pb-3 font-medium">Open PnL</th>
                  <th className="pb-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {clientBook.map((c) => (
                  <tr key={c.name} className="border-t border-base-border table-row-hover">
                    <td className="py-3.5 font-semibold text-white">{c.name}</td>
                    <td className="py-3.5 font-mono text-slate-300">{c.equity}</td>
                    <td className="py-3.5">
                      <MarginBar pct={c.margin} />
                    </td>
                    <td className={`py-3.5 font-mono ${c.pnlTone === 'up' ? 'text-up' : 'text-down'}`}>
                      {c.pnl}
                    </td>
                    <td className="py-3.5 text-right">
                      <StatusPill>{c.status}</StatusPill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card p-5 sm:p-6">
            <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">Requests awaiting review</h2>
            <div className="mt-4 space-y-3">
              {requests.map((r) => (
                <div key={r.id} className="rounded-lg border border-base-border bg-base-900 p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500">{r.id}</span>
                    <span className="font-semibold text-white">{r.client}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{r.detail}</p>

                  {r.decision ? (
                    <p
                      className={`mt-3 text-xs font-semibold ${
                        r.decision === 'approved' ? 'text-up' : 'text-down'
                      }`}
                    >
                      {r.decision === 'approved' ? 'Approved' : 'Declined'}
                    </p>
                  ) : (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => decide(r.id, 'approved')}
                        className="rounded-md bg-accent/10 border border-accent/30 text-accent text-xs font-semibold py-2 hover:bg-accent/20"
                      >
                        APPROVE
                      </button>
                      <button
                        onClick={() => decide(r.id, 'declined')}
                        className="rounded-md border border-base-600 text-slate-300 text-xs font-semibold py-2 hover:bg-white/5"
                      >
                        DECLINE
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
