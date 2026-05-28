import { createContext } from 'react'
import type { LoginRequest, RegisterRequest } from '../api/types'

export type { LoginRequest, RegisterRequest }

export interface User {
  username: string
  role: string
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)
