import { useState } from 'react'
import { CloseIcon } from './Icons.jsx'
import { useNotifications } from '../hooks/useNotifications.jsx'

export default function WalletModal({ open, onClose, mode = 'deposit', balance }) {
  const { push } = useNotifications()
  const [asset, setAsset] = useState('USDT')
  const [amount, setAmount] = useState('')
  const [address, setAddress] = useState('')
  const [done, setDone] = useState(false)

  if (!open) return null

  function handleSubmit(e) {
    e.preventDefault()
    setDone(true)
    push(
      `${mode === 'deposit' ? 'Deposit' : 'Withdrawal'} initiated`,
      `${amount} ${asset}${mode === 'withdraw' ? ` to ${address.slice(0, 8)}…${address.slice(-6)}` : ''}`,
      mode === 'deposit' ? 'up' : 'warn'
    )
    setTimeout(() => {
      setDone(false)
      setAmount('')
      setAddress('')
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-base-border bg-base-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white capitalize">{mode} crypto</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="label-eyebrow">Asset</label>
            <select value={asset} onChange={(e) => setAsset(e.target.value)} className="input-field mt-1.5">
              <option value="USDT">USDT</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
              <option value="SOL">SOL</option>
            </select>
          </div>

          <div>
            <label className="label-eyebrow">Amount</label>
            <input
              type="number"
              step="0.0001"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field mt-1.5"
              placeholder="0.00"
              required
            />
            {mode === 'deposit' && (
              <p className="mt-1.5 text-xs text-slate-500">Network fees are covered by TradePilot on deposits.</p>
            )}
          </div>

          {mode === 'deposit' ? (
            <div className="rounded-lg border border-base-border bg-base-950 p-4">
              <p className="text-xs text-slate-500 mb-2">Send only {asset} to this address</p>
              <p className="font-mono text-sm text-white break-all bg-base-900 p-2 rounded border border-base-border">
                {asset === 'BTC' && 'bc1qxy2k…dy7s9f4x2'}
                {asset === 'ETH' && '0x742d35Cc…6634C0'}
                {asset === 'USDT' && '0x742d35Cc…6634C0'}
                {asset === 'SOL' && '7xKXtg2C…f3RVyu'}
              </p>
            </div>
          ) : (
            <div>
              <label className="label-eyebrow">Withdrawal address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="input-field mt-1.5"
                placeholder="Enter destination wallet address"
                required
              />
              <p className="mt-1.5 text-xs text-warn">Withdrawals require 2FA confirmation and broker review.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={done}
            className={`btn-primary w-full py-3 disabled:opacity-60 ${mode === 'withdraw' ? '!bg-warn !text-base-950' : ''}`}
          >
            {done ? 'Submitted' : `${mode === 'deposit' ? 'Confirm deposit' : 'Request withdrawal'}`}
          </button>
        </form>
      </div>
    </div>
  )
}
