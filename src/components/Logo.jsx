import { Link } from 'react-router-dom'

export default function Logo({ to = '/' }) {
  return (
    <Link to={to} className="flex items-center gap-2 shrink-0">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white font-extrabold text-sm">
        T
      </span>
      <span className="text-lg font-extrabold tracking-tight text-white">
        TRADE PILOT<span className="text-accent">$</span>
      </span>
    </Link>
  )
}
