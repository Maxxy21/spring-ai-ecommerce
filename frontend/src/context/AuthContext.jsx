import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

/**
 * Provides the current user identity throughout the app.
 * Replace the hardcoded userId with real auth (JWT decode, OAuth, etc.)
 * when a login system is added to the backend.
 */
export function AuthProvider({ children }) {
  // TODO: replace with real auth — decode JWT from localStorage or call /auth/me
  const [userId] = useState('demo-user')

  return (
    <AuthContext.Provider value={{ userId }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
