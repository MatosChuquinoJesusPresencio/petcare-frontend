import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean; _networkRetry?: boolean }

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason: unknown) => void
}> = []

function processQueue(error: unknown, token: unknown = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })
  failedQueue = []
}

const apiClient = axios.create({
  baseURL: import.meta.env.DEV ? '' : import.meta.env.VITE_URL_API,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 30000,
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryConfig | undefined

    if (!originalRequest) {
      return Promise.reject(error)
    }

    const isNetworkError = !error.response
    const isUnauthorized = [401, 403].includes(error.response?.status)

    if (isNetworkError && !originalRequest._networkRetry) {
      originalRequest._networkRetry = true
      await new Promise((r) => setTimeout(r, 3000))
      return apiClient(originalRequest)
    }

    if (!isUnauthorized) {
      return Promise.reject(error)
    }

    if (originalRequest.url?.endsWith('/api/auth/refresh') || originalRequest.url?.endsWith('/api/auth/login')) {
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then(() => apiClient(originalRequest))
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      await apiClient.post('/api/auth/refresh')
      processQueue(null)
      return apiClient(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError)
      window.dispatchEvent(new CustomEvent('auth:session-expired'))
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default apiClient
