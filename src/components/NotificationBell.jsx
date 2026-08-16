import { useState, useRef, useEffect } from 'react'
import { useNotifications, timeAgo } from '../hooks/useNotifications.jsx'
import { BellIcon, CloseIcon } from './Icons.jsx'

export default function NotificationBell() {
  const { notifications, markAllRead, clear, unreadCount } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toneColor = {
    up: 'bg-up',
    down: 'bg-down',
    warn: 'bg-warn',
    neutral: 'bg-slate-500',
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          setOpen((v) => !v)
          if (!open && unreadCount > 0) setTimeout(markAllRead, 800)
        }}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-base-border text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
        aria-label="Notifications"
      >
        <BellIcon className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-down ring-2 ring-base-950" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-base-border bg-base-900 shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-50">
          <div className="flex items-center justify-between border-b border-base-border px-4 py-3">
            <p className="text-sm font-bold text-white">Notifications</p>
            <div className="flex items-center gap-2">
              <button onClick={markAllRead} className="text-xs text-accent hover:text-accent-hover">
                Mark all read
              </button>
              <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-300">
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-500">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex gap-3 border-b border-base-border px-4 py-3 ${n.read ? '' : 'bg-accent/5'}`}
                >
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${toneColor[n.tone] || 'bg-slate-500'}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-white truncate">{n.title}</p>
                      <span className="text-[11px] text-slate-600 shrink-0">{timeAgo(n.when)}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-slate-400">{n.body}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="border-t border-base-border px-4 py-2">
              <button onClick={clear} className="text-xs text-slate-500 hover:text-slate-300">
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
