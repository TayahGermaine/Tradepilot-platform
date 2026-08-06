export const currentUser = {
  name: 'Alex Rivera',
  role: 'Client Portal',
  avatar: 'https://i.pravatar.cc/64?img=13',
  twoFA: true,
}

export const brokerDesk = {
  broker: 'Marcus Chen',
  region: 'EMEA',
}

export const brokerStats = [
  { label: 'Clients under management', value: '128', delta: '+6 this month', tone: 'up' },
  { label: 'Book equity', value: '$4.21M', delta: '+2.1% (7d)', tone: 'up' },
  { label: 'Commission (MTD)', value: '$18,420.55', delta: 'Accrued, unpaid', tone: 'neutral' },
  { label: 'Margin alerts', value: '2', delta: '1 margin call open', tone: 'down' },
]

export const clientBook = [
  { name: 'Alex Rivera', equity: '$42,892.40', margin: 32, pnl: '+$1,394.90', pnlTone: 'up', status: 'Healthy' },
  { name: 'Priya Nair', equity: '$18,450.00', margin: 61, pnl: '-$820.40', pnlTone: 'down', status: 'Watch' },
  { name: 'Tomas Halle', equity: '$2,100.00', margin: 88, pnl: '-$412.10', pnlTone: 'down', status: 'Margin call' },
  { name: 'Lena Vogt', equity: '$71,230.80', margin: 24, pnl: '+$4,210.60', pnlTone: 'up', status: 'Healthy' },
]

export const brokerRequests = [
  {
    id: 'RQ-2201',
    client: 'Priya Nair',
    detail: 'Leverage increase to 10x on ETH/USDT',
  },
  {
    id: 'RQ-2198',
    client: 'Tomas Halle',
    detail: 'Withdrawal release — $2,100 USDT',
  },
  {
    id: 'RQ-2190',
    client: 'Lena Vogt',
    detail: 'Add SOL perpetuals to trading permissions',
  },
]

export const aiStats = [
  { label: 'Model confidence', value: '92%', delta: '+5 pts (1h)', tone: 'up' },
  { label: 'Signal accuracy', value: '87%', delta: '+2 pts (24h)', tone: 'up' },
  { label: 'News relevance', value: '94%', delta: 'Stable', tone: 'neutral' },
  { label: 'Latency', value: '220ms', delta: 'Low', tone: 'up' },
]

export const aiTools = [
  { name: 'Trade Idea Generator', description: 'Produce entry, stop and target levels based on current market structure.', status: 'Ready' },
  { name: 'Risk Scanner', description: 'Scan open positions and orders for margin, exposure, and correlation risk.', status: 'Ready' },
  { name: 'News Summary', description: 'Translate market headlines into actionable insight for your book.', status: 'Ready' },
  { name: 'Sentiment Pulse', description: 'Score market mood across top venues and asset classes.', status: 'Ready' },
]

export const aiActions = [
  { id: 'AI-321', label: 'ETH volatility watchlist updated', detail: 'Signal now favors downside support at $3,700.', when: '2m ago' },
  { id: 'AI-318', label: 'Margin stress alert', detail: 'Client book exposure rising on BTC longs.', when: '18m ago' },
  { id: 'AI-312', label: 'Macro news digest', detail: 'Fed commentary drives EURUSD and BTC correlation.', when: '45m ago' },
]

export const adminStats = [
  { label: 'Active clients', value: '8,412', delta: '+184 this week', tone: 'up' },
  { label: 'Brokers', value: '36', delta: '4 pending onboarding', tone: 'neutral' },
  { label: 'Platform volume (24h)', value: '$184.2M', delta: '+9.4% vs yesterday', tone: 'up' },
  { label: 'Withdrawals awaiting', value: '3', delta: '1 flagged high risk', tone: 'down' },
]

export const withdrawalApprovals = [
  { ref: 'WD-4412', client: 'Alex Rivera', amount: '$12,400.00', rail: 'Binance · BTC', risk: 'Medium' },
  { ref: 'WD-4409', client: 'Priya Nair', amount: '$3,200.00', rail: 'Bank · SEPA', risk: 'Low' },
  { ref: 'WD-4401', client: 'Tomas Halle', amount: '$2,100.00', rail: 'Binance · USDT', risk: 'High' },
]

export const systemHealth = [
  { label: 'Matching engine', value: '1.2ms p99', pct: 96, tone: 'up' },
  { label: 'Market data feed', value: 'Connected', pct: 100, tone: 'up' },
  { label: 'Binance bridge', value: 'Nominal', pct: 92, tone: 'up' },
  { label: 'Payment gateway', value: 'Degraded', pct: 58, tone: 'warn' },
]

