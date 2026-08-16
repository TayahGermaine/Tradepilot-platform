import { useState } from 'react'
import AppNav from '../components/AppNav.jsx'
import { StatCard, StatusPill, MarginBar } from '../components/DashboardBits.jsx'
import { useApi } from '../hooks/useApi.js'
import { brokerApi } from '../services/brokerApi.js'
import { LoadingState, ErrorState, EmptyState } from '../components/ApiStates.jsx'
import { useNotifications } from '../hooks/useNotifications.jsx'

export default function BrokerPortal() {
  const { data: profile, loading: profileLoading } = useApi(brokerApi.getProfile)
  const { data: stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useApi(brokerApi.getStats)
  const { data: clients, loading: clientsLoading, error: clientsError, refetch: refetchClients } = useApi(brokerApi.getClientBook)
  const { data: requests, loading: reqLoading, error: reqError, refetch: refetchRequests } = useApi(brokerApi.getRequests)
  const [busy, setBusy] = useState(null)
  const { push } = useNotifications()

  const statsList = stats || []
  const clientList = clients || []
  const requestList = requests || []
  const broker = profile || { broker: '—', region: '—' }

  async function decide(requestId, decision) {
    setBusy(requestId)
    try {
      if (decision === 'approved') {
        await brokerApi.approveRequest(requestId)
        push('Request approved', `Request ${requestId} has been approved`, 'up')
      } else {
        await brokerApi.declineRequest(requestId)
        push('Request declined', `Request ${requestId} has been declined`, 'warn')
      }
      refetchRequests()
      refetchStats()
    } catch (err) {
      push('Action failed', err.message, 'down')
    } finally {
      setBusy(null)
    }
  }

  const hasError = statsError || clientsError || reqError

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
            {profileLoading ? 'Loading…' : <>Desk <span className="font-semibold text-white">{broker.broker}</span> · {broker.region}</>}
          </div>
        </div>

        {hasError ? (
          <ErrorState
            message={statsError || clientsError || reqError}
            onRetry={() => { refetchStats(); refetchClients(); refetchRequests() }}
          />
        ) : (
          <>
            {statsLoading ? (
              <LoadingState label="Loading broker stats…" />
            ) : (
              <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statsList.length > 0 ? statsList.map((s) => (
                  <StatCard key={s.label} {...s} />
                )) : (
                  <div className="col-span-full card p-6">
                    <EmptyState label="Broker stats will appear here once your backend is connected" />
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">
              <div className="card p-5 sm:p-6 overflow-x-auto">
                <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">Client book</h2>
                {clientsLoading ? (
                  <LoadingState label="Loading clients…" />
                ) : clientList.length > 0 ? (
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
                      {clientList.map((c) => (
                        <tr key={c._id || c.name} className="border-t border-base-border table-row-hover">
                          <td className="py-3.5 font-semibold text-white">{c.name}</td>
                          <td className="py-3.5 font-mono text-slate-300">{c.equity}</td>
                          <td className="py-3.5"><MarginBar pct={c.margin} /></td>
                          <td className={`py-3.5 font-mono ${c.pnlTone === 'up' ? 'text-up' : 'text-down'}`}>
                            {c.pnl}
                          </td>
                          <td className="py-3.5 text-right"><StatusPill>{c.status}</StatusPill></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <EmptyState label="No clients assigned yet" />
                )}
              </div>

              <div className="card p-5 sm:p-6">
                <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">Requests awaiting review</h2>
                {reqLoading ? (
                  <LoadingState label="Loading requests…" />
                ) : requestList.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {requestList.map((r) => (
                      <div key={r._id || r.id} className="rounded-lg border border-base-border bg-base-900 p-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-slate-500">{r._id || r.id}</span>
                          <span className="font-semibold text-white">{r.client}</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-300">{r.detail}</p>

                        {r.decision ? (
                          <p className={`mt-3 text-xs font-semibold ${r.decision === 'approved' ? 'text-up' : 'text-down'}`}>
                            {r.decision === 'approved' ? 'Approved' : 'Declined'}
                          </p>
                        ) : (
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <button
                              onClick={() => decide(r._id || r.id, 'approved')}
                              disabled={busy === (r._id || r.id)}
                              className="rounded-md bg-accent/10 border border-accent/30 text-accent text-xs font-semibold py-2 hover:bg-accent/20 disabled:opacity-50"
                            >
                              {busy === (r._id || r.id) ? '…' : 'APPROVE'}
                            </button>
                            <button
                              onClick={() => decide(r._id || r.id, 'declined')}
                              disabled={busy === (r._id || r.id)}
                              className="rounded-md border border-base-600 text-slate-300 text-xs font-semibold py-2 hover:bg-white/5 disabled:opacity-50"
                            >
                              {busy === (r._id || r.id) ? '…' : 'DECLINE'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState label="No pending requests" />
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
