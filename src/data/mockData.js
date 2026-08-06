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
