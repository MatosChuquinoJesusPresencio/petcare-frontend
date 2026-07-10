import { useState, useEffect, useCallback, type ReactNode } from 'react'
import { authService } from '../services'
import { AuthContext, type LoginRequest, type RegisterRequest, type AuthResponse } from '../contexts/authContext'
import { getErrorMessage } from '../utils/errorHandler'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ id: number; email: string; role: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const onSessionExpired = () => setUser(null)
    window.addEventListener('auth:session-expired', onSessionExpired)

    authService.me()
      .then((data) => {
        if (data?.id && data?.role) {
          setUser({ id: data.id, email: data.username, role: data.role })
        } else {
          setUser(null)
        }
      })
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))

    return () => window.removeEventListener('auth:session-expired', onSessionExpired)
  }, [])

  const login = useCallback(async (data: LoginRequest): Promise<AuthResponse> => {
    setError(null)
    try {
      const response = await authService.login(data)
      setUser({ id: response.id, email: response.username, role: response.role })
      return response
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)
      throw new Error(message, { cause: err })
    }
  }, [])

  const register = useCallback(async (data: RegisterRequest): Promise<AuthResponse> => {
    setError(null)
    try {
      const response = await authService.register(data)
      setUser({ id: response.id, email: response.username, role: response.role })
      return response
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)
      throw new Error(message, { cause: err })
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // ignore logout errors
    } finally {
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
