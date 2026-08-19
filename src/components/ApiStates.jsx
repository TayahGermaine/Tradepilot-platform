export function LoadingState({ label = 'Loading data…' }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-base-600 border-t-accent" />
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3 max-w-sm text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-down/10 border border-down/20">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-down">
            <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Failed to load data</p>
          <p className="mt-1 text-sm text-slate-500">{message}</p>
        </div>
        {onRetry && (
          <button onClick={onRetry} className="btn-outline mt-2 text-xs">
            Try again
          </button>
        )}
      </div>
    </div>
  )
}

export function EmptyState({ label = 'No data available yet' }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-base-800 border border-base-border">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-slate-600">
            <path d="M3 3v18h18M9 17V9M15 17v-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  )
}
