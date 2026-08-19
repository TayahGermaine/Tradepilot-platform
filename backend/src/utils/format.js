// The frontend was built against mock data where numeric values are already
// formatted as display strings (e.g. "$42,892.40", "+2.1% (7d)"). These
// helpers reproduce that formatting server-side so real Mongo-backed data
// renders in existing components without any frontend changes.

export function money(n, { sign = false } = {}) {
  const num = Number(n) || 0
  const abs = Math.abs(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const prefix = sign ? (num >= 0 ? '+$' : '-$') : (num < 0 ? '-$' : '$')
  return `${prefix}${abs}`
}

export function pct(n, { sign = true } = {}) {
  const num = Number(n) || 0
  const str = Math.abs(num).toFixed(2)
  if (!sign) return `${str}%`
  return `${num >= 0 ? '+' : '-'}${str}%`
}

export function tone(n) {
  const num = Number(n) || 0
  if (num > 0) return 'up'
  if (num < 0) return 'down'
  return 'neutral'
}

export function asset(amount, symbol, decimals = 4) {
  const num = Number(amount) || 0
  // Trim trailing zeros but keep at least 2 decimal places, e.g. 1.5000 -> 1.5, 1.0000 -> 1.
  let str = num.toFixed(decimals)
  if (str.includes('.')) {
    str = str.replace(/0+$/, '').replace(/\.$/, '')
  }
  return `${str} ${symbol}`
}

export function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  return `${Math.floor(hr / 24)}d ago`
}
