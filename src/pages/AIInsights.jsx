import { useState } from 'react'
import AppNav from '../components/AppNav.jsx'
import { StatCard, StatusPill } from '../components/DashboardBits.jsx'
import { aiStats, aiTools as initialAiTools, aiActions as initialAiActions } from '../data/mockData.js'

const toolPlaybooks = {
  'Trade Idea Generator': {
    summary: 'Bullish continuation setup confirmed',
    confidence: '92%',
    action: 'Add a small position on a pullback and keep the stop below the prior swing low.',
    risk: 'Risk 1.5% of capital with a defined trailing stop.',
  },
  'Risk Scanner': {
    summary: 'Exposure remains balanced across the book',
    confidence: '89%',
    action: 'Trim the largest BTC long if volatility rises above the current threshold.',
    risk: 'Margin buffer is still healthy, but watch the 24h drawdown.',
  },
  'News Summary': {
    summary: 'Macro sentiment is turning constructive',
    confidence: '94%',
    action: 'Rotate into quality liquid pairs that benefit from improving risk appetite.',
    risk: 'Avoid overleveraging into fresh headlines until confirmation arrives.',
  },
  'Sentiment Pulse': {
    summary: 'Crowd positioning is warming up',
    confidence: '87%',
    action: 'Favor trend-followers while keeping the setup disciplined and volatility-aware.',
    risk: 'Reduce size if social volume spikes and price fails to hold support.',
  },
}

export default function AIInsights() {
  const [aiTools, setAiTools] = useState(initialAiTools.map((tool) => ({ ...tool })))
  const [selectedTool, setSelectedTool] = useState(aiTools[0]?.name || '')
  const [actions, setActions] = useState(initialAiActions)
  const [running, setRunning] = useState(false)
  const [latestRun, setLatestRun] = useState({
    tool: 'Trade Idea Generator',
    summary: 'Select a tool and run a fresh analysis to generate a live recommendation.',
    confidence: '--',
    action: 'The analysis board will populate with the latest machine-guided insight.',
    risk: '--',
  })

  function runTool() {
    if (!selectedTool) return

    const selected = aiTools.find((tool) => tool.name === selectedTool)
    if (!selected) return

    const profile = toolPlaybooks[selectedTool] || {
      summary: 'Analysis completed',
      confidence: '85%',
      action: 'Maintain discipline and wait for a clean confirmation signal before acting.',
      risk: 'Keep the stop visible and the position size consistent with your plan.',
    }

    setRunning(true)
    setAiTools((prev) => prev.map((tool) => (tool.name === selectedTool ? { ...tool, status: 'Running' } : tool)))
    setLatestRun({
      tool: selectedTool,
      summary: profile.summary,
      confidence: profile.confidence,
      action: profile.action,
      risk: profile.risk,
    })

    setTimeout(() => {
      const now = new Date()
      const id = `AI-${Math.floor(Math.random() * 900) + 100}`
      const label = `${selectedTool} completed`
      const detail = `${profile.summary} · ${profile.action}`
      const when = now.toLocaleTimeString()

      setActions((prev) => [{ id, label, detail, when }, ...prev].slice(0, 20))
      setAiTools((prev) => prev.map((tool) => (tool.name === selectedTool ? { ...tool, status: 'Ready' } : tool)))
      setRunning(false)
    }, 900)
  }

  function handleSelectTool(toolName) {
    setSelectedTool(toolName)
    const profile = toolPlaybooks[toolName] || {
      summary: 'Fresh read available',
      confidence: '85%',
      action: 'Use the run button to generate a live signal for this module.',
      risk: 'Position size should stay consistent with your current plan.',
    }

    setLatestRun({
      tool: toolName,
      summary: profile.summary,
      confidence: profile.confidence,
      action: profile.action,
      risk: profile.risk,
    })
  }

  const activeTool = aiTools.find((tool) => tool.name === selectedTool) || aiTools[0]

  return (
    <div className="min-h-screen bg-base-950">
      <AppNav />

      <main className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Insights</h1>
            <p className="mt-1 text-sm text-slate-400">Interactive analysis for signal generation, risk scanning, news synthesis, and portfolio actions.</p>
          </div>
          <div className="card px-4 py-2 text-sm text-slate-400 whitespace-nowrap">
            Tool status updated <span className="font-semibold text-white">Just now</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {aiStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
          <aside className="card p-5 sm:p-6">
            <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">AI tools</h2>
            <div className="mt-4 space-y-3">
              {aiTools.map((tool) => (
                <button
                  key={tool.name}
                  onClick={() => handleSelectTool(tool.name)}
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
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-bold tracking-wide text-slate-300 uppercase">Selected tool</h2>
                  <p className="mt-3 text-lg font-semibold text-white">{selectedTool}</p>
                  <p className="mt-2 text-sm text-slate-400">{activeTool?.description}</p>
                </div>
                <button onClick={runTool} disabled={running} className="btn-outline w-full sm:w-auto">
                  {running ? 'Running…' : 'Run analysis'}
                </button>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-base-border bg-base-900/70 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Latest read</p>
                  <p className="mt-2 text-sm font-semibold text-white">{latestRun.summary}</p>
                </div>
                <div className="rounded-xl border border-base-border bg-base-900/70 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Confidence</p>
                  <p className="mt-2 text-sm font-semibold text-accent">{latestRun.confidence}</p>
                </div>
                <div className="rounded-xl border border-base-border bg-base-900/70 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Next move</p>
                  <p className="mt-2 text-sm font-semibold text-white">{latestRun.action}</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-accent/20 bg-accent/10 p-4">
                <p className="text-sm font-semibold text-white">Risk note</p>
                <p className="mt-1 text-sm text-slate-300">{latestRun.risk}</p>
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
