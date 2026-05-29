import { createContext } from 'react'
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types'

export type { LoginRequest, RegisterRequest, AuthResponse }

export interface User {
  id: number
  username: string
  role: string
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (data: LoginRequest) => Promise<AuthResponse>
  register: (data: RegisterRequest) => Promise<AuthResponse>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)
