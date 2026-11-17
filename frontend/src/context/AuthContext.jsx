import { createContext, useContext, useState } from 'react'
import { loginUser, registerUser, getCurrentUser } from '../api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)

  const login = async (credentials) => {
    const { data } = await loginUser(credentials)
    localStorage.setItem('token', data.token)
    setToken(data.token)
    // Fetch full user profile (name, role, income...) since login only
    // returns a token. If it fails, keep going — token is still valid.
    try {
      const me = await getCurrentUser()
      const userData = me.data
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
    } catch {
      // ignore — /auth/me may be unavailable; token-based auth still works
    }
    return data
  }

  const register = async (payload) => {
    const { data } = await registerUser(payload)
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    setUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
