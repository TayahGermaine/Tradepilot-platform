import { api } from './api.js'

export const brokerApi = {
  getProfile: () => api.get('/broker/profile'),
  getStats: () => api.get('/broker/stats'),
  getClientBook: () => api.get('/broker/clients'),
  getClientDetail: (clientId) => api.get(`/broker/clients/${clientId}`),
  getRequests: () => api.get('/broker/requests'),
  approveRequest: (requestId) => api.patch(`/broker/requests/${requestId}`, { decision: 'approved' }),
  declineRequest: (requestId) => api.patch(`/broker/requests/${requestId}`, { decision: 'declined' }),
  getMarginAlerts: () => api.get('/broker/alerts'),
}
