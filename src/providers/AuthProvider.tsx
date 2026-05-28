import { useState, useEffect, useCallback, type ReactNode } from 'react'
import { authService } from '../services/authService'
import { AuthContext, type LoginRequest, type RegisterRequest } from '../contexts/authContext'
import { getErrorMessage } from '../utils/errorHandler'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ username: string; role: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    authService.me()
      .then((data) => setUser({ username: data.username, role: data.role }))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (data: LoginRequest) => {
    setError(null)
    try {
      const response = await authService.login(data)
      setUser({ username: response.username, role: response.role })
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)
      throw err
    }
  }, [])

  const register = useCallback(async (data: RegisterRequest) => {
    setError(null)
    try {
      const response = await authService.register(data)
      setUser({ username: response.username, role: response.role })
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
