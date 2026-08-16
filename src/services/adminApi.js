import { api } from './api.js'

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getWithdrawals: () => api.get('/admin/withdrawals'),
  approveWithdrawal: (ref) => api.patch(`/admin/withdrawals/${ref}`, { decision: 'approved' }),
  holdWithdrawal: (ref) => api.patch(`/admin/withdrawals/${ref}`, { decision: 'hold' }),
  getSystemHealth: () => api.get('/admin/health'),
  getUsers: () => api.get('/admin/users'),
  getUserDetail: (userId) => api.get(`/admin/users/${userId}`),
  updateUserRole: (userId, role) => api.patch(`/admin/users/${userId}`, { role }),
  getKycQueue: () => api.get('/admin/kyc'),
  approveKyc: (userId) => api.patch(`/admin/kyc/${userId}`, { decision: 'approved' }),
  rejectKyc: (userId) => api.patch(`/admin/kyc/${userId}`, { decision: 'rejected' }),
}
