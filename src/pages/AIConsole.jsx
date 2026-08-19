import { useState } from 'react'
import AppNav from '../components/AppNav.jsx'
import { StatCard, StatusPill } from '../components/DashboardBits.jsx'
import { useApi } from '../hooks/useApi.js'
import { aiApi } from '../services/aiApi.js'
import { LoadingState, ErrorState, EmptyState } from '../components/ApiStates.jsx'
import { useNotifications } from '../hooks/useNotifications.jsx'

export default function AIConsole() {
  const { data: stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useApi(aiApi.getStats)
  const { data: tools, loading: toolsLoading, refetch: refetchTools } = useApi(aiApi.getTools)
  const { data: actions, loading: actionsLoading, refetch: refetchActions } = useApi(aiApi.getActions)
  const { data: signals, loading: signalsLoading } = useApi(aiApi.getSignals)
  const { data: sentiment, loading: sentimentLoading } = useApi(aiApi.getMarketSentiment)
  const [selectedTool, setSelectedTool] = useState(null)
  const [running, setRunning] = useState(false)
  const [runResult, setRunResult] = useState(null)
  const { push } = useNotifications()

  const statsList = stats || []
  const toolsList = tools || []
  const actionsList = actions || []
  const signalsList = signals || []
  const sentimentData = sentiment || null

  async function runTool() {
    if (!selectedTool) return
    setRunning(true)
    setRunResult(null)
    try {
      const result = await aiApi.runTool(selectedTool.name)
      setRunResult(result)
      push(`${selectedTool.name} completed`, result.summary || 'Analysis finished', 'up')
      refetchActions()
    } catch (err) {
      push('Analysis failed', err.message, 'down')
    } finally {
      setRunning(false)
    }
  }

  function selectTool(tool) {
    setSelectedTool(tool)
    setRunResult(null)
  }

  return (
    <div className="min-h-screen bg-base-950">
      <AppNav />

      <main className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Console</h1>
            <p className="mt-1 text-sm text-slate-400">
              Model performance, tool execution, live signals and market sentiment intelligence.
            </p>
          </div>
          <span className="pill bg-violet-soft text-violet-300 border border-violet-500/20 whitespace-nowrap">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 pulse-dot" />
            AI MODEL V4 · STREAMING
          </span>
        </div>

        {/* Stats */}
        {statsLoading ? (
          <LoadingState label="Loading model stats…" />
        ) : statsError ? (
          <ErrorState message={statsError} onRetry={refetchStats} />
        ) : (
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statsList.length > 0 ? statsList.map((s) => (
              <StatCard key={s.label} {...s} />
            )) : (
              <div className="col-span-full card p-6">
                <EmptyState label="Model metrics will appear here once your backend is connected" />
              </div>
            )}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
          {/* Tools sidebar */}
          <aside className="card p-5 sm:p-6">
            <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">AI tools</h2>
            {toolsLoading ? (
              <LoadingState label="Loading tools…" />
            ) : toolsList.length > 0 ? (
              <div className="mt-4 space-y-3">
                {toolsList.map((tool) => (
                  <button
                    key={tool.name}
                    onClick={() => selectTool(tool)}
                    className={`w-full text-left rounded-2xl border px-4 py-3 transition-colors ${
                      selectedTool?.name === tool.name
                        ? 'border-accent bg-accent/10 text-white'
                        : 'border-base-border bg-base-900 text-slate-300 hover:border-accent/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">{tool.name}</span>
                      <StatusPill>{tool.status}</StatusPill>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">{tool.description}</p>
                  </button>
                ))}
              </div>
            ) : (
              <EmptyState label="Tools will appear here once configured" />
            )}
          </aside>

          {/* Execution panel + signals */}
          <section className="space-y-6">
            <div className="card p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">Execution panel</h2>
                  <p className="mt-3 text-lg font-semibold text-white">
                    {selectedTool ? selectedTool.name : 'Select a tool to run'}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    {selectedTool ? selectedTool.description : 'Choose an AI tool from the left panel to generate a live analysis.'}
                  </p>
                </div>
                <button
                  onClick={runTool}
                  disabled={!selectedTool || running}
                  className="btn-outline w-full sm:w-auto disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {running ? 'Running…' : 'Run analysis'}
                </button>
              </div>

              {runResult && (
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-base-border bg-base-900/70 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Latest read</p>
                    <p className="mt-2 text-sm font-semibold text-white">{runResult.summary}</p>
                  </div>
                  <div className="rounded-xl border border-base-border bg-base-900/70 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Confidence</p>
                    <p className="mt-2 text-sm font-semibold text-accent">{runResult.confidence}</p>
                  </div>
                  <div className="rounded-xl border border-base-border bg-base-900/70 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Next move</p>
                    <p className="mt-2 text-sm font-semibold text-white">{runResult.action}</p>
                  </div>
                </div>
              )}

              {runResult?.risk && (
                <div className="mt-4 rounded-xl border border-accent/20 bg-accent/10 p-4">
                  <p className="text-sm font-semibold text-white">Risk note</p>
                  <p className="mt-1 text-sm text-slate-300">{runResult.risk}</p>
                </div>
              )}
            </div>

            {/* Live signals */}
            <div className="card p-5 sm:p-6">
              <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">Live signals</h2>
              {signalsLoading ? (
                <LoadingState label="Loading signals…" />
              ) : signalsList.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {signalsList.map((signal) => (
                    <div key={signal._id || signal.label} className="rounded-xl border border-base-border bg-base-900/70 p-3">
                      <p className="text-sm font-semibold text-white">{signal.label}</p>
                      <p className="mt-1 text-sm text-accent">{signal.value}</p>
                      <p className="mt-1 text-sm text-slate-400">{signal.detail}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState label="No active signals. Run a tool to generate insights." />
              )}
            </div>

            {/* Sentiment + Actions */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="card p-5 sm:p-6">
                <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">Market sentiment</h2>
                {sentimentLoading ? (
                  <LoadingState label="Loading sentiment…" />
                ) : sentimentData ? (
                  <div className="mt-4 rounded-xl border border-accent/20 bg-accent/10 p-4">
                    <p className="text-sm font-semibold text-white">{sentimentData.label || 'Overall mood'}</p>
                    <p className="mt-1 text-lg font-bold text-accent">{sentimentData.value || '—'}</p>
                    <p className="mt-2 text-sm text-slate-300">{sentimentData.detail}</p>
                  </div>
                ) : (
                  <EmptyState label="Sentiment data will appear here" />
                )}
              </div>

              <div className="card p-5 sm:p-6">
                <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">Recent AI actions</h2>
                {actionsLoading ? (
                  <LoadingState label="Loading actions…" />
                ) : actionsList.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {actionsList.slice(0, 6).map((a) => (
                      <div key={a._id || a.id} className="rounded-lg border border-base-border bg-base-900 p-3">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>{a._id || a.id}</span>
                          <span>{a.when}</span>
                        </div>
                        <p className="mt-1.5 font-semibold text-white text-sm">{a.label}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{a.detail}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState label="No actions yet" />
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
