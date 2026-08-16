import { useEffect, useState, useCallback } from 'react'

const DEFAULT_COINS = ['bitcoin', 'ethereum', 'solana', 'ripple', 'chainlink']

export const SYMBOL_MAP = {
  bitcoin: { symbol: 'BTC', pair: 'BTC/USDT' },
  ethereum: { symbol: 'ETH', pair: 'ETH/USDT' },
  solana: { symbol: 'SOL', pair: 'SOL/USDT' },
  ripple: { symbol: 'XRP', pair: 'XRP/USDT' },
  chainlink: { symbol: 'LINK', pair: 'LINK/USDT' },
}

const FALLBACK = [
  { id: 'bitcoin', symbol: 'BTC', pair: 'BTC/USDT', price: 68492, change: 2.34, volume: 4800000000, sparkline: [67000, 67200, 66800, 67500, 68000, 68100, 67900, 68300, 68500, 68492] },
  { id: 'ethereum', symbol: 'ETH', pair: 'ETH/USDT', price: 3742, change: 1.18, volume: 2100000000, sparkline: [3680, 3700, 3690, 3720, 3710, 3730, 3725, 3740, 3738, 3742] },
  { id: 'solana', symbol: 'SOL', pair: 'SOL/USDT', price: 186.4, change: -0.74, volume: 860000000, sparkline: [188, 187.5, 187, 186.8, 186.5, 186.2, 186.8, 186.5, 186.3, 186.4] },
  { id: 'ripple', symbol: 'XRP', pair: 'XRP/USDT', price: 0.629, change: 0.91, volume: 540000000, sparkline: [0.622, 0.624, 0.623, 0.626, 0.625, 0.627, 0.626, 0.628, 0.627, 0.629] },
  { id: 'chainlink', symbol: 'LINK', pair: 'LINK/USDT', price: 19.34, change: -1.12, volume: 320000000, sparkline: [19.6, 19.5, 19.55, 19.45, 19.4, 19.42, 19.38, 19.35, 19.36, 19.34] },
]

function formatVolume(v) {
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`
  if (v >= 1e6) return `$${(v / 1e6).toFixed(0)}M`
  return `$${v.toLocaleString()}`
}

export function formatPrice(p) {
  if (p >= 1000) return `$${p.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  if (p >= 1) return `$${p.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
  return `$${p.toFixed(4)}`
}

function transformCoin(coin) {
  const meta = SYMBOL_MAP[coin.id] || { symbol: coin.symbol?.toUpperCase(), pair: `${coin.symbol?.toUpperCase()}/USDT` }
  const market = coin.market_data || coin
  return {
    id: coin.id,
    symbol: meta.symbol,
    pair: meta.pair,
    name: coin.name || meta.symbol,
    image: coin.image,
    price: market.current_price ?? market.price ?? 0,
    change: market.price_change_percentage_24h ?? market.change ?? 0,
    volume: market.total_volume ?? market.volume ?? 0,
    marketCap: market.market_cap ?? 0,
    high24h: market.high_24h ?? 0,
    low24h: market.low_24h ?? 0,
    sparkline: market.sparkline_7d?.price || market.sparkline || [],
    volumeStr: formatVolume(market.total_volume ?? market.volume ?? 0),
  }
}

export function useLiveMarkets(coins = DEFAULT_COINS, intervalMs = 30000) {
  const [data, setData] = useState(FALLBACK.map(transformCoin))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchMarkets = useCallback(async () => {
    try {
      const ids = coins.join(',')
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=true&price_change_percentage=24h`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`API responded ${res.status}`)
      const json = await res.json()
      if (!Array.isArray(json) || json.length === 0) throw new Error('Empty response')
      setData(json.map(transformCoin))
      setError(null)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message)
      if (!lastUpdated) setData(FALLBACK.map(transformCoin))
    } finally {
      setLoading(false)
    }
  }, [coins, lastUpdated])

  useEffect(() => {
    fetchMarkets()
    const timer = setInterval(fetchMarkets, intervalMs)
    return () => clearInterval(timer)
  }, [fetchMarkets, intervalMs])

  return { data, loading, error, lastUpdated, refresh: fetchMarkets }
}

export function useLiveCoin(coinId = 'bitcoin', intervalMs = 30000) {
  const [coin, setCoin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCoin = useCallback(async () => {
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`)
      if (!res.ok) throw new Error(`API responded ${res.status}`)
      const json = await res.json()
      setCoin(transformCoin(json))
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [coinId])

  useEffect(() => {
    fetchCoin()
    const timer = setInterval(fetchCoin, intervalMs)
    return () => clearInterval(timer)
  }, [fetchCoin, intervalMs])

  return { coin, loading, error }
}

export { formatVolume }
