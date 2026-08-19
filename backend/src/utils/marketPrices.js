// The frontend gets live prices from CoinGecko directly (see useLiveMarkets.js).
// The backend only needs approximate prices to value wallet balances for
// summary stats — these mirror that hook's FALLBACK table. Swap this for a
// real price feed/cache (e.g. a scheduled job hitting CoinGecko) in production.
export const ASSET_PRICES = {
  BTC: 68492,
  ETH: 3742,
  SOL: 186.4,
  XRP: 0.629,
  LINK: 19.34,
  USDT: 1,
}

export function priceOf(symbol) {
  return ASSET_PRICES[symbol.toUpperCase()] ?? 1
}
