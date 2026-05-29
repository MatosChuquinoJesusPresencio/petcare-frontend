import apiClient from '../api/client'
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  TokenRefreshResponse,
} from '../types/authTypes'

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data)
    return response.data
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', data)
    return response.data
  },

  async refreshToken(): Promise<TokenRefreshResponse> {
    const response = await apiClient.post<TokenRefreshResponse>('/api/auth/refresh')
    return response.data
  },

  async logout(): Promise<void> {
    await apiClient.post('/api/auth/logout')
  },

  async me(): Promise<AuthResponse> {
    const response = await apiClient.get<AuthResponse>('/api/auth/me')
    return response.data
  },
}
