import { useState } from 'react'
import AppNav from '../components/AppNav.jsx'
import { StatCard, StatusPill, HealthBar } from '../components/DashboardBits.jsx'
import { adminStats, withdrawalApprovals, systemHealth, usersAndRoles } from '../data/mockData.js'

export default function AdminConsole() {
  const [withdrawals, setWithdrawals] = useState(
    withdrawalApprovals.map((w) => ({ ...w, decision: null }))
  )

  function decide(ref, decision) {
    setWithdrawals((prev) => prev.map((w) => (w.ref === ref ? { ...w, decision } : w)))
  }

  return (
    <div className="min-h-screen bg-base-950">
      <AppNav />

      <main className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Admin Console</h1>
            <p className="mt-1 text-sm text-slate-400">
              Platform oversight across clients, brokers, compliance queues and venue infrastructure.
            </p>
          </div>
          <span className="pill bg-up/10 text-up border border-up/20 whitespace-nowrap">
            <span className="h-1.5 w-1.5 rounded-full bg-up" />
            ALL SYSTEMS OPERATIONAL
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {adminStats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">
          <div className="card p-5 sm:p-6 overflow-x-auto">
            <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">Withdrawal approvals</h2>
            <table className="mt-4 w-full min-w-[600px] text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 uppercase tracking-wide">
                  <th className="pb-3 font-medium">Reference</th>
                  <th className="pb-3 font-medium">Client</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Rail</th>
                  <th className="pb-3 font-medium">Risk</th>
                  <th className="pb-3 font-medium text-right">Decision</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w.ref} className="border-t border-base-border table-row-hover">
                    <td className="py-3.5 font-mono text-slate-400">{w.ref}</td>
                    <td className="py-3.5 font-semibold text-white">{w.client}</td>
                    <td className="py-3.5 font-mono text-slate-300">{w.amount}</td>
                    <td className="py-3.5 text-slate-400">{w.rail}</td>
                    <td className="py-3.5">
                      <StatusPill>{w.risk}</StatusPill>
                    </td>
                    <td className="py-3.5">
                      {w.decision ? (
                        <p
                          className={`text-right text-xs font-semibold ${
                            w.decision === 'approved' ? 'text-up' : 'text-slate-400'
                          }`}
                        >
                          {w.decision === 'approved' ? 'Approved' : 'On hold'}
                        </p>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => decide(w.ref, 'approved')}
                            className="rounded-md bg-up/10 border border-up/25 text-up text-xs font-semibold px-3 py-1.5 hover:bg-up/20"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => decide(w.ref, 'hold')}
                            className="rounded-md border border-base-600 text-slate-300 text-xs font-semibold px-3 py-1.5 hover:bg-white/5"
                          >
                            Hold
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card p-5 sm:p-6">
            <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">System health</h2>
            <div className="mt-4 space-y-5">
              {systemHealth.map((h) => (
                <div key={h.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{h.label}</span>
                    <span className={`font-mono text-xs ${h.tone === 'warn' ? 'text-warn' : 'text-up'}`}>
                      {h.value}
                    </span>
                  </div>
                  <HealthBar pct={h.pct} tone={h.tone} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 card p-5 sm:p-6 overflow-x-auto">
          <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">Users &amp; roles</h2>
          <table className="mt-4 w-full min-w-[680px] text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 uppercase tracking-wide">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Assigned broker</th>
                <th className="pb-3 font-medium">KYC</th>
                <th className="pb-3 font-medium">Equity</th>
                <th className="pb-3 font-medium text-right">Manage</th>
              </tr>
            </thead>
            <tbody>
              {usersAndRoles.map((u) => (
                <tr key={u.name} className="border-t border-base-border table-row-hover">
                  <td className="py-3.5 font-semibold text-white">{u.name}</td>
                  <td className="py-3.5">
                    <StatusPill>{u.role}</StatusPill>
                  </td>
                  <td className="py-3.5 text-accent">{u.broker}</td>
                  <td className="py-3.5">
                    <StatusPill>{u.kyc}</StatusPill>
                  </td>
                  <td className="py-3.5 font-mono text-slate-300">{u.equity}</td>
                  <td className="py-3.5 text-right">
                    <button className="rounded-md border border-base-600 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/5">
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
