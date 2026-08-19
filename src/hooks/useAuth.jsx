import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authApi } from '../services/authApi.js'
import { getRoleDashboard } from '../services/authApi.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = authApi.getStoredUser()
    const token = authApi.isStoredToken()
    if (stored && token) {
      setUser(stored)
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password, role) => {
    const result = await authApi.login(email, password, role)
    localStorage.setItem('tradepilot_token', result.token)
    localStorage.setItem('tradepilot_user', JSON.stringify(result.user))
    setUser(result.user)
    return result.user
  }, [])

  const register = useCallback(async (data) => {
    const result = await authApi.register(data)
    if (result.token) {
      localStorage.setItem('tradepilot_token', result.token)
      localStorage.setItem('tradepilot_user', JSON.stringify(result.user))
      setUser(result.user)
    }
    return result
  }, [])

  const logout = useCallback(() => {
    authApi.logout()
    setUser(null)
  }, [])

  const isAdmin = user?.role === 'admin'
  const isBroker = user?.role === 'broker'
  const isClient = user?.role === 'client'

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isBroker, isClient }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export { getRoleDashboard }
