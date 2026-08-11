import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo.jsx'
import { BellIcon, ChevronDown, MenuIcon, CloseIcon } from './Icons.jsx'
import { currentUser } from '../data/mockData.js'

const navLinks = [
  { label: 'Terminal', to: '/terminal' },
  { label: 'Markets', to: '/markets' },
  { label: 'Analysis', to: '/analysis' },
  { label: 'News', to: '/news' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Wallet', to: '/wallet' },
  { label: 'AI Insights', to: '/ai' },
]

const portalLinks = [
  { label: 'Client Portal', to: '/login' },
  { label: 'Broker Portal', to: '/broker' },
  { label: 'Admin Console', to: '/admin' },
]

export default function AppNav() {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-base-border bg-base-950/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1700px] items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Logo to="/" />

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) =>
            link.to ? (
              <Link key={link.label} to={link.to} className="btn-ghost">
                {link.label}
              </Link>
            ) : (
              <button key={link.label} className="btn-ghost">
                {link.label}
              </button>
            )
          )}
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

          <button className="relative hidden sm:flex h-9 w-9 items-center justify-center rounded-lg border border-base-border text-slate-400 hover:text-white hover:border-slate-500">
            <BellIcon className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-down ring-2 ring-base-950" />
          </button>

          <button className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-white/5">
            <img src={currentUser.avatar} alt={currentUser.name} className="h-8 w-8 rounded-full object-cover" />
            <span className="hidden sm:block text-left leading-tight">
              <span className="block text-sm font-semibold text-white">{currentUser.name}</span>
              <span className="flex items-center gap-1 text-[11px] text-up">
                <span className="h-1.5 w-1.5 rounded-full bg-up" />
                {currentUser.role} · 2FA Active
              </span>
            </span>
            <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-slate-500" />
          </button>

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
            {navLinks.map((link) =>
              link.to ? (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-left rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
                >
                  {link.label}
                </Link>
              ) : (
                <button key={link.label} className="text-left rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-white/5">
                  {link.label}
                </button>
              )
            )}
          </div>
          <div className="mt-3 flex flex-col gap-1 border-t border-base-border pt-3">
            {portalLinks.map((p) => (
              <Link key={p.to} to={p.to} className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5">
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
