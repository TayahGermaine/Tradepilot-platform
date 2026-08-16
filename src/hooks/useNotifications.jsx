import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const NotificationContext = createContext(null)

const SEED = [
  { id: 1, title: 'Margin alert: Tomas Halle', body: 'Margin usage hit 88% — review required.', tone: 'down', when: Date.now() - 120000, read: false },
  { id: 2, title: 'BTC breakout confirmed', body: 'AI signal: high-conviction long setup on BTC/USDT.', tone: 'up', when: Date.now() - 600000, read: false },
  { id: 3, title: 'Withdrawal pending review', body: 'WD-4401 ($2,100 USDT) flagged high risk.', tone: 'warn', when: Date.now() - 1800000, read: true },
  { id: 4, title: 'KYC verified', body: 'Your identity verification was approved.', tone: 'up', when: Date.now() - 3600000, read: true },
]

let nextId = 100

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(SEED)

  const push = useCallback((title, body, tone = 'neutral') => {
    const n = { id: nextId++, title, body, tone, when: Date.now(), read: false }
    setNotifications((prev) => [n, ...prev].slice(0, 30))
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const clear = useCallback(() => setNotifications([]), [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider value={{ notifications, push, markAllRead, clear, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}

export function timeAgo(ts) {
  const diff = Date.now() - ts
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  return `${Math.floor(hr / 24)}d ago`
}
