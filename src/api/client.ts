import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.DEV ? '' : import.meta.env.VITE_URL_API,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (originalRequest.url?.endsWith('/api/auth/me')) {
        return Promise.reject(error)
      }

      try {
        await apiClient.post('/api/auth/refresh')
        return apiClient(originalRequest)
      } catch {
        window.dispatchEvent(new CustomEvent('auth:session-expired'))
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient
