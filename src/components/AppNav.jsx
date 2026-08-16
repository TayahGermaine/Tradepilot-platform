import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from './Logo.jsx'
import { ChevronDown, MenuIcon, CloseIcon, ShieldIcon } from './Icons.jsx'
import NotificationBell from './NotificationBell.jsx'
import { useAuth, getRoleDashboard } from '../hooks/useAuth.jsx'

const navLinks = [
  { label: 'Terminal', to: '/terminal' },
  { label: 'Markets', to: '/markets' },
  { label: 'Analysis', to: '/analysis' },
  { label: 'News', to: '/news' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Wallet', to: '/wallet' },
  { label: 'AI Console', to: '/ai' },
  { label: 'KYC', to: '/kyc' },
]

const portalLinks = [
  { label: 'Client', to: '/dashboard' },
  { label: 'Broker', to: '/broker' },
  { label: 'Admin', to: '/admin' },
]

export default function AppNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  const initials = user?.name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?'
  const displayName = user?.name || 'Guest'
  const displayRole = user ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Not signed in'
  const dashboardPath = user ? getRoleDashboard(user.role) : '/login'

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-base-border bg-base-950/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1700px] items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Logo to="/" />

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.to} className="btn-ghost">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <span className="hidden md:inline-flex pill bg-violet-soft text-violet-300 border border-violet-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 pulse-dot" />
            AI ASSISTANT LIVE
          </span>

          <div className="hidden md:flex items-center gap-1 border-l border-base-border pl-3">
            {portalLinks.map((p) => (
              <Link
                key={p.to}
                to={p.to}
                className={
                  location.pathname === p.to
                    ? 'rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent'
                    : 'rounded-md px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-slate-200'
                }
              >
                {p.label}
              </Link>
            ))}
          </div>

          <Link
            to="/kyc"
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-warn/20 bg-warn/10 px-3 py-1.5 text-xs font-semibold text-warn hover:bg-warn/15 transition-colors"
          >
            <ShieldIcon className="h-3.5 w-3.5" />
            VERIFY KYC
          </Link>

          <NotificationBell />

          <Link to={dashboardPath} className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-white/5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 border border-accent/30 text-sm font-bold text-accent">
              {initials}
            </span>
            <span className="hidden sm:block text-left leading-tight">
              <span className="block text-sm font-semibold text-white">{displayName}</span>
              <span className="flex items-center gap-1 text-[11px] text-up">
                <span className="h-1.5 w-1.5 rounded-full bg-up" />
                {displayRole} · 2FA Active
              </span>
            </span>
            <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-slate-500" />
          </Link>

          {user && (
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center rounded-lg border border-base-600 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-down hover:border-down/30 transition-colors"
            >
              LOG OUT
            </button>
          )}

          <button
            onClick={() => setOpen((v) => !v)}
            className="flex lg:hidden h-9 w-9 items-center justify-center rounded-lg border border-base-border text-slate-300"
          >
            {open ? <CloseIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-base-border bg-base-950 px-4 py-3">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-left rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 flex flex-col gap-1 border-t border-base-border pt-3">
            <Link to="/kyc" className="rounded-md px-3 py-2 text-sm font-semibold text-warn hover:bg-white/5">
              Verify KYC
            </Link>
            {portalLinks.map((p) => (
              <Link key={p.to} to={p.to} className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5">
                {p.label}
              </Link>
            ))}
            {user && (
              <button onClick={handleLogout} className="text-left rounded-md px-3 py-2 text-sm font-semibold text-down hover:bg-white/5">
                Log out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
