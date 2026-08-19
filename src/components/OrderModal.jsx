import { useState } from 'react'
import { CloseIcon } from './Icons.jsx'
import { useNotifications } from '../hooks/useNotifications.jsx'
import { formatPrice } from '../hooks/useLiveMarkets.js'
import { clientApi } from '../services/clientApi.js'

export default function OrderModal({ open, onClose, market }) {
  const { push } = useNotifications()
  const [orderType, setOrderType] = useState('limit')
  const [side, setSide] = useState('buy')
  const [size, setSize] = useState('')
  const [price, setPrice] = useState('')
  const [placed, setPlaced] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  if (!open) return null

  const ref = market?.pair || '—'
  const currentPrice = market?.price || 0

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await clientApi.placeOrder({
        pair: ref,
        side,
        type: orderType,
        size: parseFloat(size || '0'),
        price: orderType === 'market' ? undefined : parseFloat(price || currentPrice),
      })
      setPlaced(true)
      push(
        `${side === 'buy' ? 'Buy' : 'Sell'} order placed`,
        `${size || '0'} ${ref.split('/')[0]} @ ${orderType === 'market' ? formatPrice(currentPrice) : price || formatPrice(currentPrice)}`,
        side === 'buy' ? 'up' : 'warn'
      )
      setTimeout(() => {
        setPlaced(false)
        setSize('')
        setPrice('')
        onClose()
      }, 1500)
    } catch (err) {
      setError(err.message || 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-base-border bg-base-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Place order</h2>
            <p className="text-sm text-slate-500">{ref} · Last {formatPrice(currentPrice)}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSide('buy')}
              className={`rounded-lg py-2.5 text-sm font-bold transition-colors ${
                side === 'buy' ? 'bg-up text-base-950' : 'bg-base-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              BUY
            </button>
            <button
              type="button"
              onClick={() => setSide('sell')}
              className={`rounded-lg py-2.5 text-sm font-bold transition-colors ${
                side === 'sell' ? 'bg-down text-white' : 'bg-base-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              SELL
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {['limit', 'market', 'stop'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setOrderType(t)}
                className={`rounded-lg border py-2 text-sm font-semibold capitalize transition-colors ${
                  orderType === t
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-base-border text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div>
            <label className="label-eyebrow">Size ({ref.split('/')[0]})</label>
            <input
              type="number"
              step="0.0001"
              min="0"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="input-field mt-1.5"
              placeholder="0.00"
              required
            />
          </div>

          {orderType !== 'market' && (
            <div>
              <label className="label-eyebrow">Price (USD)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="input-field mt-1.5"
                placeholder={currentPrice.toString()}
              />
            </div>
          )}

          <div className="rounded-lg border border-base-border bg-base-950 p-3 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Est. total</span>
              <span className="font-mono text-white">
                {(parseFloat(size || 0) * (orderType === 'market' ? currentPrice : parseFloat(price || currentPrice))).toLocaleString('en-US', { maximumFractionDigits: 2, style: 'currency', currency: 'USD' })}
              </span>
            </div>
          </div>

          {error && (
            <p className="text-sm text-down">{error}</p>
          )}

          <button
            type="submit"
            disabled={placed || submitting}
            className={`w-full rounded-lg py-3 text-sm font-bold transition-colors disabled:opacity-60 ${
              side === 'buy' ? 'bg-up text-base-950 hover:brightness-110' : 'bg-down text-white hover:brightness-110'
            }`}
          >
            {placed ? 'Order placed' : submitting ? 'Placing order…' : `${side === 'buy' ? 'BUY' : 'SELL'} ${ref.split('/')[0]}`}
          </button>
        </form>
      </div>
    </div>
  )
}
