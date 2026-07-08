export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  password: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: string
}

export interface AuthResponse {
  id: number
  username: string
  role: string
}

export interface TokenRefreshResponse {
  accessToken: string
}

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}
