import { useState } from 'react'
import AppNav from '../components/AppNav.jsx'
import { StatCard, StatusPill, MarginBar } from '../components/DashboardBits.jsx'
import { useApi } from '../hooks/useApi.js'
import { clientApi } from '../services/clientApi.js'
import { useLiveMarkets, formatPrice } from '../hooks/useLiveMarkets.js'
import Sparkline from '../components/Sparkline.jsx'
import OrderModal from '../components/OrderModal.jsx'
import WalletModal from '../components/WalletModal.jsx'
import { LoadingState, ErrorState, EmptyState } from '../components/ApiStates.jsx'
import { useNotifications } from '../hooks/useNotifications.jsx'

export default function ClientDashboard() {
  const { data: portfolio, loading: portfolioLoading, error: portfolioError, refetch: refetchPortfolio } = useApi(clientApi.getPortfolio)
  const { data: positions, loading: positionsLoading, error: positionsError, refetch: refetchPositions } = useApi(clientApi.getPositions)
  const { data: wallet, loading: walletLoading, error: walletError, refetch: refetchWallet } = useApi(clientApi.getWallet)
  const { data: kyc, loading: kycLoading } = useApi(clientApi.getKycStatus)
  const { data: liveMarkets, loading: marketsLoading } = useLiveMarkets()
  const [orderOpen, setOrderOpen] = useState(false)
  const [selectedMarket, setSelectedMarket] = useState(null)
  const [walletModalMode, setWalletModalMode] = useState(null)
  const { push } = useNotifications()

  const stats = portfolio || []
  const positionsList = positions || []
  const walletData = wallet || { holdings: [], balance: 0 }

  const kycStatus = kyc?.status || 'unverified'

  function openOrder(market) {
    setSelectedMarket(market)
    setOrderOpen(true)
  }

  const hasError = portfolioError || positionsError || walletError

  return (
    <div className="min-h-screen bg-base-950">
      <AppNav />

      <main className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Client Dashboard</h1>
            <p className="mt-1 text-sm text-slate-400">
              Your trading overview — portfolio, live positions, wallet and market access.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {kycLoading ? null : (
              <span className={`pill border whitespace-nowrap ${
                kycStatus === 'verified' ? 'bg-up/10 text-up border-up/20' :
                kycStatus === 'pending' ? 'bg-warn/10 text-warn border-warn/20' :
                kycStatus === 'rejected' ? 'bg-down/10 text-down border-down/20' :
                'bg-base-800 text-slate-400 border-base-border'
              }`}>
                KYC: {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
              </span>
            )}
            <span className="pill border border-up/20 bg-up/10 text-up whitespace-nowrap">
              <span className="h-1.5 w-1.5 rounded-full bg-up pulse-dot" />
              {marketsLoading ? 'CONNECTING' : 'LIVE'}
            </span>
          </div>
        </div>

        {hasError ? (
          <ErrorState
            message={portfolioError || positionsError || walletError}
            onRetry={() => { refetchPortfolio(); refetchPositions(); refetchWallet() }}
          />
        ) : (
          <>
            {/* Stats row */}
            {portfolioLoading ? (
              <LoadingState label="Loading portfolio…" />
            ) : (
              <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.length > 0 ? stats.map((s) => (
                  <StatCard key={s.label} {...s} />
                )) : (
                  <div className="col-span-full card p-6">
                    <EmptyState label="Portfolio data will appear here once your backend is connected" />
                  </div>
                )}
              </div>
            )}

            {/* Live market strip */}
            <div className="mt-6 card p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">Live markets</h2>
                <button
                  onClick={() => openOrder(liveMarkets?.[0])}
                  className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-hover transition-colors"
                >
                  PLACE ORDER
                </button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {marketsLoading ? (
                  [0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 rounded-xl border border-base-border bg-base-900 animate-pulse" />
                  ))
                ) : (
                  liveMarkets.map((m) => {
                    const tone = m.change >= 0 ? 'up' : 'down'
                    return (
                      <button
                        key={m.id}
                        onClick={() => openOrder(m)}
                        className="text-left rounded-xl border border-base-border bg-base-900/80 p-3 hover:border-accent/40 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm font-semibold text-white">{m.pair}</span>
                          <span className={`text-xs font-semibold ${tone === 'up' ? 'text-up' : 'text-down'}`}>
                            {m.change >= 0 ? '+' : ''}{m.change.toFixed(2)}%
                          </span>
                        </div>
                        <div className="mt-2 flex items-end justify-between">
                          <p className="text-lg font-semibold text-white">{formatPrice(m.price)}</p>
                          <Sparkline data={m.sparkline} tone={tone} width={60} height={24} />
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            {/* Positions + Wallet */}
            <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">
              <div className="card p-5 sm:p-6 overflow-x-auto">
                <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">Open positions</h2>
                {positionsLoading ? (
                  <LoadingState label="Loading positions…" />
                ) : positionsList.length > 0 ? (
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
                      {positionsList.map((p) => (
                        <tr key={p._id || p.symbol} className="border-t border-base-border table-row-hover">
                          <td className="py-3.5 font-semibold text-white">{p.symbol}</td>
                          <td className="py-3.5 text-slate-300">{p.size}</td>
                          <td className="py-3.5 text-slate-400">{p.entry}</td>
                          <td className="py-3.5 text-slate-400">{p.mark}</td>
                          <td className={`py-3.5 font-mono ${p.pnl?.startsWith('+') ? 'text-up' : 'text-down'}`}>
                            {p.pnl}
                          </td>
                          <td className="py-3.5"><StatusPill>{p.status}</StatusPill></td>
                          <td className="py-3.5 text-right"><MarginBar pct={p.riskPct || 45} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <EmptyState label="No open positions. Place an order to get started." />
                )}
              </div>

              <div className="card p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">Wallet</h2>
                  <div className="flex gap-2">
                    <button onClick={() => setWalletModalMode('deposit')} className="rounded-md bg-accent/10 border border-accent/30 text-accent text-xs font-semibold px-2.5 py-1.5 hover:bg-accent/20">
                      Deposit
                    </button>
                    <button onClick={() => setWalletModalMode('withdraw')} className="rounded-md border border-base-600 text-slate-300 text-xs font-semibold px-2.5 py-1.5 hover:bg-white/5">
                      Withdraw
                    </button>
                  </div>
                </div>
                {walletLoading ? (
                  <LoadingState label="Loading wallet…" />
                ) : (
                  <>
                    <div className="mt-4 rounded-xl border border-base-border bg-base-900 p-4">
                      <p className="text-xs text-slate-500">Total balance</p>
                      <p className="mt-1 font-mono text-2xl font-bold text-white">
                        {walletData.balance ? `$${walletData.balance.toLocaleString('en-US', { maximumFractionDigits: 2 })}` : '$0.00'}
                      </p>
                    </div>
                    <div className="mt-4 space-y-2">
                      {(walletData.holdings || []).length > 0 ? (
                        walletData.holdings.map((h) => (
                          <div key={h.asset} className="flex items-center justify-between rounded-lg border border-base-border bg-base-900 p-3 text-sm">
                            <span className="font-semibold text-white">{h.asset}</span>
                            <span className="font-mono text-slate-300">{h.amount}</span>
                            <span className="text-slate-400">{h.value}</span>
                          </div>
                        ))
                      ) : (
                        <EmptyState label="No holdings yet" />
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} market={selectedMarket} />
      <WalletModal open={walletModalMode !== null} mode={walletModalMode} onClose={() => setWalletModalMode(null)} />
    </div>
  )
}
