import { useState } from 'react'
import AppNav from '../components/AppNav.jsx'
import { StatCard, StatusPill } from '../components/DashboardBits.jsx'
import { aiStats, aiTools as initialAiTools, aiActions as initialAiActions } from '../data/mockData.js'

export default function AIInsights() {
  const [aiTools, setAiTools] = useState(initialAiTools.map((t) => ({ ...t })))
  const [selectedTool, setSelectedTool] = useState(aiTools[0]?.name || '')
  const [actions, setActions] = useState(initialAiActions)
  const [running, setRunning] = useState(false)

  function runTool() {
    if (!selectedTool) return
    setRunning(true)
    // mark tool as running
    setAiTools((prev) => prev.map((t) => (t.name === selectedTool ? { ...t, status: 'Running' } : t)))

    // simulate async analysis
    setTimeout(() => {
      // create a fake action result
      const now = new Date()
      const id = `AI-${Math.floor(Math.random() * 900) + 100}`
      const label = `${selectedTool} ran` 
      const detail = `Automated run completed for ${selectedTool} — results stored.`
      const when = now.toLocaleTimeString()

      setActions((prev) => [{ id, label, detail, when }, ...prev].slice(0, 20))

      // set tool back to Ready
      setAiTools((prev) => prev.map((t) => (t.name === selectedTool ? { ...t, status: 'Ready' } : t)))
      setRunning(false)
    }, 900)
  }

  return (
    <div className="min-h-screen bg-base-950">
      <AppNav />

      <main className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Insights</h1>
            <p className="mt-1 text-sm text-slate-400">Active AI tools for signal generation, risk scanning, news synthesis, and portfolio actions.</p>
          </div>
          <div className="card px-4 py-2 text-sm text-slate-400 whitespace-nowrap">
            Tool status updated <span className="font-semibold text-white">Just now</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {aiStats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
          <aside className="card p-5 sm:p-6">
            <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">AI tools</h2>
            <div className="mt-4 space-y-3">
              {aiTools.map((tool) => (
                <button
                  key={tool.name}
                  onClick={() => setSelectedTool(tool.name)}
                  className={`w-full text-left rounded-2xl border px-4 py-3 transition-colors ${
                    selectedTool === tool.name
                      ? 'border-accent bg-accent/10 text-white'
                      : 'border-base-border bg-base-900 text-slate-300 hover:border-accent/30 hover:bg-base-900/80'
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
          </aside>

          <section className="space-y-6">
            <div className="card p-5 sm:p-6">
              <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">Selected tool</h2>
              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold text-white">{selectedTool}</p>
                  <p className="mt-2 text-sm text-slate-400">{aiTools.find((t) => t.name === selectedTool)?.description}</p>
                </div>
                <button onClick={runTool} disabled={running} className="btn-outline w-full sm:w-auto">
                  {running ? 'Running…' : 'Run analysis'}
                </button>
              </div>
            </div>

            <div className="card p-5 sm:p-6">
              <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">Recent AI actions</h2>
              <div className="mt-4 space-y-3">
                {actions.map((action) => (
                  <div key={action.id} className="rounded-lg border border-base-border bg-base-900 p-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{action.id}</span>
                      <span>{action.when}</span>
                    </div>
                    <p className="mt-2 font-semibold text-white">{action.label}</p>
                    <p className="mt-1 text-sm text-slate-500">{action.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
