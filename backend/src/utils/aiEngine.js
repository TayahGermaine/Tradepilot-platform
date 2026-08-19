// Centralizes the "AI" data shown across the client dashboard, AI console,
// and broker/admin views. There's no real model behind this — it produces
// deterministic-ish, slightly randomized demo output so the UI has
// something live to render. Swap runTool()/getSignals() etc. for real
// model or market-data calls when you're ready.

const PAIRS = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'XRP/USDT', 'LINK/USDT']

function rand(min, max) {
  return Math.random() * (max - min) + min
}

export function getAiStats() {
  return [
    { label: 'Model confidence', value: `${Math.round(rand(85, 97))}%`, delta: '+5 pts (1h)', tone: 'up' },
    { label: 'Signal accuracy', value: `${Math.round(rand(80, 92))}%`, delta: '+2 pts (24h)', tone: 'up' },
    { label: 'News relevance', value: `${Math.round(rand(88, 97))}%`, delta: 'Stable', tone: 'neutral' },
    { label: 'Latency', value: `${Math.round(rand(150, 260))}ms`, delta: 'Low', tone: 'up' },
  ]
}

export function getAiTools() {
  return [
    { name: 'Trade Idea Generator', description: 'Produce entry, stop and target levels based on current market structure.', status: 'Ready' },
    { name: 'Risk Scanner', description: 'Scan open positions and orders for margin, exposure, and correlation risk.', status: 'Ready' },
    { name: 'News Summary', description: 'Translate market headlines into actionable insight for your book.', status: 'Ready' },
    { name: 'Sentiment Pulse', description: 'Score market mood across top venues and asset classes.', status: 'Ready' },
  ]
}

export function getClientAiTools() {
  return [
    { name: 'Position Scanner', description: 'Check open exposure, leverage, and risk across your active positions.', status: 'Ready' },
    { name: 'Auto Rebalance', description: 'Suggest portfolio adjustments when allocation drift exceeds thresholds.', status: 'Ready' },
    { name: 'Profit Target Engine', description: 'Generate ideal take-profit levels for current positions.', status: 'Ready' },
    { name: 'Risk Shield', description: 'Monitor margin, liquidity and cross-asset correlation risks live.', status: 'Ready' },
  ]
}

export function getAiActions() {
  return [
    { id: 'AI-321', label: 'ETH volatility watchlist updated', detail: 'Signal now favors downside support at $3,700.', when: '2m ago' },
    { id: 'AI-318', label: 'Margin stress alert', detail: 'Client book exposure rising on BTC longs.', when: '18m ago' },
    { id: 'AI-312', label: 'Macro news digest', detail: 'Fed commentary drives EURUSD and BTC correlation.', when: '45m ago' },
  ]
}

export function getAiSignals() {
  return PAIRS.map((pair) => {
    const bullish = Math.random() > 0.4
    return {
      pair,
      signal: bullish ? 'Long' : 'Short',
      confidence: Math.round(rand(60, 96)),
      note: bullish
        ? `Structure favors upside continuation on ${pair.split('/')[0]}.`
        : `Momentum weakening, watch downside on ${pair.split('/')[0]}.`,
    }
  })
}

export function getMarketSentiment() {
  const breakdown = PAIRS.map((pair) => {
    const score = Math.round(rand(-100, 100))
    return {
      asset: pair.split('/')[0],
      sentiment: score > 15 ? 'Bullish' : score < -15 ? 'Bearish' : 'Neutral',
      score,
    }
  })
  const avg = Math.round(breakdown.reduce((sum, b) => sum + b.score, 0) / breakdown.length)
  return {
    overall: avg > 15 ? 'Bullish' : avg < -15 ? 'Bearish' : 'Neutral',
    score: avg,
    breakdown,
  }
}

export function getNewsDigest() {
  return [
    {
      headline: 'Fed signals steady rates into next quarter',
      impact: 'Medium',
      affected: ['BTC', 'ETH'],
      action: 'Monitor correlation with risk assets; no immediate action.',
    },
    {
      headline: 'Major exchange reports record derivatives volume',
      impact: 'Low',
      affected: ['BTC'],
      action: 'Liquidity improving — tighter spreads expected.',
    },
    {
      headline: 'Layer-2 network upgrade completes mainnet rollout',
      impact: 'Medium',
      affected: ['ETH'],
      action: 'Watch for fee compression and increased on-chain activity.',
    },
  ]
}

export function runTool(toolName) {
  return {
    tool: toolName,
    result: `${toolName} completed. Reviewed current market structure and account exposure — no critical issues found.`,
    ranAt: new Date().toISOString(),
  }
}