export const walletStats = [
  { label: 'Total wallet balance', value: '$128,740.15', delta: '+4.8% (24h)', tone: 'up' },
  { label: 'Available cash', value: '$24,190.00', delta: 'Ready to trade', tone: 'neutral' },
  { label: 'Collateral locked', value: '$52,800.00', delta: 'Margin positions', tone: 'down' },
  { label: 'Open transfers', value: '2', delta: 'Pending settlement', tone: 'neutral' },
]

export const walletHoldings = [
  { asset: 'BTC', amount: '1.27 BTC', value: '$76,520.00', allocation: 59, status: 'Active' },
  { asset: 'ETH', amount: '8.94 ETH', value: '$22,170.00', allocation: 18, status: 'Active' },
  { asset: 'USDT', amount: '$20,080.15', value: '$20,080.15', allocation: 16, status: 'Active' },
  { asset: 'SOL', amount: '37.1 SOL', value: '$9,970.00', allocation: 7, status: 'Pending' },
]

export const recentTransactions = [
  { id: 'TX-9912', action: 'Deposit', asset: 'USDT', amount: '$5,000.00', when: 'Updated 12m ago' },
  { id: 'TX-9907', action: 'Swap', asset: 'ETH → USDT', amount: '$8,200.00', when: '1h ago' },
  { id: 'TX-9898', action: 'Withdrawal', asset: 'BTC', amount: '0.05 BTC', when: '3h ago' },
]

export const portfolioStats = [
  { label: 'Current NAV', value: '$14,280.20', delta: '+3.1% (24h)', tone: 'up' },
  { label: 'Unrealized PnL', value: '+$1,120.80', delta: 'Net exposure', tone: 'up' },
  { label: 'Open positions', value: '6', delta: '2 new this session', tone: 'neutral' },
  { label: 'Margin usage', value: '41%', delta: 'Within limit', tone: 'down' },
]

export const portfolioTools = [
  {
    name: 'Position Scanner',
    description: 'Check open exposure, leverage, and risk across your active positions.',
    status: 'Ready',
  },
  {
    name: 'Auto Rebalance',
    description: 'Suggest portfolio adjustments when allocation drift exceeds thresholds.',
    status: 'Ready',
  },
  {
    name: 'Profit Target Engine',
    description: 'Generate ideal take-profit levels for current positions.',
    status: 'Ready',
  },
  {
    name: 'Risk Shield',
    description: 'Monitor margin, liquidity and cross-asset correlation risks live.',
    status: 'Ready',
  },
]

export const portfolioPositions = [
  { symbol: 'BTC/USDT', size: '0.55 BTC', entry: '$68,900', mark: '$69,600', pnl: '+$385', status: 'Hedged' },
  { symbol: 'ETH/USDT', size: '6.2 ETH', entry: '$3,850', mark: '$3,920', pnl: '+$420', status: 'Long' },
  { symbol: 'SOL/USDT', size: '27.4 SOL', entry: '$162', mark: '$175', pnl: '+$358', status: 'Long' },
  { symbol: 'LINK/USDT', size: '2,800 LINK', entry: '$7.30', mark: '$7.85', pnl: '+$1,540', status: 'Scalp' },
]

export const usersAndRoles = [
  { name: 'Alex Rivera', role: 'Client', broker: 'M. Chen', kyc: 'Verified', equity: '$42,892.40' },
  { name: 'Priya Nair', role: 'Client', broker: 'M. Chen', kyc: 'Pending', equity: '$18,450.00' },
  { name: 'Marcus Chen', role: 'Broker', broker: '—', kyc: 'Verified', equity: '–' },
  { name: 'Dana Okoro', role: 'Broker', broker: '—', kyc: 'Verified', equity: '–' },
  { name: 'Tomas Halle', role: 'Client', broker: 'D. Okoro', kyc: 'Rejected', equity: '$2,100.00' },
]

export const heroStats = [
  { value: '38.4B', label: '24h volume' },
  { value: '99.99%', label: 'Matching uptime' },
  { value: '140+', label: 'Markets' },
]

export const landingFeatures = [
  {
    title: 'Live market monitoring',
    desc: 'Candlestick depth, market cap, volume and trending status across the majors.',
    icon: 'chart',
  },
  {
    title: 'AI trade plans',
    desc: 'Buy zones, stop loss, take profit and position sizing scored by conviction.',
    icon: 'target',
  },
  {
    title: 'News, explained simply',
    desc: 'Every headline translated into impact, affected coins and a suggested action.',
    icon: 'doc',
  },
]
