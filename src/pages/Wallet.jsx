import { useState } from 'react'
import AppNav from '../components/AppNav.jsx'
import { StatCard, MarginBar, StatusPill } from '../components/DashboardBits.jsx'
import { walletStats, walletHoldings, recentTransactions } from '../data/mockData.js'
import { useLiveMarkets, formatPrice } from '../hooks/useLiveMarkets.js'
import WalletModal from '../components/WalletModal.jsx'
import { useNotifications } from '../hooks/useNotifications.jsx'

const PRICE_MAP = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  USDT: null,
}

export default function Wallet() {
  const { data: livePrices } = useLiveMarkets()
  const [modalMode, setModalMode] = useState(null)
  const [txs, setTxs] = useState(recentTransactions)
  const { push } = useNotifications()

  const livePriceFor = (symbol) => {
    const coinId = PRICE_MAP[symbol]
    if (!coinId) return null
    const coin = livePrices.find((c) => c.id === coinId)
    return coin ? coin.price : null
  }

  const holdingsWithValue = walletHoldings.map((h) => {
    const live = livePriceFor(h.asset)
    if (live && h.asset !== 'USDT') {
      const amount = parseFloat(h.amount.split(' ')[0])
      return { ...h, value: `$${(amount * live).toLocaleString('en-US', { maximumFractionDigits: 2 })}`, livePrice: live }
    }
    return { ...h, livePrice: null }
  })

  const totalValue = holdingsWithValue.reduce((sum, h) => {
    const val = parseFloat(h.value.replace(/[$,]/g, ''))
    return sum + val
  }, 0)

  function handleModalClose() {
    setModalMode(null)
  }

  function handleModalSubmit(action) {
    const newTx = {
      id: `TX-${Math.floor(Math.random() * 9000) + 1000}`,
      action: action === 'deposit' ? 'Deposit' : 'Withdrawal',
      asset: 'USDT',
      amount: '$1,000.00',
      when: 'Just now',
    }
    setTxs((prev) => [newTx, ...prev])
  }

  return (
    <div className="min-h-screen bg-base-950">
      <AppNav />

      <main className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Wallet</h1>
            <p className="mt-1 text-sm text-slate-400">
              Overview of balances, collateral, transfers and recent wallet activity.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="card px-4 py-2 text-sm text-slate-400 whitespace-nowrap">
              Total value <span className="font-semibold text-white font-mono">${totalValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={() => setModalMode('deposit')} className="btn-primary">
            Deposit
          </button>
          <button onClick={() => setModalMode('withdraw')} className="btn-outline">
            Withdraw
          </button>
          <a href="/markets" className="btn-ghost">Trade</a>
        </div>

        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {walletStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
          <div className="card p-5 sm:p-6 overflow-x-auto">
            <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">Holdings</h2>
            <table className="mt-4 w-full min-w-[640px] text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 uppercase tracking-wide">
                  <th className="pb-3 font-medium">Asset</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Value</th>
                  <th className="pb-3 font-medium hidden sm:table-cell">Live price</th>
                  <th className="pb-3 font-medium">Allocation</th>
                  <th className="pb-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {holdingsWithValue.map((holding) => (
                  <tr key={holding.asset} className="border-t border-base-border table-row-hover">
                    <td className="py-3.5 font-semibold text-white">{holding.asset}</td>
                    <td className="py-3.5 font-mono text-slate-300">{holding.amount}</td>
                    <td className="py-3.5 text-slate-200 font-mono">{holding.value}</td>
                    <td className="py-3.5 hidden sm:table-cell font-mono text-slate-400">
                      {holding.livePrice ? formatPrice(holding.livePrice) : '—'}
                    </td>
                    <td className="py-3.5">
                      <MarginBar pct={holding.allocation} />
                    </td>
                    <td className="py-3.5 text-right">
                      <StatusPill>{holding.status}</StatusPill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card p-5 sm:p-6">
            <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">Recent transactions</h2>
            <div className="mt-4 space-y-3">
              {txs.map((tx) => (
                <div key={tx.id} className="rounded-lg border border-base-border bg-base-900 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{tx.id}</span>
                    <span>{tx.when}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-4 text-sm text-slate-100">
                    <div>
                      <p className="font-semibold">{tx.action}</p>
                      <p className="text-slate-500 text-xs">{tx.asset}</p>
                    </div>
                    <p className="font-mono text-white">{tx.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <WalletModal
        open={modalMode !== null}
        mode={modalMode}
        onClose={handleModalClose}
      />
    </div>
  )
}
