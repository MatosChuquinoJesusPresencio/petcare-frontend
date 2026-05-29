export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: string
}

export interface AuthResponse {
  id: number
  token: string | null
  refreshToken: string | null
  username: string
  role: string
}

export interface TokenRefreshResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
}

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}
