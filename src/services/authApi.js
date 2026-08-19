import { api } from './api.js'

const ADMIN_CREDENTIALS = {
  email: 'admin@tradepilot.io',
  password: 'AdminSecure2026!',
  user: {
    id: 'admin-0000',
    name: 'System Administrator',
    email: 'admin@tradepilot.io',
    role: 'admin',
    twoFA: true,
  },
}

const ROLE_DASHBOARD = {
  client: '/dashboard',
  broker: '/broker',
  admin: '/admin',
}

export function getRoleDashboard(role) {
  return ROLE_DASHBOARD[role] || '/login'
}

export const authApi = {
  login: async (email, password, role) => {
    if (role === 'admin') {
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        const token = btoa(`${ADMIN_CREDENTIALS.email}:${Date.now()}`)
        const user = { ...ADMIN_CREDENTIALS.user }
        return { token, user }
      }
      throw new Error('Invalid admin credentials')
    }

    const result = await api.post('/auth/login', { email, password, role })
    return result
  },

  register: async (data) => {
    const payload = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      role: data.role || 'client',
    }
    if (payload.role === 'admin') {
      throw new Error('Admin accounts cannot be created through signup')
    }
    const result = await api.post('/auth/register', payload)
    return result
  },

  logout: () => {
    localStorage.removeItem('tradepilot_token')
    localStorage.removeItem('tradepilot_user')
  },

  getStoredUser: () => {
    try {
      const raw = localStorage.getItem('tradepilot_user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },

  isStoredToken: () => !!localStorage.getItem('tradepilot_token'),
}

export { ADMIN_CREDENTIALS }
