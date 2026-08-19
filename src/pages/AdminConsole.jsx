import { useState } from 'react'
import AppNav from '../components/AppNav.jsx'
import { StatCard, StatusPill, HealthBar } from '../components/DashboardBits.jsx'
import { useApi } from '../hooks/useApi.js'
import { adminApi } from '../services/adminApi.js'
import { LoadingState, ErrorState, EmptyState } from '../components/ApiStates.jsx'
import { useNotifications } from '../hooks/useNotifications.jsx'

export default function AdminConsole() {
  const { data: stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useApi(adminApi.getStats)
  const { data: withdrawals, loading: wdLoading, error: wdError, refetch: refetchWithdrawals } = useApi(adminApi.getWithdrawals)
  const { data: health, loading: healthLoading, refetch: refetchHealth } = useApi(adminApi.getSystemHealth)
  const { data: users, loading: usersLoading, refetch: refetchUsers } = useApi(adminApi.getUsers)
  const { data: kycQueue, loading: kycLoading, refetch: refetchKyc } = useApi(adminApi.getKycQueue)
  const [busy, setBusy] = useState(null)
  const { push } = useNotifications()

  const statsList = stats || []
  const withdrawalList = withdrawals || []
  const healthList = health || []
  const userList = users || []
  const kycList = kycQueue || []

  async function decideWithdrawal(ref, decision) {
    setBusy(ref)
    try {
      if (decision === 'approved') {
        await adminApi.approveWithdrawal(ref)
        push('Withdrawal approved', `${ref} has been approved`, 'up')
      } else {
        await adminApi.holdWithdrawal(ref)
        push('Withdrawal on hold', `${ref} has been put on hold`, 'warn')
      }
      refetchWithdrawals()
      refetchStats()
    } catch (err) {
      push('Action failed', err.message, 'down')
    } finally {
      setBusy(null)
    }
  }

  async function decideKyc(userId, decision) {
    setBusy(userId)
    try {
      if (decision === 'approved') {
        await adminApi.approveKyc(userId)
        push('KYC approved', 'User identity verification approved', 'up')
      } else {
        await adminApi.rejectKyc(userId)
        push('KYC rejected', 'User identity verification rejected', 'down')
      }
      refetchKyc()
    } catch (err) {
      push('Action failed', err.message, 'down')
    } finally {
      setBusy(null)
    }
  }

  const hasError = statsError || wdError

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
            <span className="h-1.5 w-1.5 rounded-full bg-up pulse-dot" />
            ALL SYSTEMS OPERATIONAL
          </span>
        </div>

        {hasError ? (
          <ErrorState
            message={statsError || wdError}
            onRetry={() => { refetchStats(); refetchWithdrawals() }}
          />
        ) : (
          <>
            {statsLoading ? (
              <LoadingState label="Loading admin stats…" />
            ) : (
              <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statsList.length > 0 ? statsList.map((s) => (
                  <StatCard key={s.label} {...s} />
                )) : (
                  <div className="col-span-full card p-6">
                    <EmptyState label="Platform stats will appear here once your backend is connected" />
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">
              {/* Withdrawals */}
              <div className="card p-5 sm:p-6 overflow-x-auto">
                <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">Withdrawal approvals</h2>
                {wdLoading ? (
                  <LoadingState label="Loading withdrawals…" />
                ) : withdrawalList.length > 0 ? (
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
                      {withdrawalList.map((w) => (
                        <tr key={w._id || w.ref} className="border-t border-base-border table-row-hover">
                          <td className="py-3.5 font-mono text-slate-400">{w._id || w.ref}</td>
                          <td className="py-3.5 font-semibold text-white">{w.client}</td>
                          <td className="py-3.5 font-mono text-slate-300">{w.amount}</td>
                          <td className="py-3.5 text-slate-400">{w.rail}</td>
                          <td className="py-3.5"><StatusPill>{w.risk}</StatusPill></td>
                          <td className="py-3.5">
                            {w.decision ? (
                              <p className={`text-right text-xs font-semibold ${w.decision === 'approved' ? 'text-up' : 'text-slate-400'}`}>
                                {w.decision === 'approved' ? 'Approved' : 'On hold'}
                              </p>
                            ) : (
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => decideWithdrawal(w._id || w.ref, 'approved')}
                                  disabled={busy === (w._id || w.ref)}
                                  className="rounded-md bg-up/10 border border-up/25 text-up text-xs font-semibold px-3 py-1.5 hover:bg-up/20 disabled:opacity-50"
                                >
                                  {busy === (w._id || w.ref) ? '…' : 'Approve'}
                                </button>
                                <button
                                  onClick={() => decideWithdrawal(w._id || w.ref, 'hold')}
                                  disabled={busy === (w._id || w.ref)}
                                  className="rounded-md border border-base-600 text-slate-300 text-xs font-semibold px-3 py-1.5 hover:bg-white/5 disabled:opacity-50"
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
                ) : (
                  <EmptyState label="No withdrawals awaiting approval" />
                )}
              </div>

              {/* System health */}
              <div className="card p-5 sm:p-6">
                <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">System health</h2>
                {healthLoading ? (
                  <LoadingState label="Loading health…" />
                ) : healthList.length > 0 ? (
                  <div className="mt-4 space-y-5">
                    {healthList.map((h) => (
                      <div key={h._id || h.label}>
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
                ) : (
                  <EmptyState label="Health data will appear here" />
                )}
              </div>
            </div>

            {/* KYC queue */}
            <div className="mt-6 card p-5 sm:p-6 overflow-x-auto">
              <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">KYC verification queue</h2>
              {kycLoading ? (
                <LoadingState label="Loading KYC queue…" />
              ) : kycList.length > 0 ? (
                <table className="mt-4 w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-500 uppercase tracking-wide">
                      <th className="pb-3 font-medium">User</th>
                      <th className="pb-3 font-medium">ID type</th>
                      <th className="pb-3 font-medium">Submitted</th>
                      <th className="pb-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kycList.map((u) => (
                      <tr key={u._id || u.userId} className="border-t border-base-border table-row-hover">
                        <td className="py-3.5 font-semibold text-white">{u.name}</td>
                        <td className="py-3.5 text-slate-400 capitalize">{u.idType?.replace('_', ' ') || '—'}</td>
                        <td className="py-3.5 text-slate-400">{u.submittedAt || '—'}</td>
                        <td className="py-3.5">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => decideKyc(u._id || u.userId, 'approved')}
                              disabled={busy === (u._id || u.userId)}
                              className="rounded-md bg-up/10 border border-up/25 text-up text-xs font-semibold px-3 py-1.5 hover:bg-up/20 disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => decideKyc(u._id || u.userId, 'rejected')}
                              disabled={busy === (u._id || u.userId)}
                              className="rounded-md border border-base-600 text-slate-300 text-xs font-semibold px-3 py-1.5 hover:bg-white/5 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <EmptyState label="No pending KYC applications" />
              )}
            </div>

            {/* Users & roles */}
            <div className="mt-6 card p-5 sm:p-6 overflow-x-auto">
              <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">Users &amp; roles</h2>
              {usersLoading ? (
                <LoadingState label="Loading users…" />
              ) : userList.length > 0 ? (
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
                    {userList.map((u) => (
                      <tr key={u._id || u.name} className="border-t border-base-border table-row-hover">
                        <td className="py-3.5 font-semibold text-white">{u.name}</td>
                        <td className="py-3.5"><StatusPill>{u.role}</StatusPill></td>
                        <td className="py-3.5 text-accent">{u.broker}</td>
                        <td className="py-3.5"><StatusPill>{u.kyc}</StatusPill></td>
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
              ) : (
                <EmptyState label="No users found" />
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
