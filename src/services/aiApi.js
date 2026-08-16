import { api } from './api.js'

export const aiApi = {
  getStats: () => api.get('/ai/stats'),
  getTools: () => api.get('/ai/tools'),
  runTool: (toolName) => api.post('/ai/run', { tool: toolName }),
  getActions: () => api.get('/ai/actions'),
  getSignals: () => api.get('/ai/signals'),
  getMarketSentiment: () => api.get('/ai/sentiment'),
  getNewsDigest: () => api.get('/ai/news-digest'),
}
