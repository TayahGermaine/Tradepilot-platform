import { api } from './api.js'

export const clientApi = {
  getProfile: () => api.get('/client/profile'),
  getPortfolio: () => api.get('/client/portfolio'),
  getPositions: () => api.get('/client/positions'),
  getWallet: () => api.get('/client/wallet'),
  getHoldings: () => api.get('/client/holdings'),
  getTransactions: () => api.get('/client/transactions'),
  getOrders: () => api.get('/client/orders'),
  placeOrder: (order) => api.post('/client/orders', order),
  cancelOrder: (orderId) => api.delete(`/client/orders/${orderId}`),
  requestDeposit: (data) => api.post('/client/wallet/deposit', data),
  requestWithdrawal: (data) => api.post('/client/wallet/withdraw', data),
  getAiSignals: () => api.get('/client/ai/signals'),
  getAiTools: () => api.get('/client/ai/tools'),
  runAiTool: (toolName) => api.post('/client/ai/run', { tool: toolName }),
  getKycStatus: () => api.get('/client/kyc'),
  submitKyc: (data) => api.post('/client/kyc', data),
}
